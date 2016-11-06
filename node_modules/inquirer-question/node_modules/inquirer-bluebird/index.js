var Promise = require('bluebird');
var inquirer = require('inquirer');

var old = inquirer.prompt;

inquirer.prompt = function(questions, cb) {
  return new Promise(function(resolve) {
    return old(questions, function(answers) {
      if (cb) {
        cb(answers);
      }
      
      return resolve(answers);
    });
  });
};

module.exports = inquirer;
