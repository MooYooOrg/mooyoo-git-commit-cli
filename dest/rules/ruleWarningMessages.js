'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _object = require('object.entries');

var _object2 = _interopRequireDefault(_object);

var _availableRules = require('./availableRules');

var _availableRules2 = _interopRequireDefault(_availableRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ruleWarningMessages = function ruleWarningMessages(input, config) {
  var warningMessage = '';

  var configRuleEntries = (0, _object2.default)(config.rules);

  configRuleEntries.forEach(function (rule) {
    var ruleName = rule[0];
    var ruleIs = _availableRules2.default[ruleName](input, config).check();

    if (!ruleIs) {
      warningMessage += _availableRules2.default[ruleName](input, config).message() + '\n';
    }
  });

  return warningMessage;
};

exports.default = ruleWarningMessages;