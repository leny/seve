/* seve
 * https://github.com/leny/seve
 *
 * JS Document - /seve.js - main entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */

/* eslint-disable no-console */

import express from "express";
import chalk from "chalk";
import fs from "fs";
import program from "commander";
import { open } from "openurl";

let pkg = require( "../package.json" ),
    server = express(),
    sServerRoot = process.cwd(),
    iPort;

program
    .version( pkg.version )
    .arguments( "[folder]" )
    .usage( "[options] [folder]" )
    .description( "Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current)." )
    .option( "-p, --port <port>", "port used by the server (default to 12345)" )
    .option( "-q, --quiet", "don't show the logs" )
    .option( "-N, --no-open", "don't browse to the URL at startup" )
    .action( ( sFolder ) => {
        if ( !fs.existsSync( sFolder ) ) {
            return console.log( chalk.bold.red( "✘ given folder doesn't exists, use current path instead." ) );
        }
        if ( !fs.statSync( sFolder ).isDirectory() ) {
            return console.log( chalk.bold.red( "✘ given folder isn't a folder, use current path instead." ) );
        }
        sServerRoot = sFolder;
    } )
    .parse( process.argv );

if ( isNaN( iPort = +( program.port || 12345 ) ) ) {
    console.log( chalk.bold.red( `✘ port must be a number, '${ iPort }' given.` ) );
    process.exit( 1 );
}

if ( iPort <= 1024 && process.getuid() !== 0 ) {
    console.log( chalk.bold.yellow( `⚠ seve needs to be run as sudo to use port '${ iPort }'.` ) );
    process.exit( 1 );
}

if ( !program.quiet ) {
    server.use( ( oRequest, oResponse, fNext ) => {
        let sHour = ( new Date() ).toTimeString().split( " " )[ 0 ];

        console.log( chalk.cyan( `[${ sHour }]` ), chalk.magenta( `(${ oRequest.method })` ), oRequest.url );
        fNext();
    } );
}

server.use( express.static( sServerRoot ) );
server.listen( iPort );
if ( program.open ) {
    open( `http://localhost:${ iPort }` );
}

console.log( chalk.underline( `Serving folder ${ chalk.bold.cyan( sServerRoot ) } listening on port ${ chalk.bold.yellow( iPort ) }.` ) );
console.log( `Quit with (${ chalk.cyan( "^+C" ) }).\n` );
