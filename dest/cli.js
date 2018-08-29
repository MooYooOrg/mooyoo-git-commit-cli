#!/usr/bin/env node
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _gitCommitCount = require('git-commit-count');

var _gitCommitCount2 = _interopRequireDefault(_gitCommitCount);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _isGitAdded = require('is-git-added');

var _isGitAdded2 = _interopRequireDefault(_isGitAdded);

var _isGitRepository = require('is-git-repository');

var _isGitRepository2 = _interopRequireDefault(_isGitRepository);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _getConfig = require('./getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _combineTypeScope = require('./helpers/combineTypeScope');

var _combineTypeScope2 = _interopRequireDefault(_combineTypeScope);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _questions = require('./questions');

var _questions2 = _interopRequireDefault(_questions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = (0, _getConfig2.default)();
var questionsList = (0, _questions2.default)(config);
var question = (0, _questions.initQuestion)(config);

var gitCommitExeca = function gitCommitExeca(message) {
  return (0, _execa2.default)('git', ['commit', '-m', message], { stdio: 'inherit' }).catch(function () {
    console.error(_chalk2.default.red('\nAn error occured. Try to resolve the previous error and run following commit message again:'));
    console.error(_chalk2.default.green('git commit -m "' + message + '"'));
  });
};

var argv = _yargs2.default.usage('Usage: $0').alias('v', 'version').describe('v', 'Version number').help('h').alias('h', 'help').argv;

var sgcPrompt = function sgcPrompt() {
  return _inquirer2.default.prompt(questionsList).then(function (answers) {
    var typeScope = (0, _combineTypeScope2.default)(answers.type, answers.scope);
    var message = answers.body ? '' + answers.editor : typeScope + ' ' + answers.description;

    return gitCommitExeca(message);
  });
};

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify();

if (argv.v) {
  console.log('v' + _package2.default.version);
} else if (!(0, _isGitRepository2.default)()) {
  console.error('fatal: Not a git repository (or any of the parent directories): .git');
} else if (!(0, _isGitAdded2.default)()) {
  console.error(_chalk2.default.red('Please', _chalk2.default.bold('git add'), 'some files first before you commit.'));
} else if ((0, _gitCommitCount2.default)() === 0 && _typeof(config.initialCommit) === 'object' && config.initialCommit.isEnabled) {
  var message = (0, _questions.initMessage)(config);

  _inquirer2.default.prompt(question).then(function (answers) {
    return answers.initCommit ? gitCommitExeca(message) : sgcPrompt();
  });
} else {
  sgcPrompt();
}