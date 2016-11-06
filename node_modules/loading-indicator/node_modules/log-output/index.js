'use strict';

function logOutput(message) {
  var currentStream;
  var writableStream;

  var render = function() {
    // Message format is the same as `console.log()`
    message = [].join.call(arguments, ' ');

    if(!writableStream) {
      writableStream = require('log-output-node')(currentStream);
    }

    writableStream.resetLine();
    writableStream.resetCursor();
    writableStream.output(message);
  };

  render.stream = function(stream) {
    currentStream = stream;
  };

  render.adapter = function(adapter) {
    writableStream = adapter;
  };

  render.clear = function() {
    writableStream.resetLine();
    writableStream.output('');
  };

  render.done = function() {
    writableStream.newLine();
  };

  return render;
}

module.exports = logOutput();
