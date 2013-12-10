var createDomain = require('domain').create;
var path = require('path');
var Mocha = require('mocha');

process.on('message', start)

function start(data){
  var options = data.options;
  var testfile = data.file;

  console.log(data);
  var failed = [];

  var mocha = new Mocha(options);

  mocha.addFile(testfile);

  var runner = mocha.run(function(failures){
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
    process.send(failed);
    process.exit();
  });


  runner.on('fail', function(test){
    failed.push({title : test.title});
  });
}

