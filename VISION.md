## Shiki Twoslash

Critical points about Shiki Twoslash which constrain future scope:

 - New features need to be useful in most codebases using twoslash. I don't want edge cases.
 - All code sample needs to be atomically compiled. Order should not affect code samples.
 - Everything needs to work without JS on the user's side. For example, the TypeScript website ships Twoslash epubs/PDFs.
 - Don't make assumptions about the user environment. E.g. don't assume they use React etc.

Things I care about which might affect scope:

 - The level of complexity in the output HTML. E.g. we probably won't syntax highlight embedded overlays.
 - The speed of development. Today Shiki Twoslash caches code samples at Twoslash level, so the compiling happens if the code changes.

### Long Term Vision

Today, early June 2021, Shiki Twoslash is bascially 1.0'd. It does everything the TypeScript website needs,
and is in a good position to be used in blogs as seen on [fatihkalifa.com](https://fatihkalifa.com) and [cpojer.net](https://cpojer.net).

I, Orta, intend to keep maintaining Shiki Twoslash for a very long time, which means big changes will need an issue ahead of time because I can't maintain what I don't understand. Smaller things I can be flexible with.

I'm also a few years into Shiki Twoslash now, so I'm not sure how much low hanging fruit is available.

### Shiki Convergence

In [the website](https://shikijs.github.io/twoslash/) I describe Shiki Twoslash as a _'polite but hard fork'_ of Shiki. 

What that means is that the underlaying tokens -> HTML renderer is a complete fork from Shiki. E.g. [these files](packages/shiki-twoslash/src/renderers) won't call the original shiki renderers. I don't think I'll ever commit to re-using Shiki at at that level. Which means that there are features which Shiki may implement differently from Shiki Twoslash. For example, I copied [gatsby-remark-vscode](https://github.com/andrewbranch/gatsby-remark-vscode)'s line highlighting syntax and shiki may not. 

We can take ideas (and features) from Shiki, and move them upstream too but convergence isn't a goal.