# inquirer-bluebird

[![Build Status](https://travis-ci.org/ewnd9/inquirer-bluebird.svg?branch=master)](https://travis-ci.org/ewnd9/inquirer-bluebird)

> Bluebird wrapper for [inquirer.js](https://www.npmjs.com/package/inquirer)

There is a [bluebird-inquirer](https://www.npmjs.com/package/bluebird-inquirer),
but it promisify only prompt function, so you can't use `new inquirer.Separator()`.

## Install

```
$ npm install inquirer-bluebird --save
```

## Usage

```js
const questions = [{
  name: 'a',
  type: 'list',
  message: 'pick a number',
  choices: [ '1', '2', '3' ]
}, {
  name: 'b',
  type: 'list',
  message: 'pick a letter',
  choices: [ 'x', 'y', 'z' ]
}];
```

### Before

```js
const inquirer = require('inquirer');

new Promise(resolve => {
  inquirer.prompt(questions, function(answers) {
    resolve(answers);
  });  
})
.then(function(answers) {
  //=> { a: '<1|2|3>', b: '<x|y|z>' }
});
```

### Now

```js
const inquirer = require('inquirer-bluebird');

inquirer.prompt(questions)
  .then(function(answers) {
    //=> { a: '<1|2|3>', b: '<x|y|z>' }
  });
```

## Related

- [inquirer](https://github.com/sboudrias/Inquirer.js)
- [inquirer-test](https://github.com/ewnd9/inquirer-test)
- [inquirer-question](https://github.com/ewnd9/inquirer-question)
- [inquirer-credentials](https://github.com/ewnd9/inquirer-credentials)
- [inquirer-menu](https://github.com/ewnd9/inquirer-menu)

## License

MIT © [ewnd9](http://ewnd9.com)
