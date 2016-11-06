var inquirer = require('inquirer-bluebird');
var clone = require('clone');

var prompt = inquirer.prompt;

inquirer.prompt = function(_params, cb) {
  if (!Array.isArray(_params) && (typeof _params.choices === 'object') && !Array.isArray(_params.choices)) {
    var params = clone(_params);
    params.name = 'x';

    var choices = params.choices;

    params.choices = Object.keys(choices).map(function(key) {
      var val = choices[key];
      if (key === '_____') {
        return (new inquirer.Separator(val));
      } else {
        return {
          name: key,
          value: key
        };
      }
    });

    return prompt(params, cb).then(function(answers) {
      var res = choices[answers.x];
      return typeof res === 'function' ? res() : res;
    });
  } else {
    return prompt(_params, cb);
  }
};

module.exports = inquirer;
