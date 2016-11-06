var inquirer = require('./../../index');
var outputs = ['TEST-1', 'TEST-2', 'TEST-3'];

inquirer
  .prompt({
    name: 'q',
    type: 'list',
    message: 'hi',
    choices: [ '1', '2', '3' ]
  })
  .then(function(answers) {
    console.log(outputs[+answers.q - 1]);
  });
