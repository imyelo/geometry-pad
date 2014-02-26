define(function (require, exports, module) {
  var isArray = function (obj) {
    return obj instanceof Array;
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

  var bind = function (element, events, callback) {
    var arr;
    arr = events.split(' ');
    each(arr, function (e) {
      if (e) {
        element.addEventListener(e, callback);
      }
    });
  };

  var drag = function (element) {
    var onStart = [], onMove = [], onEnd = [];
    var container = document;
    var isTouch = ('ontouchstart' in document.documentElement) ? true : false;
    var isDragging = false;
    var events = {};
    var last = {};
    var methods;
    if (isTouch) {
      events = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
      };
    } else {
      events = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      };
    }
    var getPageXY = function (e) {
      var pageX, pageY;
      if (isTouch) {
        if (e.touches && e.touches.length > 0) {
          pageX = e.touches[0].pageX;
          pageY = e.touches[0].pageY;
        }
      } else {
        pageX = e.pageX;
        pageY = e.pageY;
      }
      return {
        x: pageX,
        y: pageY
      };
    };
    var functions = {
      start: function (e) {
        if (!isDragging) {
          last = getPageXY(e);
          isDragging = true;
          each(onStart, function (func) {
            func.call(this, e);
          });
        }
      },
      move: function (e) {
        var pageXY;
        var x, y;
        if (isDragging) {
          pageXY = getPageXY(e);
          if (typeof pageXY.x !== 'undefined' && typeof pageXY.y !== 'undefined') {
            x = pageXY.x - last.x + (+element.getAttribute('cx'));
            y = pageXY.y - last.y + (+element.getAttribute('cy'));
            last = pageXY;
            each(onMove, function (func) {
              func.call(this, x, y, e);
            });
          }
        }
      },
      end: function (e) {
        var pageXY;
        var x, y;
        if (isDragging) {
          isDragging = false;
          pageXY = getPageXY(e);
          if (typeof pageXY.x !== 'undefined' && typeof pageXY.y !== 'undefined') {
            x = pageXY.x - last.x + (+element.getAttribute('cx'));
            y = pageXY.y - last.y + (+element.getAttribute('cy'));
            last = pageXY;
            each(onEnd, function (func) {
              func.call(this, x, y, e);
            });
          }
        }
      }
    };
    methods = {
      start: function (callback) {
        onStart.push(callback);
        return methods;
      },
      move: function (callback) {
        onMove.push(callback);
        return methods;
      },
      end: function (callback) {
        onEnd.push(callback);
        return methods;
      },
      bind: function () {
        bind(element, events.start, functions.start);
        bind(container, events.move, functions.move);
        bind(container, events.end, functions.end);
      }
    };
    return methods;
  };
  module.exports = drag;
});
