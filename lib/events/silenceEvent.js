'use strict';

exports.__esModule = true;

var _isEvent = require('./isEvent');

var _isEvent2 = _interopRequireDefault(_isEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var silenceEvent = function silenceEvent(event) {
  var is = (0, _isEvent2.default)(event);
  if (is) {
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
  }
  return is;
};

exports.default = silenceEvent;