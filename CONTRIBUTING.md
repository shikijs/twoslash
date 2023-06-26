## Working in this repo

The core of this project are the two modules: `remark-shiki-twoslash`and `shiki-twoslash`.

These modules are built using test driven development, and so you can run:

```sh
pnpm test --watch
```

In the root of the repo to see how your changes affect the tests. Both `shiki-twoslash` and `remark-shiki-twoslash` uses a traditional unit-test style and `reamrk-shiki-twoslash` also contains an easy way to do integration-style tests where you add a markdown document to [`packages/remark-shiki-twoslash/test/fixtures`](packages/remark-shiki-twoslash/test/fixtures) and see the end result as a HTML file which you can inspect visually. 

These two dependencies also use TypeScript, you can validate all of the TypeScript via `pnpm build`. 

#### Integration Test Notes

You can monitor a single markdown fixture via `pnpm test --watch --testNamePattern [filename]`. 
To get underlying information about what Twoslash is doing you can run tests with the env var `DEBUG="*"`, this is very noisy - so narrow your test down ahead of time.

#### Examples

The examples projects have been used to bootstrap the integration plugins, and definitely have the potential to get out of date with the `main` branch of Shiki Twoslash. As a development environment they are a tad weak.

#### Twoslash

Shiki Twoslash relies on Twoslash which lives in the [TypeScript website monorepo](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher). For more daring features, you may need to add support there first.

#### Deps

There is a script `node scripts/syncVersions.js` which ensures that all the deps in the repo line up, which if you make any package json changes you probably want to run

#### Deploys 

The deploy process happens on push and compares the versions via pleb