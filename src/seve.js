#!/usr/bin/env node
/* leny/seve
 *
 * /src/seve.js - Main Entry point
 *
 * coded by leny@flatLand!
 * refactored at 07/09/2019
 */

/* eslint-disable no-console, no-sync */

import program from "commander";
import fs from "fs";
import open from "open";
import Koa from "koa";
import koaStatic from "koa-static";
import chalk from "chalk";

const pkg = require("../package.json");
const server = new Koa();

let root = process.cwd();

program
    .version(pkg.version)
    .arguments("[folder]")
    .usage("[options] [folder]")
    .description(
        "Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current).",
    )
    .option("-p, --port <port>", "port used by the server (default to 12345)")
    .option("-q, --quiet", "don't show the log")
    .option("-n, --no-autoindex", "disable autoindex")
    .option("-e, --exclude <glob>", "don't show matching files in autoindex")
    .option("-N, --no-open", "don't browse to the URL at startup")
    .option("--indexfile <filename>", "filename for index file")
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

        root = folder;

        return true;
    })
    .parse(process.argv);

const port = program.port || 12345;

if (isNaN(port)) {
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
    // TODO: configure autoindex
}

if (!program.quiet) {
    server.use(async (ctx, next) => {
        await next();
        const responseTime = ctx.response.get("X-Response-Time");
        const [hour] = new Date().toTimeString().split(" ");
        console.log(
            chalk.cyan(`[${hour}]`),
            chalk.magenta(`(${ctx.request.method})`),
            ctx.request.url,
            chalk.gray("-"),
            chalk.blue(responseTime),
        );
    });
    server.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        ctx.set("X-Response-Time", `${Date.now() - start}ms`);
    });
}

server.use(koaStatic(root, {index: program.indexfile || "index.html"}));
server.listen(port);

if (program.open) {
    open(`http://localhost:${port}`);
}

console.log(
    chalk.underline(
        `${chalk.blue("seve")}: serving folder ${chalk.bold.cyan(
            root,
        )} listening on port ${chalk.bold.yellow(port)}.`,
    ),
);
console.log(`Quit with (${chalk.cyan("^+C")}).\n`);
