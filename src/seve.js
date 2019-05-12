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
import MimeType from "mimetype";
import humanSize from "human-size";
import moment from "moment";
import open from "open";
import micromatch from "micromatch";

let pkg = require("../package.json"),
    server = express(),
    serverRoot = process.cwd(),
    port;

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
    .action(folder => {
        if (!fs.existsSync(folder)) {
            return console.log(
                chalk.bold.red(
                    "✘ given folder doesn't exists, use current path instead.",
                ),
            );
        }
        if (!fs.statSync(folder).isDirectory()) {
            return console.log(
                chalk.bold.red(
                    "✘ given folder isn't a folder, use current path instead.",
                ),
            );
        }
        serverRoot = folder;
    })
    .parse(process.argv);

if (isNaN((port = +(program.port || 12345)))) {
    console.log(chalk.bold.red(`✘ port must be a number, '${port}' given.`));
    process.exit(1);
}

if (port <= 1024 && process.getuid() !== 0) {
    console.log(
        chalk.bold.yellow(
            `⚠ seve needs to be run as sudo to use port '${port}'.`,
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
        .use((request, response, next) => {
            if (request.url.substr(-1) === "/") {
                let folder = path.join(serverRoot, request.url);

                if (fs.existsSync(`${folder}/index.html`)) {
                    return response.sendFile("./index.html", {
                        root: path.resolve(process.cwd(), folder),
                    });
                }
                if (fs.existsSync(`${folder}/index.htm`)) {
                    return response.sendFile("index.htm", {
                        root: path.resolve(process.cwd(), folder),
                    });
                }

                return response.render("autoindex.hbs", {
                    files: fs
                        .readdirSync(folder)
                        .filter(
                            filename =>
                                !(
                                    program.exclude &&
                                    micromatch.isMatch(
                                        filename,
                                        program.exclude.split(","),
                                    )
                                ),
                        )
                        .map(filename => {
                            if (filename.substr(0, 1) !== ".") {
                                let file = fs.statSync(`${folder}/${filename}`),
                                    mimeType = MimeType.lookup(filename);

                                mimeType = mimeType
                                    ? mimeType.split("/")[0]
                                    : "unknown";

                                return {
                                    isFolder: file.isDirectory(),
                                    mime: file.isDirectory()
                                        ? "folder"
                                        : mimeType,
                                    name: filename,
                                    size: humanSize(file.size),
                                    time: {
                                        raw: file.mtime,
                                        human: moment(file.mtime).format(
                                            "YYYY-MM-DD HH:mm:SS",
                                        ),
                                    },
                                };
                            }

                            return false;
                        })
                        .sort(),
                    folder: request.url,
                    hasParent: request.url !== "/",
                    port: port,
                    root: serverRoot.replace(os.homedir(), "~"),
                    version: pkg.version,
                });
            }
            next();
        });
}

if (!program.quiet) {
    server.use((request, response, next) => {
        const hour = new Date().toTimeString().split(" ")[0];

        console.log(
            chalk.cyan(`[${hour}]`),
            chalk.magenta(`(${request.method})`),
            request.url,
        );
        next();
    });
}

server.use(express.static(serverRoot));
server.listen(port);

if (program.open) {
    open(`http://localhost:${port}`);
}

console.log(
    chalk.underline(
        `Serving folder ${chalk.bold.cyan(
            serverRoot,
        )} listening on port ${chalk.bold.yellow(port)}.`,
    ),
);
console.log(`Quit with (${chalk.cyan("^+C")}).\n`);
