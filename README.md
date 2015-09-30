# sèvè

[![NPM version](http://img.shields.io/npm/v/seve.svg)](https://www.npmjs.org/package/seve) ![Dependency Status](https://david-dm.org/leny/seve.svg) ![Downloads counter](http://img.shields.io/npm/dm/seve.svg)

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

#### Arguments

##### folder

The folder to serve. If no folder is given (or if the given path isn't a folder), the current folder will be used.

#### Options

##### port (`-p`,`--port <port>`)

Manually setup the port for the server. Defaults to `12345`.

##### quiet (`-q`,`--quiet`)

By default, **sèvè** output all the logs. You can tell him to shut the hell up with this option.

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

* **0.3.0**: Warn & exit if seve needs sudo rights (*30/09/15*)
* **0.2.0**: Accept a folder argument to choose the folder to serve (*28/08/15*)
* **0.1.1**: Add time to logs (*23/09/14*)
* **0.1.0**: Initial release (*11/09/14*)

### TODO

* [ ] Add livereload capabilities?

## License
Copyright (c) 2014 Leny  
Licensed under the MIT license.
