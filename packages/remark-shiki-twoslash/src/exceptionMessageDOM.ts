import type { Node } from "unist"

import {TwoslashError} from "@typescript/twoslash"

export const setupNodeForTwoslashException = (code: string, node: Node, error: unknown) => {
    const css = `<style>
@import url('http://fonts.cdnfonts.com/css/caslon-os'); 

.twoslash-fixed-error-note { 
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    padding: .25rem .75rem;
    color: #6c757d;
    background-color: #FCF3D9;
    background-clip: padding-box;
    border-bottom: 1px solid rgba(0,0,0,.05);
    border-radius: .25rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
 } 

 .twoslash-fixed-error-note:hover {
    border-bottom: 1px solid rgba(226, 61, 30, 0.8);
 }

 .twoslash-error-color {
    background-color: rgba(226, 61, 30, 0.8);
    width: 18px;
    height: 18px;
    border-radius: 9px;
    margin-right:  10px;
 }

.twoslash-exception-message { 
    font-family: 'Caslon OS', sans-serif; 
    background-color: #FCF3D9;
    font-size: 1.2rem;
    padding: 1rem;
}

.twoslash-exception-message h3 { 
    margin-top: 0.2rem;
    font-size: 1.8rem;
}

.twoslash-exception-message code {
     white-space: pre-wrap;
     font-family: "JetBrains Mono", Menlo, Monaco, Consolas, Courier New, monospace;
     margin-bottom: 20px;
 }

.twoslash-exception-code {
    border-left: 2px solid rgba(226, 61, 30, 0.8);
    padding-left: 20px;
}
</style>`

    const bodyFromTwoslashError = (error: TwoslashError) =>  {
        return `
<h3>${error.title}</h3>
<p>${error.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}</p>
<code>${error.recommendation.replace(/(?:\r\n|\r|\n)/g, '<br>')}</code>
`
    }

    const bodyFromError = (error: Error) => {
        return `<code>${error.message}</code>`
    }

    let body = `<pre><code>${error}</code></pre>`
    if (error instanceof TwoslashError) {
        body = bodyFromTwoslashError(error)   
    } else  if (error instanceof Error) {
        body = bodyFromError(error)   
    }

    const codeSample = `<p>Raising Code:</p><pre class='twoslash-exception-code'><code>${code}</code></pre>`

    const html = `
    <a href='#twoslash-error'><div class='twoslash-fixed-error-note'><span class='twoslash-error-color'></span>Twoslash failure</div></a>
    <div name='twoslash-error' class='twoslash-exception-message'>${body}${codeSample}</div>`


    node.type = "html"
    node.value = css + html
    node.children = []
}