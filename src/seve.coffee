###
 * seve
 * https://github.com/leny/seve
 *
 * JS/COFFEE Document - /seve.js - main entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

pkg = require "../package.json"

zouti = require "zouti"

( program = require "commander" )
    .version pkg.version
    .usage "[options]"
    .description "Run a tiny & simple server from the current folder (like, for tests & stuffs)."
    .option "-p, --port <port>", "compute the result since the given commit."
    .option "-q, --quiet", "show raw result, as number of minutes spent on the project."
    .parse process.argv

console.log program
