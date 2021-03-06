'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fieldValue = require('./fieldValue');

var makeEntry = function makeEntry(value) {
  return (0, _fieldValue.makeFieldValue)(value === undefined ? {} : { initial: value, value: value });
};

/**
 * Sets the initial values into the state and returns a new copy of the state
 */
var initializeState = function initializeState(values, fields) {
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!fields) {
    throw new Error('fields must be passed when initializing state');
  }
  if (!values || !fields.length) {
    return state;
  }
  var initializeField = function initializeField(path, src, dest) {
    var dotIndex = path.indexOf('.');
    if (dotIndex === 0) {
      return initializeField(path.substring(1), src, dest);
    }
    var openIndex = path.indexOf('[');
    var closeIndex = path.indexOf(']');
    var result = _extends({}, dest) || {};
    if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
      // is dot notation
      var key = path.substring(0, dotIndex);
      result[key] = src[key] && initializeField(path.substring(dotIndex + 1), src[key], result[key] || {});
    } else if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
      (function () {
        // is array notation
        if (closeIndex < 0) {
          throw new Error('found \'[\' but no \']\': \'' + path + '\'');
        }
        var key = path.substring(0, openIndex);
        var srcArray = src[key];
        var destArray = result[key];
        var rest = path.substring(closeIndex + 1);
        if (Array.isArray(srcArray)) {
          if (rest.length) {
            // need to keep recursing
            result[key] = srcArray.map(function (srcValue, srcIndex) {
              return initializeField(rest, srcValue, destArray && destArray[srcIndex]);
            });
          } else {
            result[key] = srcArray.map(function (srcValue) {
              return makeEntry(srcValue);
            });
          }
        } else {
          result[key] = [];
        }
      })();
    } else {
      result[path] = makeEntry(src && src[path]);
    }
    return result;
  };
  return fields.reduce(function (accumulator, field) {
    return initializeField(field, values, accumulator);
  }, _extends({}, state));
};

exports.default = initializeState;