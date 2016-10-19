import isEvent from './isEvent';

var silenceEvent = function silenceEvent(event) {
  var is = isEvent(event);
  if (is) {
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
  }
  return is;
};

export default silenceEvent;