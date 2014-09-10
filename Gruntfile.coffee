###
 * seve
 * https://github.com/leny/seve
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

module.exports = ( grunt ) ->

  require( "matchdep" ).filterDev( "grunt-*" ).forEach grunt.loadNpmTasks

  grunt.initConfig
    coffeelint:
      options:
        arrow_spacing:
          level: "error"
        camel_case_classes:
          level: "error"
        duplicate_key:
          level: "error"
        indentation:
          level: "ignore"
        max_line_length:
          level: "ignore"
        no_backticks:
          level: "error"
        no_empty_param_list:
          level: "error"
        no_stand_alone_at:
          level: "error"
        no_tabs:
          level: "error"
        no_throwing_strings:
          level: "error"
        no_trailing_semicolons:
          level: "error"
        no_unnecessary_fat_arrows:
          level: "error"
        space_operators:
          level: "error"
      lib:
        files:
          src: [ "src/**/*.coffee" ]
    coffee:
      lib:
        expand: yes
        cwd: "src"
        src: [ "**/*.coffee" ]
        dest: "lib"
        ext: ".js"
        options:
          bare: yes
    concat:
      options:
        banner: "#!/usr/bin/env node"
      lib:
        src: "lib/seve.js"
        dest: "lib/seve.js"
    watch:
      lib:
        files: [
          "src/**/*.coffee"
        ]
        options:
          nospawn: yes
        tasks: [
          "clear"
          "coffeelint"
          "coffee"
          "concat"
        ]

  grunt.registerTask "default", [
    "clear"
    "coffeelint"
    "coffee"
    "concat"
  ]
