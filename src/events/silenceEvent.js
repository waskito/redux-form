import isEvent from './isEvent';

const silenceEvent = event => {
  const is = isEvent(event);
  if (is) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  }
  return is;
};

export default silenceEvent;
