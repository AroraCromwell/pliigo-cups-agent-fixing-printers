# log-output-node [![Build Status](https://travis-ci.org/rafaelrinaldi/log-output-node.svg?branch=master)](https://travis-ci.org/rafaelrinaldi/log-output-node)

> [Node.js](https://nodejs.org) adapter for [`log-output`](http://github.com/rafaelrinaldi/log-output).

This is the default writable stream adapter for `log-output`.

## Install

```sh
$ npm install log-output-node --save
```

## Usage

```javascript
var logOutput = require('log-output');
var nodeAdapter= require('log-output-node');

logOutput.adapter(nodeAdapter());

// If you want to log to `stderr` uncomment the line below
// logOutput.adapter(nodeAdapter(process.stderr));

logOutput('yay'); // yay
```

## License

MIT © [Rafael Rinaldi](http://rinaldi.io)
