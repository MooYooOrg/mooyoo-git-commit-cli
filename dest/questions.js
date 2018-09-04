'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initQuestion = exports.initMessage = exports.choices = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

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
    var transformScope = config.lowercaseScopes ? scope.toLowerCase() : scope;
    choicesList.push(transformScope);
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

var typeChoicesList = [];
var scopeChoicesList = [];

var searchScopeAsync = function searchScopeAsync(previousAnswers, input) {
  var filterInput = input || '';
  return new Promise(function (resolve) {
    var fuzzyResult = _fuzzy2.default.filter(filterInput, scopeChoicesList);
    resolve(fuzzyResult.map(function (el) {
      return el.original;
    }));
  });
};

var searchTypeAsync = function searchTypeAsync(previousAnswers, input) {
  var filterInput = input || '';
  return new Promise(function (resolve) {
    var fuzzyResult = _fuzzy2.default.filter(filterInput, typeChoicesList);
    resolve(fuzzyResult.map(function (el) {
      return el.original;
    }));
  });
};

var questions = function questions(config) {
  var choicesList = choices(config);
  // change global let
  scopeChoicesList = scopeChoices(config);
  typeChoicesList = choicesList.map(function (item) {
    return item.value + item.name;
  });
  var questionsList = [{
    type: 'autocomplete',
    name: 'type',
    message: 'What\'s the type of your commit:',
    filter: function filter(input) {
      return input && input.split(':', 1)[0] ? input.split(':', 1)[0] + ':' : 'chore:';
    },
    source: searchTypeAsync,
    pageSize: 15
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
      return input ? '(' + input + ')' : 'No scope';
    },
    pageSize: 15
  }, {
    type: 'autocomplete',
    name: 'scope',
    message: 'What\'s the scope of your commit:',
    when: function when() {
      return config.scopeList;
    },
    source: searchScopeAsync,
    filter: function filter(input) {
      return input ? '(' + input + ')' : 'No scope';
    },
    pageSize: 15
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