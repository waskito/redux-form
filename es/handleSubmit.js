var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import isPromise from 'is-promise';
import SubmissionError from './SubmissionError';

var handleSubmit = function handleSubmit(submit, props, valid, asyncValidate, fields) {
  var dispatch = props.dispatch;
  var onSubmitFail = props.onSubmitFail;
  var onSubmitSuccess = props.onSubmitSuccess;
  var startSubmit = props.startSubmit;
  var stopSubmit = props.stopSubmit;
  var setSubmitFailed = props.setSubmitFailed;
  var setSubmitSucceeded = props.setSubmitSucceeded;
  var syncErrors = props.syncErrors;
  var touch = props.touch;
  var values = props.values;
  var persistentSubmitErrors = props.persistentSubmitErrors;


  touch.apply(undefined, _toConsumableArray(fields)); // mark all fields as touched

  // XXX: Always submitting when persistentSubmitErrors is enabled ignores sync errors.
  // It would be better to check whether the form as any other errors except submit errors.
  // This would either require changing the meaning of `valid` (maybe breaking change),
  // having a more complex conditional in here, or executing sync validation in here
  // the same way as async validation is executed.
  if (valid || persistentSubmitErrors) {
    var _ret = function () {
      var doSubmit = function doSubmit() {
        var result = void 0;
        try {
          result = submit(values, dispatch, props);
        } catch (submitError) {
          var error = submitError instanceof SubmissionError ? submitError.errors : undefined;
          setSubmitFailed.apply(undefined, _toConsumableArray(fields));
          if (onSubmitFail) {
            onSubmitFail(error, dispatch);
          }
          return error;
        }
        if (isPromise(result)) {
          startSubmit();
          return result.then(function (submitResult) {
            stopSubmit();
            setSubmitSucceeded();
            if (onSubmitSuccess) {
              onSubmitSuccess(submitResult, dispatch);
            }
            return submitResult;
          }, function (submitError) {
            var error = submitError instanceof SubmissionError ? submitError.errors : undefined;
            stopSubmit(error);
            setSubmitFailed.apply(undefined, _toConsumableArray(fields));
            if (onSubmitFail) {
              onSubmitFail(error, dispatch);
            }
            return error;
          });
        } else {
          setSubmitSucceeded();
          if (onSubmitSuccess) {
            onSubmitSuccess(result, dispatch);
          }
        }
        return result;
      };

      var asyncValidateResult = asyncValidate && asyncValidate();
      if (asyncValidateResult) {
        return {
          v: asyncValidateResult.then(function (asyncErrors) {
            if (asyncErrors) {
              throw asyncErrors;
            }
            return doSubmit();
          }).catch(function (asyncErrors) {
            setSubmitFailed.apply(undefined, _toConsumableArray(fields));
            if (onSubmitFail) {
              onSubmitFail(asyncErrors, dispatch);
            }
            return Promise.reject(asyncErrors);
          })
        };
      } else {
        return {
          v: doSubmit()
        };
      }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    setSubmitFailed.apply(undefined, _toConsumableArray(fields));
    if (onSubmitFail) {
      onSubmitFail(syncErrors, dispatch);
    }
    return syncErrors;
  }
};

export default handleSubmit;