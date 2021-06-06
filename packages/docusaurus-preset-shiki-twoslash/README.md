### Docusaurus Preset Shiki Twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting mixed with the twoslash JavaScript tooling from the TypeScript website.

#### Setup

1. **Install the dependency**: `yarn add docusaurus-preset-shiki-twoslash`
1. **Include `"docusaurus-preset-shiki-twoslash"` in the presets section** of `docusaurus.config.js`

   ```diff
     presets: [
    [
      '@docusaurus/preset-classic',
      {
        // ...
      },
    ],
    + ["docusaurus-preset-shiki-twoslash", { theme: "github-light" }]
   ],

   ```

1. Add the CSS from [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash) to `src/css/custom.css`
1. Add the JS via a [root component](https://docusaurus.io/docs/using-themes#wrapper-your-site-with-root): `src/theme/Root.js`

```ts
import React, { useEffect } from "react"
import { setupTwoslashHovers } from "shiki-twoslash/dist/dom"


// Default implementation, that you can customize
function Root({children}) {
  useEffect(setupTwoslashHovers, [])

  return <>{children}</>;
}

export default Root;
```

1. Disable the in-built formatter: `src/theme/MDXComponents/index.js`:

```ts
import InitialComponents from '@theme-init/MDXComponents';

const newExport = {}
// Remove `pre` and `code` from the MDX parser because Shiki Twoslash will handle them
Object.entries(InitialComponents).forEach(key => {
  if (key !== "pre" && key !== "code") newExport[key] = InitialComponents[key]
})

export default newExport
```

1. **Go read [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)** to see what is available, this package leaves all the heavy work to that module.
