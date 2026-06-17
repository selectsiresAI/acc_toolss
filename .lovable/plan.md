## Goal

In Nexus 2, when the maternal grandsire (MGS) or maternal great-grandsire (MGGS) NAAB is **provided but not recognized** in our bull database, fall back to the same "average bull" placeholders we already use when those fields are left blank — so the row stays valid and the prediction runs. The sire (pai) NAAB continues to be required and is **not** subject to this fallback.

## Today's behavior

- Blank MGS → uses placeholder `007HO00001` (2020 average). Row stays valid.
- Blank MGGS → uses placeholder `007HO00002` (2017 average). Row stays valid.
- **Unrecognized MGS/MGGS NAAB** (typo, foreign code, not in DB) → row is marked invalid with `mgsNotFound` / `mmgsNotFound`, prediction is skipped, and the NAAB is exported in "missing NAABs".

## New behavior

- Unrecognized MGS NAAB → silently swap to the 2020 placeholder, mark `usedPlaceholder.mgs = true`, keep row valid.
- Unrecognized MGGS NAAB → silently swap to the 2017 placeholder, mark `usedPlaceholder.mmgs = true`, keep row valid.
- Sire (pai) unchanged: a missing or unrecognized sire still invalidates the row.
- The unresolved NAABs continue to be tracked so the "Export missing NAABs" sheet keeps working — they're still useful to surface back to the user — but they no longer block the prediction.

## Files to change

1. `src/components/nexus2/Nexus2PredictionBatch.tsx`
   - In the row-finalization loop (around lines 654–697), when `naabAvoMaterno` is provided but `bullCache.get(...)` returns `null`, substitute `mgsPlaceholder` and set `usedPlaceholder.mgs = true` instead of pushing `mgsNotFound` into `errors`/`fieldErrors`. Same treatment for `naabBisavoMaterno` / `mggsPlaceholder`.
   - Keep the unresolved NAAB recorded for the "missing NAABs" export (it already derives from rows; add a lightweight `unresolvedNaabs` marker on the row if needed so the export still lists them).
   - Leave sire logic untouched.

2. `src/components/nexus2/Nexus2PredictionIndividual.tsx`
   - Mirror the same fallback in the individual flow (around lines 394 / 408): if the user types an MGS/MGGS NAAB that doesn't resolve, swap to the placeholder, surface a non-blocking warning, and proceed with the prediction.

3. `src/lib/i18n.ts`
   - Add PT/EN/ES keys for a soft warning shown when a placeholder substitution happened due to an unrecognized NAAB (e.g. `nexus2.warning.mgsReplacedByAverage`, `nexus2.warning.mmgsReplacedByAverage`), so the UI can label the row/result without flagging it as an error.

## Out of scope

- No changes to sire (pai) validation.
- No changes to the prediction formula itself — it already accepts placeholders.
- No DB or edge-function changes.
