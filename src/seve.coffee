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

server = ( express = require "express" )()
chalk = require "chalk"
fs = require "fs"

sServerRoot = process.cwd()

( program = require "commander" )
    .version pkg.version
    .arguments "[folder]"
    .usage "[options] [folder]"
    .description "Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current)."
    .option "-p, --port <port>", "port used by the server (default to 12345)"
    .option "-q, --quiet", "don't show the logs"
    .action ( folder ) ->
        return console.log chalk.bold.red "✘ given folder doesn't exists, use current path instead." unless fs.existsSync folder
        return console.log chalk.bold.red "✘ given folder isn't a folder, use current path instead." unless ( fs.statSync folder ).isDirectory()
        sServerRoot = folder
    .parse process.argv

if isNaN ( iPort = +( program.port or 12345 ) )
    console.log chalk.bold.red "✘ port must be a number, '#{ iPort }' given."
    process.exit 1

if iPort <= 1024 && process.getuid() isnt 0
    console.log chalk.bold.yellow "⚠ seve needs to be run as sudo to use port '#{ iPort }'."
    process.exit 1

unless program.quiet
    server.use ( oRequest, oResponse, fNext ) ->
        sHour = ( new Date() ).toTimeString().split( " " )[ 0 ]
        console.log chalk.cyan( "[#{ sHour }]"), chalk.magenta( "(#{ oRequest.method })" ), oRequest.url
        fNext()

server.use express.static sServerRoot
server.listen iPort

console.log chalk.underline "Serving folder #{ chalk.bold.cyan sServerRoot } listening on port #{ chalk.bold.yellow iPort }."
console.log "Quit with (#{ chalk.cyan( '^+C' ) }).\n"
