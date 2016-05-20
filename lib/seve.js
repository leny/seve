#!/usr/bin/env node

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /* seve
                                                                                                                                                                                                                                                   * https://github.com/leny/seve
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   * JS Document - /seve.js - main entry point, commander setup and runner
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   * Copyright (c) 2014 Leny
                                                                                                                                                                                                                                                   * Licensed under the MIT license.
                                                                                                                                                                                                                                                   */

/* eslint-disable no-console */

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _expressHandlebars = require("express-handlebars");

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _mimetype = require("mimetype");

var _mimetype2 = _interopRequireDefault(_mimetype);

var _humanSize = require("human-size");

var _humanSize2 = _interopRequireDefault(_humanSize);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _openurl = require("openurl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require("../package.json"),
    server = (0, _express2.default)(),
    sServerRoot = process.cwd(),
    iPort = undefined;

_commander2.default.version(pkg.version).arguments("[folder]").usage("[options] [folder]").description("Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current).").option("-p, --port <port>", "port used by the server (default to 12345)").option("-q, --quiet", "don't show the logs").option("-i, --index", "enable autoindex").option("-N, --no-open", "don't browse to the URL at startup").action(function (sFolder) {
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

if (_commander2.default.index) {
    server.engine("hbs", (0, _expressHandlebars2.default)({ "extname": "hbs" })).set("view engine", "hbs").set("views", __dirname + "/../views").use("/__seve", _express2.default.static(__dirname + "/../autoindexes")).use(function (oRequest, oResponse, fNext) {
        if (oRequest.url.substr(-1) === "/") {
            var _ret = function () {
                var sPath = _path2.default.join(sServerRoot, oRequest.url);

                if (_fs2.default.existsSync(sPath + "/index.html")) {
                    return {
                        v: oResponse.sendFile(sPath + "/index.html")
                    };
                }
                if (_fs2.default.existsSync(sPath + "/index.htm")) {
                    return {
                        v: oResponse.sendFile(sPath + "/index.htm")
                    };
                }

                return {
                    v: oResponse.render("autoindex.hbs", {
                        "files": _fs2.default.readdirSync(sPath).map(function (sFile) {
                            if (sFile.substr(0, 1) !== ".") {
                                var oFile = _fs2.default.statSync(sPath + "/" + sFile),
                                    sMimeType = _mimetype2.default.lookup(sFile);

                                sMimeType = sMimeType ? sMimeType.split("/")[0] : "unknown";

                                return {
                                    "isFolder": oFile.isDirectory(),
                                    "mime": oFile.isDirectory() ? "folder" : sMimeType,
                                    "name": sFile,
                                    "size": (0, _humanSize2.default)(oFile.size),
                                    "time": {
                                        "raw": oFile.mtime,
                                        "human": (0, _moment2.default)(oFile.mtime).format("YYYY-MM-DD HH:mm:SS")
                                    }
                                };
                            }

                            return false;
                        }).sort(),
                        "folder": oRequest.url,
                        "hasParent": oRequest.url !== "/",
                        "port": iPort,
                        "root": sServerRoot.replace(_os2.default.homedir(), "~"),
                        "version": pkg.version
                    })
                };
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
        fNext();
    });
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

if (_commander2.default.open) {
    (0, _openurl.open)("http://localhost:" + iPort);
}

console.log(_chalk2.default.underline("Serving folder " + _chalk2.default.bold.cyan(sServerRoot) + " listening on port " + _chalk2.default.bold.yellow(iPort) + "."));
console.log("Quit with (" + _chalk2.default.cyan("^+C") + ").\n");
