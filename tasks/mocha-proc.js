"use strict";

var path = require('path');
var fork = require('child_process').fork;
var async = require('async');
// Sigh.

module.exports = function(grunt) {
  grunt.registerMultiTask('mocha-proc', 'Run tests with mocha', function() {
    var paths = this.filesSrc.map(function (file) {
        return path.resolve(file);
    });
    console.log(paths);
    // Retrieve options from the grunt task.
    var options = this.options();
    var gruntDone = this.async();

    // Guard against a common failure mode
    if (paths.length == 0) {
      grunt.warn(
        'No files found in mocha-proc:' + this.file.dest + ' task.'
      );
      return false;
    }

    var tests = [];

    function test(opts, testfile){
      return function(cb){
        var child = fork(__dirname  + '/doTest.js');
        var err = null;
        child.send({options : opts, file : testfile});
        child.on('message', function(message){
          if(message.length > 0){
            err = true;
          }
          cb(err, message);
        });
      }
    }

    for(var i=0; i<paths.length; i++){
      tests.push(test(options, paths[i]));
    }

    async.series(tests, function(err, results){
      console.log(err, results);
      gruntDone();
    });
  });
};
