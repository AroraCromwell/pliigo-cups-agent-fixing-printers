var inquirer = require('./..');

inquirer
  .prompt({
    type: 'list',
    message: 'hi',
    choices: {
      'test-1': function() {
        // some computatations
        return 'result-1';
      },
      'test-2': 'result-2'
    }
  })
  .then(function(result) {
    console.log(result); //=> 'result-1' or 'result-2'
  });
