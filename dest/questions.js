'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initQuestion = exports.initMessage = exports.choices = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _combineTypeScope = require('./helpers/combineTypeScope');

var _combineTypeScope2 = _interopRequireDefault(_combineTypeScope);

var _ruleWarningMessages = require('./rules/ruleWarningMessages');

var _ruleWarningMessages2 = _interopRequireDefault(_ruleWarningMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var choices = function choices(config) {
  var choicesList = [];

  config.types.forEach(function (type) {
    var emoji = config.emoji && type.emoji ? type.emoji + ' ' : '';
    var configType = config.lowercaseTypes ? type.type.toLowerCase() : type.type;
    var description = type.description || '';

    choicesList.push({
      value: emoji + configType,
      name: _chalk2.default.bold(configType) + ' ' + description
    });
  });

  return choicesList;
};

var scopeChoices = function scopeChoices(config) {
  var choicesList = [];

  config.scopes.forEach(function (scope) {
    var transformScope = config.lowercaseScopes ? scope.value.toLowerCase() : scope.value;
    var description = scope.description || '';

    choicesList.push({
      value: transformScope,
      name: _chalk2.default.bold(transformScope) + ' ' + description
    });
  });

  return choicesList;
};

var initMessage = function initMessage(config) {
  var message = '';

  if (config.emoji && _typeof(config.initialCommit) === 'object' && config.initialCommit.isEnabled) {
    message = config.initialCommit.emoji + ' ' + config.initialCommit.message;
  } else {
    message = config.initialCommit.message;
  }

  return message;
};

var initQuestion = function initQuestion(config) {
  var message = initMessage(config);

  return {
    type: 'confirm',
    name: 'initCommit',
    message: 'Confirm as first commit message: "' + message + '"',
    default: true
  };
};

var questions = function questions(config) {
  var choicesList = choices(config);
  var scopeChoicesList = scopeChoices(config);
  var questionsList = [{
    type: 'list',
    name: 'type',
    message: 'Select the type of your commit:',
    choices: choicesList
  }, {
    type: 'input',
    name: 'scope',
    message: 'Enter your scope (no whitespaces allowed):',
    when: function when() {
      return config.scope;
    },
    validate: function validate(input) {
      return input.match(/\s/) !== null ? 'No whitespaces allowed' : true;
    },
    filter: function filter(input) {
      return input ? '(' + input + ')' : input;
    }
  }, {
    type: 'list',
    name: 'scope',
    message: 'Select the scope of your commit:',
    when: function when() {
      return config.scopeList;
    },
    choices: scopeChoicesList
  }, {
    type: 'input',
    name: 'description',
    message: 'Enter your commit message:',
    validate: function validate(input, answers) {
      if (input.length === 0) {
        return 'The commit message is not allowed to be empty';
      }

      var scope = answers.scope || '';
      var type = (0, _combineTypeScope2.default)(answers.type, scope.trim());
      var combinedInput = type + ' ' + input.trim();
      var warnings = (0, _ruleWarningMessages2.default)(combinedInput, config);

      return warnings || true;
    }
  }, {
    type: 'confirm',
    name: 'body',
    message: 'Do you want to add a body?',
    when: function when() {
      return config.body;
    },
    default: false
  }, {
    type: 'editor',
    name: 'editor',
    message: 'This will let you add more information',
    when: function when(answers) {
      return answers.body;
    },
    default: function _default(answers) {
      var type = (0, _combineTypeScope2.default)(answers.type, answers.scope);

      return type + ' ' + answers.description + '\n\n\n';
    }
  }];

  return questionsList;
};

exports.default = questions;
exports.choices = choices;
exports.initMessage = initMessage;
exports.initQuestion = initQuestion;