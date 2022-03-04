---
"remark-shiki-twoslash": patch
---

HTML characters in the code block within Twoslash failure messages are now escaped. This resolves an issue where generics that throw TypeScript errors caused a `remark` exception because it interpreted `<` as the beginning of an HTML element.
