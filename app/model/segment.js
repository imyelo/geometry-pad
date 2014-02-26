define(function (require, exports, module) {
  var Model = require('core/model');
  var reload = require('library/reload/reload');
  var Segment = function (pointA, pointB) {
    return this instanceof Segment ? this.initialize(pointA, pointB) : new Segment(pointA, pointB);
  };
  _.extend(Segment.prototype, Model.prototype, {
    initialize: function (pointA, pointB) {
      var that = this;
      var onMove = function (current, before) {
        pointA.move(current.x1, current.y1);
        pointB.move(current.x2, current.y2);
      };
      var onPointAMove = function (current) {
        that.move(current.x, current.y, that.getAttribute('x2'), that.getAttribute('y2'));
      };
      var onPointBMove = function (current) {
        that.move(that.getAttribute('x1'), that.getAttribute('y1'), current.x, current.y);
      };
      var onPointAPreview = function (preview) {
        that.preview(preview.x, preview.y, that.getAttribute('x2'), that.getAttribute('y2'));
      };
      var onPointBPreview = function (preview) {
        that.preview(that.getAttribute('x1'), that.getAttribute('y1'), preview.x, preview.y);
      };
      var onRemove = function () {
        pointA.unbind('move', onPointAMove);
        pointA.unbind('preview', onPointAPreview);
        pointA.unbind('remove', onPointRemove);
        pointB.unbind('move', onPointBMove);
        pointB.unbind('preview', onPointBPreview);
        pointB.unbind('remove', onPointRemove);
      };
      var onPointRemove = function () {
        that.remove();
      };
      that.bind('move', onMove);
      pointA.bind('move', onPointAMove);
      pointB.bind('move', onPointBMove);
      pointA.bind('preview', onPointAPreview);
      pointB.bind('preview', onPointBPreview);
      that.bind('remove', onRemove);
      pointA.bind('remove', onPointRemove);
      pointB.bind('remove', onPointRemove);
      that.move(pointA, pointB, {silence: true});
      return this;
    },
    preview: function (x1, y1, x2, y2, options) {
      _.defaults((options = options || {}), {
        silence: false
      });
      this.getElement().setAttribute('x1', x1);
      this.getElement().setAttribute('y1', y1);
      this.getElement().setAttribute('x2', x2);
      this.getElement().setAttribute('y2', y2);
      if (!options.silence) {
        this.emit('preview', {x1: x1, y1: y1, x2: x2, y2: y2}, this.toJSON());
      }
    },
    refresh: function (options) {
      _.defaults((options = options || {}), {
        silence: false
      });
      this.move(this.getAttribute('x1'), this.getAttribute('y1'), this.getAttribute('x2'), this.getAttribute('y2'), {silence: true});
      if (!options.silence) {
        this.emit('refresh', this.toJSON());
      }
    },
    move: reload(function (pointA, pointB) {
        return this.move(pointA, pointB, {});
      }, function (pointA, pointB, options) {
        var x1 = pointA.getAttribute('x'), y1 = pointA.getAttribute('y'),
            x2 = pointB.getAttribute('x'), y2 = pointB.getAttribute('y');
        return this.move(x1, y1, x2, y2, options);
      }, function (x1, y1, x2, y2) {
        return this.move(x1, y1, x2, y2, {});
      }, function (x1, y1, x2, y2, options) {
        var last;
        _.defaults((options = options || {}), {
          silence: false
        });
        last = this.toJSON();
        if (last.x1 === x1 && last.y1 === y1 && last.x2 === x2 && last.y2 === y2) {
          return this;
        }
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
      this.getElement().remove();
      if (!options.silence) {
        this.emit('remove', this);
      }
    }
  });
  return Segment;
});

