define(function (require, exports, module) {
  var Model = require('core/model');
  var Ray = function () {
    return this instanceof Ray ? this : new Ray();
  };
  _.extend(Ray.prototype, Model.prototype, {
    initialize: function (point, angle) {
      this.move(point, angle);
      return this;
    },
    move: function (point, angle, options) {
      var last;
      _.defaults((options = options || {}), {
        silence: false
      });
      last = {point: this.getAttribute('point'), angle: this.getAttribute('angle')};
      this.setAttribute('point', point, options);
      this.setAttribute('angle', angle, options);
      if (!options.silence) {
        this.emit('move', {point: point, angle: angle}, last);
      }
      return this;
    },
    remove: function (options) {
      _.defaults((options = options || {}), {
        silence: false
      });
      if (!options.silence) {
        this.emit('remove', this);
      }
    }
  });
  return Ray;
});
