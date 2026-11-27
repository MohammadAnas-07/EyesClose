# Content

Letter templates and checklist steps live here as versioned JSON files, one file per item.
Every change goes through a pull request, so each change is reviewable.

Every item must have these fields:

- `id`: stable id, for example `bank-sbi-closure`.
- `version`: a number, raised on every content change.
- `source`: the official page or form URL of the institution.
- `lastChecked`: the date someone last checked the source, as `YYYY-MM-DD`.
- `verifiedBy`: name and role of the CA or lawyer who reviewed it, or `null`.

While `verifiedBy` is `null`, the app must show "Not yet checked by a professional" on that item.
Nothing may be shown as verified until a real reviewer fills that field.

There are no items yet. `letters/` and `checklist/` are filled in later chunks.
