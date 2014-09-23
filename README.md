# seve

[![NPM version](http://img.shields.io/npm/v/seve.svg)](https://www.npmjs.org/package/seve) ![Dependency Status](https://david-dm.org/leny/seve.svg) ![Downloads counter](http://img.shields.io/npm/dm/seve.svg)

> Run a tiny & simple server from the current folder in your terminal (like, for tests & stuffs).

* * *

## Usage

### Installation

To use **seve**, you must at first install it globally.

    (sudo) npm install -g seve

### Usage

Using **seve** is simple, from inside any folder: 

    seve [options]
    
    Options:

        -h, --help             output usage information
        -V, --version          output the version number
        -p, --port <port>      port used by the server (default to 12345)
        -q, --quiet            don't show the logs
    
#### Options

##### port (`-p`,`--port <port>`)

Manually setup the port for the server. Defaults to `12345`.

##### quiet (`-q`,`--quiet`)

By default, **seve** output all the logs. You can tell him to shut the hell up with this option.

##### help (`-h`,`--help`)

Output usage information.

##### version (`-v`,`--version`)

Output **seve**' version number.

## Usage as grunt plugin

There's many great grunt plugins to do what seve does, like [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect).
    
## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.1.1**: Add time to logs (*23/09/14*)
* **0.1.0**: Initial release (*11/09/14*)

### TODO

* [ ] Add livereload capabilities?

## License
Copyright (c) 2014 Leny  
Licensed under the MIT license.
