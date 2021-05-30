import themeGen from "vscode-theme-generator";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { writeFileSync, readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const colorSet = {
  base: {
    background: "#FCF3D9",
    foreground: "#111111",
    color1: "#E23D1E",
    color2: "#BB8700",
    color3: "#183F66",
    color4: "#0A0E07",
  },
};

const themePath = join(__dirname, "theme.json");
themeGen.generateTheme("shiki-twoslash", colorSet, themePath);

const invert = readFileSync(themePath, "utf8");
const theme = JSON.parse(invert);

// Comments as black is rough
theme.tokenColors.find((t) => t.name === "Comment").settings.foreground = "#BB8700";
theme.tokenColors.push({ name: "TS Type", scope: "support.type.primitive.ts", settings: { foreground: "#BB8700" } });
theme.tokenColors.push({ name: "TS Var", scope: "meta.definition.variable.js", settings: { foreground: "#183F66" } });

writeFileSync(themePath, JSON.stringify(theme).replace(/#ffffff/gi, "#000000"));

