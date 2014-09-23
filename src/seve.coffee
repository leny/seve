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

( program = require "commander" )
    .version pkg.version
    .usage "[options]"
    .description "Run a tiny & simple server from the current folder (like, for tests & stuffs)."
    .option "-p, --port <port>", "port used by the server (default to 12345)"
    .option "-q, --quiet", "don't show the logs"
    .parse process.argv

if isNaN ( iPort = +( program.port or 12345 ) )
    console.log chalk.bold.red "✘ port must be a number, '#{ iPort }' given."
    process.exit 1

unless program.quiet
    server.use ( oRequest, oResponse, fNext ) ->
        sHour = ( new Date() ).toTimeString().split( " " )[ 0 ]
        console.log chalk.cyan( "[#{ sHour }]"), chalk.magenta( "(#{ oRequest.method })" ), oRequest.url
        fNext()

server.use express.static process.cwd()

server.listen iPort

console.log chalk.underline "Server listening on port #{ chalk.bold.yellow( iPort ) }."
console.log "Quit with (#{ chalk.cyan( '^+C' ) }).\n"
