'use strict';

var logOutput = require('./');
var frames = 'lorem ipsum dolor'.split(/\s/);
var i = 0;

var interval = setInterval(function() {
  var frame = frames[i++ % frames.length];
  logOutput(frame, 'foo', 'bar');
}, 500);

setTimeout(function() {
  logOutput.done();
  console.log('yay');
  clearTimeout(interval);
}, 5000);
