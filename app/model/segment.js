define(function (require, exports, module) {
  var Model = require('core/model');
  var reload = require('library/reload/reload');
  var Segment = function () {
    return this instanceof Segment ? this : new Segment();
  };
  _.extend(Segment.prototype, Model.prototype, {
    initialize: function (pointA, pointB) {
      var that = this;
      that.bind('move', function (current, before) {
        pointA.move(current.x1, current.y1, {silence: true});
        pointB.move(current.x1, current.y1, {silence: true});
      });
      this.move(pointA, pointB, {silence: true});
      return this;
    },
    move: reload(function (pointA, pointB) {
        return this.move(optionA, optionB, {});
      }, function (pointA, pointB, options) {
        var x1 = optionA.getAttribute('x'), y1 = optionA.getAttribute('y'),
            x2 = optionB.getAttribute('x'), y2 = optionB.getAttribute('y');
        return this.move(x1, y1, x2, y2, options);
      }, function (x1, y1, x2, y2) {
        return this.move(x1, y1, x2, y2, {});
      }, function (x1, y1, x2, y2, options) {
        var last;
        _.defaults((options = options || {}), {
          silence: false
        });
        last = this.toJSON();
        this.setAttribute('x1', x1, options);
        this.setAttribute('y1', y1, options);
        this.setAttribute('x2', x2, options);
        this.setAttribute('y2', y2, options);
        if (!options.silence) {
          this.emit('move', this.toJSON(), last);
        }
        return this;
      }),
    remove: function (options) {
      _.defaults((options = options || {}), {
        silence: false
      });
      if (!options.silence) {
        this.emit('remove', this);
      }
    }
  });
  return Segment;
});

