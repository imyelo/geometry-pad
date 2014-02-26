define(function (require, exports, module) {
  var Model = require('core/model');
  var Point = function (x, y) {
    return this instanceof Point ? this.initialize(x, y) : new Point(x, y);
  };
  _.extend(Point.prototype, Model.prototype, {
    initialize: function (x, y) {
      this.move(x, y, {silence: true});
      return this;
    },
    preview: function (x, y, options) {
      _.defaults((options = options || {}), {
        silence: false
      });
      this.getElement().setAttribute('cx', x);
      this.getElement().setAttribute('cy', y);
      if (!options.silence) {
        this.emit('preview', {x: x, y: y}, this.toJSON());
      }
    },
    refresh: function (options) {
      _.defaults((options = options || {}), {
        silence: false
      });
      this.move(this.getAttribute('x'), this.getAttribute('y'), {silence: true});
      if (!options.silence) {
        this.emit('refresh', this.toJSON());
      }
    },
    move: function (x, y, options) {
      var last;
      _.defaults((options = options || {}), {
        silence: false
      });
      last = this.toJSON();
      if (last.x === x && last.y === y) {
        return this;
      }
      this.setAttribute('x', x, options);
      this.setAttribute('y', y, options);
      if (!options.silence) {
        this.emit('move', this.toJSON(), last);
      }
      return this;
    },
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
  window.Point = Point;
  return Point;

});
