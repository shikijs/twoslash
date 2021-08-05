import '../styles/globals.scss'

import React from 'react'
import {MDXProvider} from '@mdx-js/react'

const components = {
  pre: (props) => (<>
      <pre className="edited" >{props.children}</pre>
    </>),
}

function MyApp({ Component, pageProps }) {
  return   <MDXProvider components={components}>
   <Component {...pageProps} />
  </MDXProvider>
}

export default MyApp
