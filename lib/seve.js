#!/usr/bin/env node
/*
 * seve
 * https://github.com/leny/seve
 *
 * JS/COFFEE Document - /seve.js - main entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var chalk, express, fs, iPort, pkg, program, sServerRoot, server;

pkg = require("../package.json");

server = (express = require("express"))();

chalk = require("chalk");

fs = require("fs");

sServerRoot = process.cwd();

(program = require("commander")).version(pkg.version)["arguments"]("[folder]").usage("[options] [folder]").description("Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current).").option("-p, --port <port>", "port used by the server (default to 12345)").option("-q, --quiet", "don't show the logs").action(function(folder) {
  if (!fs.existsSync(folder)) {
    return console.log(chalk.bold.red("✘ given folder doesn't exists, use current path instead."));
  }
  if (!(fs.statSync(folder)).isDirectory()) {
    return console.log(chalk.bold.red("✘ given folder isn't a folder, use current path instead."));
  }
  return sServerRoot = folder;
}).parse(process.argv);

if (isNaN((iPort = +(program.port || 12345)))) {
  console.log(chalk.bold.red("✘ port must be a number, '" + iPort + "' given."));
  process.exit(1);
}

if (!program.quiet) {
  server.use(function(oRequest, oResponse, fNext) {
    var sHour;
    sHour = (new Date()).toTimeString().split(" ")[0];
    console.log(chalk.cyan("[" + sHour + "]"), chalk.magenta("(" + oRequest.method + ")"), oRequest.url);
    return fNext();
  });
}

server.use(express["static"](sServerRoot));

server.listen(iPort);

console.log(chalk.underline("Serving folder " + (chalk.bold.cyan(sServerRoot)) + " listening on port " + (chalk.bold.yellow(iPort)) + "."));

console.log("Quit with (" + (chalk.cyan('^+C')) + ").\n");
