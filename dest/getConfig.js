'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonExtra = require('json-extra');

var _jsonExtra2 = _interopRequireDefault(_jsonExtra);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var cwd = process.cwd();
var homedir = _os2.default.homedir();

var getConfig = function getConfig(altPath) {
  var pathString = altPath || _path2.default.join(cwd, '.sgcrc');
  var configObject = _jsonExtra2.default.readToObjSync(pathString);
  var globalConfig = _jsonExtra2.default.readToObjSync(_path2.default.join(homedir, '.sgcrc'));
  var packageConfig = _jsonExtra2.default.readToObjSync(_path2.default.join(cwd, 'package.json')).sgc;
  var sgcrcDefaultConfig = _jsonExtra2.default.readToObjSync(_path2.default.join(__dirname, '..', '.sgcrc'));
  var sgcrcTestDefaultConfig = _jsonExtra2.default.readToObjSync(_path2.default.join(__dirname, '..', '.sgcrc_default'));

  var sgcrcDefault = sgcrcDefaultConfig || sgcrcTestDefaultConfig;

  // priority order (1. highest priority):
  // 1. local config
  //   - 1. .sgcrc
  //   - 2. (package.json).sgc
  // 2. global config
  // 3. default config
  //   - 1. from ../.sgcrc
  //   - 2. test case ../.sgcrc is renamed to ../.sgcrc_default
  var config = configObject || packageConfig || globalConfig || sgcrcDefault;

  // set defaults which are necessary
  var tempConfig = (0, _lodash2.default)({}, sgcrcDefault, config);

  // do not merge types
  // so return them to their set default
  if (config.types) {
    tempConfig.types = config.types;
  }

  if (config.initialCommit) {
    tempConfig.initialCommit = config.initialCommit;
  }

  // next will remove "inherit" from the config
  // eslint-disable-next-line

  var inherit = tempConfig.inherit,
      copiedConfig = _objectWithoutProperties(tempConfig, ['inherit']);

  return copiedConfig;
};

exports.default = getConfig;