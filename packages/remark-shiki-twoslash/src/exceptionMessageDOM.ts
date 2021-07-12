import type { Node } from "unist"

// This isn't shipped upstream yet
declare class TwoslashError extends Error {
    title: string;
    description: string;
    recommendation: string;
    code: string | undefined;
    constructor(title: string, description: string, recommendation: string, code?: string | undefined);
}

export const setupNodeForTwoslashException = (code: string, node: Node, error: unknown) => {
    const css = `<style>.twoslash-exception-message {  }</style>`
    const html = `<div class='twoslash-exception-message'>${error}</div>`

    const behind = `<code>${code}</code>`

    node.type = "html"
    node.value = css + html + behind
    node.children = []
}