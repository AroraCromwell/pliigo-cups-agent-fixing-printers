var inquirer = require('inquirer-bluebird');

inquirer
  .prompt({
    type: 'list',
    name: 'q1',
    message: 'hi',
    choices: [
      'test-1',
      'test-2'
    ]
  })
  .then(function(result) {
    if (result.q1 === 'test-1') {
      return 1;
    } else if (result.q1 === 'test-2') {
      return 2;
    }
  });
