import { TwoslashError, TwoSlashReturn } from "@typescript/twoslash"

export const htmlForTags = (tags: TwoSlashReturn["tags"]) => {
  let html = ""
  tags.forEach(t => {
    if (t.name === "annotate" && t.annotation) {
      const meta = t.annotation.split(" - ")
      const text = meta.pop()
      const info = (meta[0] || "").trim()
      const flipped = info.includes("right")
      let settings = {
        flipped,
        arrowRot: flipped ? "90deg 20px 20px" : "90deg 20px 20px",
        textDegree: "0deg",
        top: `${t.line}em`
      }
      
      
      if (info.includes("{")) {
        const theInfo =  "{" + info.split("{")[1]
        try {
          const specificSettings = JSON.parse(theInfo)
          settings = {...settings, ...specificSettings }
        } catch (error) {
          throw new TwoslashError("Could not parse annotation", `The annotation ${JSON.stringify(t)} could convert '${theInfo}' into JSON`, `Look at ${(error as any).message}.`)
        }
      }
      
      const arrowSVG = arrow(settings)

      html += `
<div class='twoslash-annotation ${flipped ? "right" : "left"}' style="top: ${settings.top}">
  ${arrowSVG}
  <p class='twoslash-annotation-text' style="transform: rotate(${settings.textDegree})">${text}</p>
</div>`
    }
  })

  return html
}

const arrow = (style: { flipped: boolean; arrowRot: string, textDegree: string, top: string }) => {
  const leftInner = `M27 39C26.5 32.7511 21.9 17.5173 7.5 6.57333M16.5 4.04L0.999999 0.999998C3.16667 4.88444 7.5 13.16 7.5 15.1867`
  const rightInner = `M1 39C1.5 32.7511 6.1 17.5173 20.5 6.57333M11.5 4.04L27 0.999998C24.8333 4.88444 20.5 13.16 20.5 15.1867`
  const inner = style.flipped ? leftInner : rightInner
  const rot = style.arrowRot.split(" ")
  return `<svg style='transform: translateX(${rot[1]}) translateY(${rot[2]}) rotate(${rot[0]});' width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="${inner}" stroke="black" />
</svg>`
}
