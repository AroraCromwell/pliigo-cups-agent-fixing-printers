const inquirer = require('inquirer');
const questions = [{
  name: 'a',
  type: 'list',
  message: 'pick a number',
  choices: [ '1', '2', '3' ]
}, {
  name: 'b',
  type: 'list',
  message: 'pick a letter',
  choices: [ 'a', 'b', 'c' ]
}];

new Promise(resolve => {
  inquirer.prompt(questions, function(answers) {
    resolve(answers);
  });
})
.then(answers => {
  console.log(answers);
})
.catch(err => {
  console.log(err);
});
