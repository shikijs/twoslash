#!/usr/bin/env node
'use strict';

const filepath = process.argv[2]
if (!filepath) throw new Error("Pass a markdown file as arg1")

const to = process.argv[3]
if (!to) throw new Error("Pass a filepath to put the html, if it's `*.html` you get the full md render, if it's not then a folder of each code block is made.")

import {runOnFile} from "../index.js"

runOnFile({ from: filepath, to })