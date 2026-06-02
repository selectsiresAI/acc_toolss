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

/**
 * Extract breed+number suffix from a NAAB code, ignoring the company prefix.
 * E.g. "011HO12771" → "HO12771", "200H10624" → "H10624"
 * Returns both HO and H variants of the suffix for matching.
 */
function naabBreedNumberSuffixes(naab: string): string[] {
  const m = naab.match(/^\d+((?:HO|H|JE|J|BS|B|AY|A|GU|G|MS|M)\d+)$/);
  if (!m) return [];
  const suffix = m[1];
  const suffixes = new Set<string>();
  suffixes.add(suffix);
  // Also add HO↔H variant of the suffix
  const hoM = suffix.match(/^HO(\d+)$/);
  if (hoM) suffixes.add(`H${hoM[1]}`);
  const hM = suffix.match(/^H(\d+)$/);
  if (hM && !hoM) suffixes.add(`HO${hM[1]}`);
  return Array.from(suffixes);
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

  // Expand each NAAB into all plausible variants (HO↔H, leading zeros, breed+number)
  const allVariants = new Set<string>();
  const variantToOriginal = new Map<string, string>();
  for (const naab of cleaned) {
    for (const v of naabVariants(naab)) {
      allVariants.add(v);
      if (!variantToOriginal.has(v)) variantToOriginal.set(v, naab);
    }
    // Also add breed+number suffixes for cross-company matching
    for (const s of naabBreedNumberSuffixes(naab)) {
      allVariants.add(s);
      if (!variantToOriginal.has(s)) variantToOriginal.set(s, naab);
    }
  }
  const expandedNaabs = Array.from(allVariants);

  console.debug(`[import] fetching bulls via aliases for ${cleaned.length} naabs → ${expandedNaabs.length} variants`);

  // Batch lookup via bull_naab_aliases table (indexed, <1ms per lookup)
  const chunks = chunkArray(expandedNaabs, lookupChunkSize);
  for (const chunk of chunks) {
    try {
      const { data, error } = await supabase
        .from('bull_naab_aliases')
        .select('naab_variant, bull_id, bulls!inner(id, naab_code, name, code_normalized)')
        .in('naab_variant', chunk);

      if (error) {
        console.error('[import] aliases lookup error, falling back to direct query', error);
        // Fallback: direct bulls table lookup by code_normalized
        const { data: fallbackData, error: fbError } = await supabase
          .from('bulls')
          .select('id, naab_code, name, code_normalized')
          .in('code_normalized', chunk);
        if (!fbError && fallbackData) {
          for (const row of fallbackData) {
            const key = normalizeNaab(row.code_normalized);
            if (key && !resultMap.has(key)) resultMap.set(key, row);
            const orig = key ? variantToOriginal.get(key) : null;
            if (orig && !resultMap.has(orig)) resultMap.set(orig, row);
          }
        }
        continue;
      }

      for (const alias of (data || [])) {
        const bull = (alias as any).bulls;
        if (!bull) continue;
        const variant = alias.naab_variant;
        // Map the variant itself
        if (!resultMap.has(variant)) resultMap.set(variant, bull);
        // Map the original naab that generated this variant
        const orig = variantToOriginal.get(variant);
        if (orig && !resultMap.has(orig)) resultMap.set(orig, bull);
        // Also map by all keys of this bull
        for (const key of [normalizeNaab(bull.naab_code), normalizeNaab(bull.code_normalized)]) {
          if (key && !resultMap.has(key)) resultMap.set(key, bull);
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
