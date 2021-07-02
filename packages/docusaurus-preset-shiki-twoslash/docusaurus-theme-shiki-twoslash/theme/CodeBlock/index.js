// Based on https://github.com/facebook/docusaurus/blob/ed9d2a26f5a7b8096804ae1b3a4fffc504f8f90d/packages/docusaurus-theme-classic/src/theme/CodeBlock/index.tsx
// which is under MIT License as per the banner

import copy from "copy-text-to-clipboard"
import React, { useRef, useState } from "react"
import styles from "./styles.module.css"
import Translate, { translate } from "@docusaurus/Translate"

const CodeBlock = ({ children, className, ...props }) => {
  const pre = useRef(null)
  const [showCopied, setShowCopied] = useState(false)

  const handleCopyCode = () => {
    if (pre.current) {
      copy(pre.current.querySelector("code").textContent)
    }
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  return (
    <pre {...props} className={[className, styles.codeBlock].join(" ")} ref={pre}>
      {children}
      <button
        type="button"
        aria-label={translate({
          id: "theme.CodeBlock.copyButtonAriaLabel",
          message: "Copy code to clipboard",
          description: "The ARIA label for copy code blocks button",
        })}
        className={styles.copyButton}
        onClick={handleCopyCode}
      >
        {showCopied ? (
          <Translate id="theme.CodeBlock.copied" description="The copied button label on code blocks">
            Copied
          </Translate>
        ) : (
          <Translate id="theme.CodeBlock.copy" description="The copy button label on code blocks">
            Copy
          </Translate>
        )}
      </button>
    </pre>
  )
}

export default CodeBlock
