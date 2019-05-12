# sèvè

[![NPM version](http://img.shields.io/npm/v/seve.svg)](https://www.npmjs.org/package/seve) ![Downloads counter](http://img.shields.io/npm/dm/seve.svg)

> Run a tiny & simple server (like, for tests & stuffs) from a given folder (or the current).

* * *

## Usage

### Installation

To use **sèvè**, you must at first install it globally.

    (sudo) npm install -g seve

### Usage

Using **sèvè** is simple:

    seve [options] [folder]

    Arguments:
        [folder]               folder to serve

    Options:

        -h, --help             output usage information
        -V, --version          output the version number
        -p, --port <port>      port used by the server (default to 12345)
        -q, --quiet            don't show the logs
        -i, --index            enable autoindex
        -e, --exclude <glob>   don't show matching files (only with autoindex)
        -N, --no-open          don't browse to the URL at startup

#### Arguments

##### folder

The folder to serve. If no folder is given (or if the given path isn't a folder), the current folder will be used.

#### Options

##### port (`-p`,`--port <port>`)

Manually setup the port for the server. Defaults to `12345`.

##### autoindex (`-i`,`--index`)

When no index file (`index.html` or `index.html`) are found inside a folder, **sèvè** returns an `HTTP 404 Error`. Since version `0.6.0`, by activating this option, you can show an **autoindex**: a list of files & folders in the current path.

##### exclude (`-e`,`--exclude <glob>`)

Within autoindexes, don't show the files matching the given glob string.

##### quiet (`-q`,`--quiet`)

By default, **sèvè** output all the logs. You can tell him to shut the hell up with this option.

##### no open (`-N`,`--no-open`)

By default (since version `0.5.0`), **sèvè** will browse to the URL of the server at startup. You can disable this behavior with this option.

##### help (`-h`,`--help`)

Output usage information.

##### version (`-v`,`--version`)

Output **sèvè**' version number.

## Note for ports 1 to 1024

If you want to use a port number between 1 and 1024, **seve** must be run with sudo rights.

## Usage as grunt plugin

There's many great grunt plugins to do what seve does, like [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect).

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.8.0**: Add `--exclude` option (*12/05/2019*)
* **0.7.0**: Update dependencies, update tooling (*30/10/18*)
* **0.6.0**: Add `--index` option (*21/05/16*)
* **0.5.0**: Add browse to URL behavior & `--no-open` option (*21/02/16*)
* **0.4.1**: Fix transpilation bug (*12/02/16*)
* **0.4.0**: Rewrite package using ES2015 (*15/01/16*)
* **0.3.0**: Warn & exit if seve needs sudo rights (*30/09/15*)
* **0.2.0**: Accept a folder argument to choose the folder to serve (*28/08/15*)
* **0.1.1**: Add time to logs (*23/09/14*)
* **0.1.0**: Initial release (*11/09/14*)

## License
Copyright (c) 2014 Leny
Licensed under the MIT license.
