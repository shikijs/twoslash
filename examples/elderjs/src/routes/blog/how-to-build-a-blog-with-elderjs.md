---
title: 'How to Build a Blog With Elder.js'
excerpt: 'Building a simple blog with Elder.js is easy. Just toss a few markdown files in a folder of this project!'
date: '2020-03-16T05:35:07.322Z'
author: Nick Reese
---

One of the most popular use cases of static site generators is to build a blog.

So we figured why not offer a blog right out of the box on the starter template?

This guide will show you how to customize your Elder.js blog.

## This Page is Editable

If you've gotten this starter template running, then chances are you know what markdown is. If you don't here is <a href="https://medium.com/@itsjzt/beginner-guide-to-markdown-229adce30074">a good beginner's guide to it.</a>

With that out of the way, let's talk about how you'll edit pages on your blog.

To start, open up the markdown file powering this page at: `./src/routes/blog/how-to-build-a-blog-with-elderjs.md`

Once you've got it open, make some small changes, save the file and restart the server.
When you reload this page you should see your changes.

## Adding Markdown Files

Once you've edited this page, try duplicating and renaming one of the files in the `./src/routes/blog/` folder. Give the new file name anything you'd like.

Once you've done that, restart the server (or let it restart if you are using the `npm run dev` command) and then navigate to the homepage. Boom! You should see your new blog entry.

It is really that simple.

## Customizing Your Design

Without making this guide 1000s of words long, basically all templating and design for this site is done using Svelte.

This page is being built with a Svelte template that lives at `./src/routes/blog/Blog.svelte`. There is also a components folder at ``./src/components/` where you can add reusable components.

Svelte files in either of these locations will be bundled by the default Rollup.js included with this script. (run by typing `npm run dev`).

Customizing your design is up to you, but in general if you're comfortable with JS/CSS/HTML you'll love the beauty that Svelte brings to the development workflow.

## What's Next?

If you're interested in further exploring how this template is working, continue reading the <a href="/getting-started/">guide on getting started with Elder.js</a>.
