import { SupabaseClient } from '@supabase/supabase-js';

export type NormalizedRow = { 
  naab?: string;
  sire_naab?: string;
  mgs_naab?: string;
  mmgs_naab?: string;
  import_batch_id?: string;
  uploader_user_id?: string;
  row_number?: number;
  [k: string]: any;
};

function chunkArray<T>(arr: T[], size = 100): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function normalizeNaab(s?: string | null): string | null {
  if (!s) return null;
  const cleaned = s
    .toString()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control chars
    .replace(/[\s-]+/g, '')  // remove spaces and hyphens
    .trim()
    .toUpperCase();
  return cleaned === '' ? null : cleaned;
}

/**
 * Generate all plausible NAAB code variants for fuzzy matching.
 * Handles: leading zeros (007HO→7HO), HO↔H breed code (200HO10624↔200H10624).
 */
function naabVariants(naab: string): string[] {
  const variants = new Set<string>();
  variants.add(naab);

  // Strip leading zeros: 007HO12988 → 7HO12988
  const noLeadingZeros = naab.replace(/^0+/, '');
  if (noLeadingZeros) variants.add(noLeadingZeros);

  // HO ↔ H conversion: 200HO10624 ↔ 200H10624
  // Pattern: digits + HO + digits  →  digits + H + digits
  const hoMatch = naab.match(/^(\d+)HO(\d+)$/);
  if (hoMatch) {
    variants.add(`${hoMatch[1]}H${hoMatch[2]}`);
    // also without leading zeros
    const noZeros = hoMatch[1].replace(/^0+/, '');
    if (noZeros) {
      variants.add(`${noZeros}HO${hoMatch[2]}`);
      variants.add(`${noZeros}H${hoMatch[2]}`);
    }
  }
  // Reverse: digits + H + digits (not HO) → digits + HO + digits
  const hMatch = naab.match(/^(\d+)H(\d+)$/);
  if (hMatch && !hoMatch) {
    variants.add(`${hMatch[1]}HO${hMatch[2]}`);
    const noZeros = hMatch[1].replace(/^0+/, '');
    if (noZeros) {
      variants.add(`${noZeros}H${hMatch[2]}`);
      variants.add(`${noZeros}HO${hMatch[2]}`);
    }
  }

  // Handle other breed codes similarly (JE↔J, BS↔B, AY↔A, etc.)
  for (const [long, short] of [['JE','J'], ['BS','B'], ['AY','A'], ['GU','G'], ['MS','M']]) {
    const longMatch = naab.match(new RegExp(`^(\\d+)${long}(\\d+)$`));
    if (longMatch) {
      variants.add(`${longMatch[1]}${short}${longMatch[2]}`);
      const noZeros = longMatch[1].replace(/^0+/, '');
      if (noZeros) {
        variants.add(`${noZeros}${long}${longMatch[2]}`);
        variants.add(`${noZeros}${short}${longMatch[2]}`);
      }
    }
    const shortMatch = naab.match(new RegExp(`^(\\d+)${short}(\\d+)$`));
    if (shortMatch && !longMatch) {
      variants.add(`${shortMatch[1]}${long}${shortMatch[2]}`);
      const noZeros = shortMatch[1].replace(/^0+/, '');
      if (noZeros) {
        variants.add(`${noZeros}${short}${shortMatch[2]}`);
        variants.add(`${noZeros}${long}${shortMatch[2]}`);
      }
    }
  }

  return Array.from(variants);
}

async function fetchBullsByNaabsMultiColumn(
  supabase: SupabaseClient,
  naabs: string[],
  lookupChunkSize = 200
): Promise<Map<string, any>> {
  const cleaned = Array.from(new Set(naabs.filter(Boolean).map(s => normalizeNaab(s)!)));
  const resultMap = new Map<string, any>();
  if (cleaned.length === 0) {
    console.debug('[import] no naabs to fetch');
    return resultMap;
  }

  // Expand each NAAB into all plausible variants (HO↔H, leading zeros)
  const variantToOriginal = new Map<string, string>(); // variant → original naab
  const allVariants = new Set<string>();
  for (const naab of cleaned) {
    const vars = naabVariants(naab);
    for (const v of vars) {
      allVariants.add(v);
      if (!variantToOriginal.has(v)) variantToOriginal.set(v, naab);
    }
  }
  const expandedNaabs = Array.from(allVariants);

  console.debug(`[import] fetching bulls for ${cleaned.length} unique naabs → ${expandedNaabs.length} variants (chunksize=${lookupChunkSize})`);

  const chunks = chunkArray(expandedNaabs, lookupChunkSize);
  for (const chunk of chunks) {
    try {
      // try multi-column exact matches first (using expanded variants)
      const qSire = supabase.from('bulls').select('id, naab_code, name, sire_naab, mgs_naab, mmgs_naab, code_normalized').in('sire_naab', chunk);
      const qMgs = supabase.from('bulls').select('id, naab_code, name, sire_naab, mgs_naab, mmgs_naab, code_normalized').in('mgs_naab', chunk);
      const qMmgs = supabase.from('bulls').select('id, naab_code, name, sire_naab, mgs_naab, mmgs_naab, code_normalized').in('mmgs_naab', chunk);

      const [rS, rM, rMM] = await Promise.all([qSire, qMgs, qMmgs]);

      const responses = [rS, rM, rMM];
      for (const res of responses) {
        if (res.error) {
          // surface auth/RLS errors clearly
          console.error('[import] fetch error', res.error);
          throw res.error;
        }
        (res.data || []).forEach((row: any) => {
          // Collect all keys this bull can be known by
          const allKeys: string[] = [];
          ['sire_naab', 'mgs_naab', 'mmgs_naab'].forEach((col) => {
            const key = normalizeNaab(row[col]);
            if (key) allKeys.push(key);
          });
          if (row.code_normalized) {
            const k = normalizeNaab(row.code_normalized);
            if (k) allKeys.push(k);
          }
          if (row.naab_code) {
            const k2 = normalizeNaab(row.naab_code);
            if (k2) allKeys.push(k2);
          }
          // Map each key and its variants back to the result
          for (const key of allKeys) {
            if (!resultMap.has(key)) resultMap.set(key, row);
            // Also map the original naab that generated this variant
            const orig = variantToOriginal.get(key);
            if (orig && !resultMap.has(orig)) resultMap.set(orig, row);
            // Generate variants for the key itself to cover reverse lookups
            for (const v of naabVariants(key)) {
              if (!resultMap.has(v)) resultMap.set(v, row);
              const vOrig = variantToOriginal.get(v);
              if (vOrig && !resultMap.has(vOrig)) resultMap.set(vOrig, row);
            }
          }
        });
      }

      // For any remaining naabs not matched, try lookup by code_normalized and naab_code
      const unmatched = chunk.filter(k => !resultMap.has(k));
      if (unmatched.length > 0) {
        // Also expand unmatched into their variants for code_normalized lookup
        const unmatchedExpanded = new Set<string>();
        for (const u of unmatched) {
          unmatchedExpanded.add(u);
          const orig = variantToOriginal.get(u);
          if (orig) for (const v of naabVariants(orig)) unmatchedExpanded.add(v);
        }
        const expandedArr = Array.from(unmatchedExpanded);

        const qCode = await supabase
          .from('bulls')
          .select('id, naab_code, name, sire_naab, mgs_naab, mmgs_naab, code_normalized')
          .in('code_normalized', expandedArr);
        const qNaab = await supabase
          .from('bulls')
          .select('id, naab_code, name, sire_naab, mgs_naab, mmgs_naab, code_normalized')
          .in('naab_code', expandedArr);

        for (const qResult of [qCode, qNaab]) {
          if (qResult.error) {
            console.debug('[import] code fallback query error', qResult.error);
            continue;
          }
          (qResult.data || []).forEach((row: any) => {
            const candidates = [
              normalizeNaab(row.code_normalized),
              normalizeNaab(row.naab_code),
              normalizeNaab(row.sire_naab),
              normalizeNaab(row.mgs_naab),
              normalizeNaab(row.mmgs_naab),
            ].filter(Boolean) as string[];
            for (const k of candidates) {
              if (!resultMap.has(k)) resultMap.set(k, row);
              const orig = variantToOriginal.get(k);
              if (orig && !resultMap.has(orig)) resultMap.set(orig, row);
              for (const v of naabVariants(k)) {
                if (!resultMap.has(v)) resultMap.set(v, row);
                const vOrig = variantToOriginal.get(v);
                if (vOrig && !resultMap.has(vOrig)) resultMap.set(vOrig, row);
              }
            }
          });
        }
      }
    } catch (err) {
      console.error('[import] fetchBullsByNaabsMultiColumn exception', err);
      throw err;
    }
  }

  console.debug(`[import] fetched map size=${resultMap.size}`);
  return resultMap;
}

async function upsertStagingRowsSupabase(
  supabase: SupabaseClient,
  rows: any[],
  writeChunkSize = 100
) {
  if (!rows || rows.length === 0) {
    console.debug('[import] no rows to upsert to staging');
    return;
  }
  const chunks = chunkArray(rows, writeChunkSize);
  for (const c of chunks) {
    const payload = c.map((r: any) => {
      const rawRow = r.original_row ?? r.raw_row ?? r.raw ?? r;
      return {
        import_batch_id: r.import_batch_id ?? null,
        uploader_user_id: r.uploader_user_id ?? null,
        row_number: r.row_number ?? null,
        raw_row: rawRow ?? {},
        mapped_row: r.mapped_row ?? null,
        is_valid: r.is_valid ?? false,
        errors: r.errors ?? [],
      };
    });

    const { error } = await supabase.from('bulls_import_staging').insert(payload);
    if (error) {
      console.error('upsertStagingRowsSupabase error', error);
      throw error;
    }
  }
}

export async function processNormalizedRowsInBatchesMultiColumn(
  supabase: SupabaseClient,
  normalizedRows: NormalizedRow[],
  options?: {
    lookupChunkSize?: number;
    writeBatchSize?: number;
    progressCallback?: (processed: number, total: number) => void;
  }
) {
  const lookupChunkSize = options?.lookupChunkSize ?? 200;
  const writeBatchSize = options?.writeBatchSize ?? 100;
  const totalRows = normalizedRows.length;

  console.info(`[import] starting processing ${totalRows} rows (batch=${writeBatchSize})`);

  const globalCache = new Map<string, any>();
  const rowChunks = chunkArray(normalizedRows, writeBatchSize);
  let processed = 0;
  let validCount = 0;
  let invalidCount = 0;

  for (const rowsChunk of rowChunks) {
    // collect NAABs not in cache (check all variants before deciding to fetch)
    const naabsToFetch: string[] = [];
    for (const r of rowsChunk) {
      const candidates = [
        normalizeNaab(r.sire_naab),
        normalizeNaab(r.mgs_naab),
        normalizeNaab(r.mmgs_naab),
        normalizeNaab(r.naab),
      ].filter(Boolean) as string[];

      for (const naab of candidates) {
        // Check if any variant is already cached
        const vars = naabVariants(naab);
        const alreadyCached = vars.some(v => globalCache.has(v) && globalCache.get(v) !== undefined);
        if (!alreadyCached && !globalCache.has(naab)) {
          globalCache.set(naab, undefined);
          naabsToFetch.push(naab);
        }
      }
    }

    console.debug(`[import] chunk has ${rowsChunk.length} rows, need to fetch ${naabsToFetch.length} naabs`);

    if (naabsToFetch.length > 0) {
      const fetchedMap = await fetchBullsByNaabsMultiColumn(supabase, naabsToFetch, lookupChunkSize);
      for (const naab of naabsToFetch) {
        if (fetchedMap.has(naab)) globalCache.set(naab, fetchedMap.get(naab));
        else globalCache.set(naab, null);
      }
    }

    const mappedRows = rowsChunk.map((r) => {
      const candidates = [
        { col: 'sire_naab', val: normalizeNaab(r.sire_naab) },
        { col: 'mgs_naab', val: normalizeNaab(r.mgs_naab) },
        { col: 'mmgs_naab', val: normalizeNaab(r.mmgs_naab) },
        { col: 'naab', val: normalizeNaab(r.naab) },
      ].filter(x => x.val);

      let matchedBull: any = null;
      let matchedNaab: string | null = null;
      for (const c of candidates) {
        const val = c.val as string;
        // Try direct lookup first, then all variants
        const vars = naabVariants(val);
        for (const v of vars) {
          const bull = globalCache.get(v);
          if (bull) {
            matchedBull = bull;
            matchedNaab = val;
            break;
          }
        }
        if (matchedBull) break;
      }

      const mappedRow = matchedBull
        ? {
            bull_id: matchedBull.id,
            bull_code: matchedBull.naab_code,
            bull_name: matchedBull.name,
            matched_on: matchedNaab,
          }
        : null;

      if (!mappedRow) {
        console.debug('[import] row not matched', { row_number: r.row_number, candidates: candidates.map(c=>c.val) });
      }

      return {
        import_batch_id: r.import_batch_id ?? null,
        uploader_user_id: r.uploader_user_id ?? null,
        row_number: r.row_number ?? null,
        raw_row: r,
        mapped_row: mappedRow,
        is_valid: !!mappedRow,
        errors: mappedRow ? [] : [{ message: 'bull_not_found', naabs: candidates.map(c => c.val) }],
      };
    });

    await upsertStagingRowsSupabase(supabase, mappedRows, writeBatchSize);

    for (const row of mappedRows) {
      if (row.is_valid) validCount += 1;
      else invalidCount += 1;
    }

    processed += rowsChunk.length;
    if (options?.progressCallback) options.progressCallback(processed, totalRows);

    console.info(`[import] processed ${processed}/${totalRows} (valid=${validCount} invalid=${invalidCount})`);
  }

  return { processed, total: totalRows, valid: validCount, invalid: invalidCount };
}
