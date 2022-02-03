import '../styles/globals.scss'

import React from 'react'
import {MDXProvider} from '@mdx-js/react'

const components = {
  code: (props) => {
    const codefence = (props.className || "").replace("language-", "") + " " + (props.metastring || "")
    const onclick = () => {
      document.getElementById("codefence").value = codefence
      window.sandbox.setText(props.children.trim())
    }

    return (<>
      <div className="clickable-code" onClick={onclick}>
        <div>```{codefence}</div>
        <code className="edited" >{props.children}</code>
        <div>```</div>
      </div>
    </>)
  },
}

function MyApp({ Component, pageProps }) {
  return  <MDXProvider components={components}>
   <Component {...pageProps} />
  </MDXProvider>
}

export default MyApp
