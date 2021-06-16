import { UserConfigSettings } from "shiki-twoslash";
import type { Highlighter, Lang } from "shiki";

declare const remarkShiki: ({ markdownAST }: any, settings?: UserConfigSettings) => Promise<void>;
export default remarkShiki;
