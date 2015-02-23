define(function () {
  function resolve(value, baseFulfill, baseReject, save) {
    var promise;
    if (value && typeof value.then === 'function') {
      value.done(baseFulfill, baseReject);
      promise = value;
    } else {
      promise = new Promise(function (fulfill) {
        fulfill(value);
        baseFulfill(value);
      });
    }
    save(promise);
  }

  function reject(reason, baseReject, save) {
    save(new Promise(function (fulfill, reject) {
      reject(reason);
      baseReject(reason);
    }));
  }

  return function defer() {
    var resolvedPromise,
      baseFulfill,
      baseReject,
      deferred = {},
      promise = new Promise(function (fulfill, reject) {
        baseFulfill = fulfill;
        baseReject = reject;
      });

    function save(newPromise) {
      resolvedPromise = newPromise;
      promise.source = newPromise;
    }
    deferred.promise = promise;
    deferred.resolve = function (value) {
      if (resolvedPromise) {
        return;
      }
      resolve(value, baseFulfill, baseReject, save);
    };
    deferred.reject = function (reason) {
      if (resolvedPromise) {
        return;
      }
      reject(reason, baseReject, save);
    };
    return deferred;
  };
});
