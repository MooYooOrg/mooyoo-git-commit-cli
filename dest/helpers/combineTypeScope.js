'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var combineTypeScope = function combineTypeScope(type, scope) {
  var thisType = type;

  var thisScope = scope || '';
  var excludeScopes = ['(none)', 'no scope'];

  // add scope correctly if ':' is at the end
  if (thisScope.length > 0 && !excludeScopes.includes(thisScope.toLowerCase())) {
    if (thisType.charAt(thisType.length - 1) === ':') {
      thisType = thisType.slice(0, thisType.length - 1);
      thisType = '' + thisType + thisScope.toLowerCase() + ':';
    } else {
      thisType += thisScope;
    }
  }

  return thisType;
};

exports.default = combineTypeScope;