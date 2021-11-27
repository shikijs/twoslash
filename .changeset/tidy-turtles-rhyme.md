---
"remark-shiki-twoslash": patch
---

Stop setting `vfsRoot` when it's not present, so that `@typescript/twoslash` can handle it.
