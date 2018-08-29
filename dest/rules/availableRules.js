'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var rules = {
  endWithDot: function endWithDot(input) {
    return {
      message: function message() {
        return 'The commit message can not end with a dot or 。';
      },
      check: function check() {
        if (input[input.length - 1] === '.' || input[input.length - 1] === '。') {
          return false;
        }

        return true;
      }
    };
  },
  maxChar: function maxChar(input, config) {
    return {
      message: function message() {
        return 'The commit message is not allowed to be longer as ' + config.rules.maxChar + ' character, but is ' + input.length + ' character long. Consider writing a body.';
      },
      check: function check() {
        var number = config.rules.maxChar;

        if (number === -1) {
          number = Number.POSITIVE_INFINITY;
        }

        if (input.length > number) {
          return false;
        }

        return true;
      }
    };
  },
  minChar: function minChar(input, config) {
    return {
      message: function message() {
        return 'The commit message has to be at least ' + config.rules.minChar + ' character, but is only ' + input.length + ' character long.';
      },
      check: function check() {
        if (input.length < config.rules.minChar) {
          return false;
        }

        return true;
      }
    };
  }
};

exports.default = rules;