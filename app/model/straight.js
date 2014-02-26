define(function (require, exports, module) {
  var Model = require('core/model');
  var Straight = function () {
    return this instanceof Straight ? this : new Straight();
  };
  _.extend(Straight.prototype, Model.prototype, {
    initialize: function (x, slope) {
      this.move(x, slope);
      return this;
    },
    move: function (x, slope, options) {
      var last;
      _.defaults((options = options || {}), {
        silence: false
      });
      last = {x: this.getAttribute('x'), slope: this.getAttribute('slope')};
      this.setAttribute('x', x, options);
      this.setAttribute('slope', slope, options);
      if (!options.silence) {
        this.emit('move', {x: x, slope: slope}, last);
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
  return Straight;
});
