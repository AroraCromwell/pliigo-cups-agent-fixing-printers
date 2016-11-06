> # Deprecation notice :rotating_light:
> I strongly suggest you to move to [`log-update`](https://github.com/sindresorhus/log-update) that came out a little after I first wrote this module.
> It's really complete and making the switch should be really easy.
> Also, [PhantomJS 2.1 has finally came out](http://phantomjs.org/release-2.1.html) solving the problems I was trying to work around with this module.

# log-output ![Unmaintained Project](https://img.shields.io/badge/status-unmaintained-red.svg?style=flat-square)

> Persist log messages on the command line.

<sub>Formerly **write.js**.</sub>

## Install

```sh
$ npm install --save log-output
```

## Usage

```javascript
var logOutput = require('log-output');
var frames = 'lorem ipsum dolor sit'.split(' ');
var frame = 0;

setInterval(function() {
  frame = frames[frame++ % frames.length];
  logOutput(frames[frame]);
}, 1000);
```

## API

## `logOutput(message)`

### `message`

*Required*  
Type: `string`  

Output message.

## `logOutput.stream()`

Type: `Stream object`  

Specify a stream to output.

## `logOutput.adapter()`

Specify a _writable stream_ interface, which is essentially an adapter.  

The interface  **must implement** the following API:

* `resetLine()` - Reset current output line
* `newLine()` - Add a new output line
* `resetCursor([position])` - Reset cursor position (`position` defaults to `0`)
* `output(message)` - Output message

Official adapters are:

* [`log-output-node`](http://github.com/rafaelrinaldi/log-output-node) - [Node.js](http://nodejs.org) adapter. _This is the default adapter_.
* [`log-output-phantom`](http://github.com/rafaelrinaldi/log-output-phantom) - [PhantomJS](http://phantomjs.org) adapter.

You can specify your own:

```javascript
var logOutput = require('log-output');
var customAdapter = function() {
  // Assuming you have a custom stream with a non-standard interface
  var stream = require('custom-stream');

  return {
    resetLine: function() {},
    newLine: function() {},
    resetCursor: function(position) {},
    output: function() {}
  }
};

logOutput.adapter(customAdapter);
logOutput('yay'); // yay
```

## `logOutput.clear()`

Shortcut to empty current output.

## `logOutput.done()`

Shortcut to output a new line.

## Motivation

I wanted to visually persist log messages on the command line. Turns out this can be a bit tricky, that's why I have created this module.

### Thoughts on `log-update`

[`log-update`](http://github.com/sindresorhus/log-update) is essentially the same idea of `log-output` but it was released later and has no support for stream adapters.   
Adapters support was one of the reasons I've created this module in the first place. I needed a way to persist the log messages within a PhantomJS instance.

## License

MIT © [Rafael Rinaldi](http://rinaldi.io)
