const inquirer = require('./../index');
const questions = [{
  name: 'a',
  type: 'list',
  message: 'a?',
  choices: [ '1', '2', '3' ]
}, {
  name: 'b',
  type: 'list',
  message: 'b?',
  choices: [ '1', '2', '3' ]
}];

inquirer
  .prompt(questions)
  .then(function(result) {
    console.log(result); //=> 1 or 2
  })
  .catch(err => {
    console.log(err);
  });
