;(function (name, definition) {
  // Check define
  var hasDefine = typeof define === 'function',
    // Check exports
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition();
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }
})('reload', function () {
  var isArray = function (obj) {
    return obj instanceof Array;
  };

  var isFunction = function (obj) {
    return typeof obj === 'function';
  };

  var argsToArray = function (args) {
    return Array.prototype.slice.call(args);
  };

  var each = function (arr, func) {
    var i, len;
    if (isArray(arr)) {
      for (i = 0, len = arr.length; i < len; i++) {
        func(arr[i], i, arr);
      }
    } else {
      for (i in arr) {
        func(arr[i], i, arr);
      }
    }
    return arr;
  };

  var map = function (arr, func) {
    var mapped = isArray(arr) ? [] : {};
    var add = isArray(arr) ? function (item) {
      mapped.push(item);
    } : function (item, index) {
      mapped[index] = item;
    };
    each(arr, function (item, index) {
      add(func(item, index, arr)); 
    });
    return mapped;
  };

  var isUniqueArray = function (arr) {
    var i, j, len;
    for (i = 0, len = arr.length; i < len - 1; i++) {
      for (j = i + 1; j < len; j++) {
        if (i === j) {
          return false;
        }
      }
    }
    return true;
  };

  var find = function (arr, val) {
    var i, len;
    if (isArray(arr)) {
      for (i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === val) {
          return i;
        }
      }
    } else {
      for (i in arr) {
        if (arr[i] === val) {
          return i;
        }
      }
    }
    return void 0;
  };

  var reload = function () {
    var functions = argsToArray(arguments);
    var lengths = map(functions, function (func) {return func.length;});
    var i, j, len;
    each(functions, function (func) {
      if (!isFunction(func)) {
        throw new Error('unexpect type of arguments');
      }
    });
    if (!isUniqueArray(lengths)) {
      throw new Error('all the functions should have different arguments length');
    }
    return function () {
      var index;
      if (typeof (index = find(lengths, arguments.length)) === 'undefined') {
        throw new Error('expected arguments length');
      }
      return functions[index].apply(this, arguments);
    };
  };
  return reload;
});


(function () {
  var Foo = reload(function (a, b) {
    console.log(2);
  }, function (a, b, c) {
    console.log(3);
  });
  Foo(2, 3);

  var Bar = reload(function (a, b) {
    this.baz = 2;
  }, function (a, b, c) {
    this.baz = 3;
  });
  var bar = new Bar(1, 1);
  console.log(bar);

  var Sample = function () {
    this.key = 999;
  };
  Sample.prototype.test = reload(function (a, b) {
    console.log(this.key);
  }, function (a, b, c) {
    this.key = c;
  });
  var sampleA = new Sample();
  var sampleB = new Sample();
  sampleA.test(1, 2);
  sampleB.test(1, 2, 3);
  console.log(sampleA.key, 'A');
  console.log(sampleB.key, 'B');

})('test');
