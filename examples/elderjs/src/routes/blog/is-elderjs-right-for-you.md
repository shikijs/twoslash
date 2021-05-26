---
title: 'Is Elder.js Right For You?'
excerpt: 'What types of sites can you build with Elder.js? Can I use it for ______? What parts of the project do most people struggle with?'
author: Nick Reese
# slug: common-uses-for-elderjs
---

Elder.js was built as a static site generator (SSG) but was developed into a full server side rendering (SSR) framework.

If you're wondering if Elder.js will support your use case we have 1 good rule to help you make that decision:

> Are you looking to build a **"modern" app with client side routing**? If so, Elder.js **IS NOT** the right solution for you.

We like to think that Elder.js is great a building **websites**, regardless of whether they are statically generated or server rendered.

If you're building an "App" you can definitely use Elder.js but if you want client side routing make sure to check out <a href="https://kit.svelte.dev/">SvelteKit</a>.

## Common Use Cases for Elder.js

The Elder.js project was born out of the system that powers <a href="https://elderguide.com/">ElderGuide.com</a>. When building Elder Guide we searched high and low for a blazing fast static site generator that we could use with Svelte, but couldn't find anything that fit our needs.

After 6 months of building a great system, we decided to polish it a bit more and open it up into a project others could use.

Today, Elder.js has two main functions: one as a static site generator and the other as `express` middleware where it acts as a Svelte framework that supports server side rendering (SSR) and partial hydration. (You're probably viewing this page on the `express` middleware version.)

All of this said, we highly recommend Elder.js as a tool for building statically generated sites that can be cheaply and securely hosted on S3, Netlify, or Cloudflare.

These include:

- Flagship SEO websites with 10,000s of pages
- Blogs and personal websites
- Portfolio or brochure websites

To see static export in action run `npm run build` in your terminal. We think you'll be surprised how fast it builds. :)

If you are looking to use Elder.js as an `express` middleware make sure to look at the <a href="/middleware/">`middleware`</a> hook as it should empower you to do anything you'd need to do with Express.

## Learning Curves

Like most frameworks Elder.js has a learning curve but we've tried to keep it as minimal as possible to achieve common customizations while still making use of advanced Elder.js features as approachable as possible.

The largest learning curve for most people is learning how to use `hooks` and `shortcodes` to achieve their goals.

If you are able to understand the routes found in this template then you shouldn't have too many issues.

## Elder.js vs SvelteKit

How Elder compares to SvelteKit is a very common question. The key distinction is that Elder.js is designed with SEO in mind and offers tools to help make building large static sites easier.

1. Partial Hydration: Most **"modern javascript frameworks"** use client side routing which requires complete rehydration of the client. This can cause major SEO issues as [Google Bot's process for indexing javascript heavy websites](https://developers.google.com/search/docs/guides/javascript-seo-basics) differs from that of mainly static sites. This is why many javascript sites that use `react`, `vue`, `angular` and `svelte` struggle with SEO even if they are server side rendered (SSR). In our experience partial hydration results in less indexation issues for Google much like `jquery` sites of yester-year. This is why Elder.js has gone all-in on partial hydration. We believe it is a competitive SEO advantage. ([Google has a great guide on hydration](https://developers.google.com/web/updates/2019/02/rendering-on-the-web).)
2. Data Flow: When it comes to building non-trivial static sites, there is a lot of data massaging that needs to be in sync across the entire project. A good example is when reading from a headless CMS or generating a sitemap. With Elder.js, you can organize this data once and add it where you need to via a hook and it will be available on all pages. This is what enables Elder's extreme build speed, whereas SvelteKit has no data pipeline opinion.
3. Elder.js has `shortcodes` which allow you to future proof your content.
4. Elder.js uses `hooks` allowing your team to encapsulate much of a site's complexity in one place. These hooks also empower a growing ecosystem of plugins.
5. Complete control over routing and url structure. SvelteKit uses file based routing which has it's benefits and limitations.

In short, Elder.js is purpose built to run flagship SEO sites with 10-100k pages.

SvelteKit is not out of beta but [currently does not](https://github.com/sveltejs/kit/issues/1390) support Partial Hydration - you have to opt in/out of JS on a per-page basis, instead of per-component.

SvelteKit uses Vite and HMR which result in a bit better developer experience.

## What Parts of Elder.js Aren't Perfect Yet?

**A Very Complex Rollup Config**

To be candid, Elder.js's biggest drawback is it's very complex Rollup configuration that is internalized into Elder.js which makes it hard to edit for custom needs.

**A Very Strict Folder Structure**

Because of Elder.js' complex Rollup config it needs to follow a pretty specific file structure. This project matches that file structure and you can learn more about it on the <a href="/getting-started/">getting started</a> page.

**No Live Reload / HMR support (Yet)**

We realize developer experience is crucial and see potential in using `esbuild` to speed up our local development environment. While we'd love to use `snowpack` or `vite` due to our complex client and SSR bundling needs we need something with a bit more control.
