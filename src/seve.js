#!/usr/bin/env node
/* leny/seve
 *
 * /src/seve.js - Main Entry point
 *
 * coded by leny@flatLand!
 * refactored at 30/10/2018
 */

/* eslint-disable no-console */

import express from "express";
import expressHBS from "express-handlebars";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import os from "os";
import program from "commander";
import mimetype from "mimetype";
import humanSize from "human-size";
import moment from "moment";
import opn from "opn";

let pkg = require("../package.json"),
    server = express(),
    sServerRoot = process.cwd(),
    iPort;

program
    .version(pkg.version)
    .arguments("[folder]")
    .usage("[options] [folder]")
    .description(
        "Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current).",
    )
    .option("-p, --port <port>", "port used by the server (default to 12345)")
    .option("-q, --quiet", "don't show the logs")
    .option("-i, --index", "enable autoindex")
    .option(
        "-e, --exclude <glob>",
        "don't show matching files (only with autoindex)",
    )
    .option("-N, --no-open", "don't browse to the URL at startup")
    .action(sFolder => {
        if (!fs.existsSync(sFolder)) {
            return console.log(
                chalk.bold.red(
                    "✘ given folder doesn't exists, use current path instead.",
                ),
            );
        }
        if (!fs.statSync(sFolder).isDirectory()) {
            return console.log(
                chalk.bold.red(
                    "✘ given folder isn't a folder, use current path instead.",
                ),
            );
        }
        sServerRoot = sFolder;
    })
    .parse(process.argv);

if (isNaN((iPort = +(program.port || 12345)))) {
    console.log(chalk.bold.red(`✘ port must be a number, '${iPort}' given.`));
    process.exit(1);
}

if (iPort <= 1024 && process.getuid() !== 0) {
    console.log(
        chalk.bold.yellow(
            `⚠ seve needs to be run as sudo to use port '${iPort}'.`,
        ),
    );
    process.exit(1);
}

if (program.index) {
    server
        .engine("hbs", expressHBS({extname: "hbs"}))
        .set("view engine", "hbs")
        .set("views", `${__dirname}/../views`)
        .use("/__seve", express.static(`${__dirname}/../autoindexes`))
        .use((oRequest, oResponse, fNext) => {
            if (oRequest.url.substr(-1) === "/") {
                let sPath = path.join(sServerRoot, oRequest.url);

                if (fs.existsSync(`${sPath}/index.html`)) {
                    return oResponse.sendFile("./index.html", {
                        root: path.resolve(process.cwd(), sPath),
                    });
                }
                if (fs.existsSync(`${sPath}/index.htm`)) {
                    return oResponse.sendFile("index.htm", {
                        root: path.resolve(process.cwd(), sPath),
                    });
                }

                return oResponse.render("autoindex.hbs", {
                    files: fs
                        .readdirSync(sPath)
                        .map(sFile => {
                            if (sFile.substr(0, 1) !== ".") {
                                let oFile = fs.statSync(`${sPath}/${sFile}`),
                                    sMimeType = mimetype.lookup(sFile);

                                sMimeType = sMimeType
                                    ? sMimeType.split("/")[0]
                                    : "unknown";

                                return {
                                    isFolder: oFile.isDirectory(),
                                    mime: oFile.isDirectory()
                                        ? "folder"
                                        : sMimeType,
                                    name: sFile,
                                    size: humanSize(oFile.size),
                                    time: {
                                        raw: oFile.mtime,
                                        human: moment(oFile.mtime).format(
                                            "YYYY-MM-DD HH:mm:SS",
                                        ),
                                    },
                                };
                            }

                            return false;
                        })
                        .sort(),
                    folder: oRequest.url,
                    hasParent: oRequest.url !== "/",
                    port: iPort,
                    root: sServerRoot.replace(os.homedir(), "~"),
                    version: pkg.version,
                });
            }
            fNext();
        });
}

if (!program.quiet) {
    server.use((oRequest, oResponse, fNext) => {
        let sHour = new Date().toTimeString().split(" ")[0];

        console.log(
            chalk.cyan(`[${sHour}]`),
            chalk.magenta(`(${oRequest.method})`),
            oRequest.url,
        );
        fNext();
    });
}

server.use(express.static(sServerRoot));
server.listen(iPort);

if (program.open) {
    opn(`http://localhost:${iPort}`);
}

console.log(
    chalk.underline(
        `Serving folder ${chalk.bold.cyan(
            sServerRoot,
        )} listening on port ${chalk.bold.yellow(iPort)}.`,
    ),
);
console.log(`Quit with (${chalk.cyan("^+C")}).\n`);
