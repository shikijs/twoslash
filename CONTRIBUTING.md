## Working in this repo

The core of this project are the two modules: `remark-shiki-twoslash`and `shiki-twoslash`.

These modules are built using test driven development, and so you can run:

```sh
pnpm test --watch
```

In the root of the repo to see how your changes affect the tests. Both `shiki-twoslash` and `remark-shiki-twoslash` uses a traditional unit-test style and `reamrk-shiki-twoslash` also contains an easy way to do integration-style tests where you give a markdown document and see the end result as a HTML file which you can inspect. 

#### Integration Test Notes

You can monitor a single markdown fixture via `pnpm test --watch --testNamePattern [filename]`. 
To get underlying information about what Twoslash is doing you can run tests with the env var `DEBUG="*"`, this is very noisy - so narrow your test down.

I've not yet figured out a way to have shiki-twoslash use the .ts files directly at this abstraction level, so you'll need to run `pnpm build` occasionally if you aren't seeing the expected changes in results.

These two dependencies also use TypeScript, you can validate all of the TypeScript via `pnpm build`. 

#### Examples

The examples projects have been used to bootstrap the integration plugins, and definitely have the potential to get out of date with the `main` branch of Shiki Twoslash. As a development environment they are a tad weak.