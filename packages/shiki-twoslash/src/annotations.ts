import { TwoSlashReturn } from "@typescript/twoslash"

export const htmlForTags = (tags: TwoSlashReturn["tags"]) => {
  let html = ""
  tags.forEach(t => {
    if (t.name === "annotate" && t.annotation) {
      const meta = t.annotation.split(" - ")
      const text = meta.pop()
      const info = (meta[0] || "").trim()
      const flipped = info.includes("right")
      const arrowRotation = info.split(" ")[1] || flipped ? "310" : "56"
      const textRotation = info.split(" ")[2] || "0"

      const arrowSVG = arrow({ flipped, rotation: arrowRotation })

      html += `
<div class='twoslash-annotation ${flipped ? "right" : "left"}' style="top: ${t.line}em;">
  ${arrowSVG}
  <p class='twoslash-annotation-text' style="transform: rotate(${textRotation}deg)">${text}</p>
</div>`
    }
  })

  return html
}

const arrow = (style: { flipped: boolean; rotation: string }) => {
  const leftInner = `M27 39C26.5 32.7511 21.9 17.5173 7.5 6.57333M16.5 4.04L0.999999 0.999998C3.16667 4.88444 7.5 13.16 7.5 15.1867`
  const rightInner = `M1 39C1.5 32.7511 6.1 17.5173 20.5 6.57333M11.5 4.04L27 0.999998C24.8333 4.88444 20.5 13.16 20.5 15.1867`
  const inner = style.flipped ? leftInner : rightInner

  return `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(${style.rotation} 20 20)">
    <path d="${inner}" stroke="black" />
</svg>`
}
