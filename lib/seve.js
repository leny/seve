#!/usr/bin/env node"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* seve
 * https://github.com/leny/seve
 *
 * JS Document - /seve.js - main entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */

/* eslint-disable no-console */

var pkg = require("../package.json"),
    server = (0, _express2.default)(),
    sServerRoot = process.cwd(),
    iPort = undefined;

_commander2.default.version(pkg.version).arguments("[folder]").usage("[options] [folder]").description("Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current).").option("-p, --port <port>", "port used by the server (default to 12345)").option("-q, --quiet", "don't show the logs").action(function (sFolder) {
    if (!_fs2.default.existsSync(sFolder)) {
        return console.log(_chalk2.default.bold.red("✘ given folder doesn't exists, use current path instead."));
    }
    if (!_fs2.default.statSync(sFolder).isDirectory()) {
        return console.log(_chalk2.default.bold.red("✘ given folder isn't a folder, use current path instead."));
    }
    sServerRoot = sFolder;
}).parse(process.argv);

if (isNaN(iPort = +(_commander2.default.port || 12345))) {
    console.log(_chalk2.default.bold.red("✘ port must be a number, '" + iPort + "' given."));
    process.exit(1);
}

if (iPort <= 1024 && process.getuid() !== 0) {
    console.log(_chalk2.default.bold.yellow("⚠ seve needs to be run as sudo to use port '" + iPort + "'."));
    process.exit(1);
}

if (!_commander2.default.quiet) {
    server.use(function (oRequest, oResponse, fNext) {
        var sHour = new Date().toTimeString().split(" ")[0];

        console.log(_chalk2.default.cyan("[" + sHour + "]"), _chalk2.default.magenta("(" + oRequest.method + ")"), oRequest.url);
        fNext();
    });
}

server.use(_express2.default.static(sServerRoot));
server.listen(iPort);

console.log(_chalk2.default.underline("Serving folder " + _chalk2.default.bold.cyan(sServerRoot) + " listening on port " + _chalk2.default.bold.yellow(iPort) + "."));
console.log("Quit with (" + _chalk2.default.cyan("^+C") + ").\n");
