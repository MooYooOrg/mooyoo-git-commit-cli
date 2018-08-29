'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var combineTypeScope = function combineTypeScope(type, scope) {
  var thisType = type;

  var thisScope = scope || '';

  // add scope correctly if ':' is at the end
  if (thisScope.length > 0) {
    if (thisType.charAt(thisType.length - 1) === ':') {
      thisType = thisType.slice(0, thisType.length - 1);
      thisType = '' + thisType + thisScope + ':';
    } else {
      thisType += thisScope;
    }
  }

  return thisType;
};

exports.default = combineTypeScope;