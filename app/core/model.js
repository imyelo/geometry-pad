define(function (require, exports, module) {
  var EventBase = require('library/EventBase/eventbase');

  var Component = function () {
    return this instanceof Component ? this : new Component();
  };
  _.extend(Component.prototype, EventBase.prototype, {
    initialize: function () {
      return this;
    },
    toJSON: function () {
      return _.clone((this._attributes = this._attributes || {}));
    },
    getAttribute: function (key) {
      this._attributes = this._attributes || {};
      if (arguments.length === 1) {
        return this._attributes[key];
      } else {
        throw new Error('unexpected arguments length');
      }
    },
    setAttribute: function (key, val, options) {
      var last;
      _.defaults((options = options || {}), {
        silence: false
      });
      this._attributes = this._attributes || {};
      if (arguments.length === 2 || arguments.length === 3) {
        last = this._attributes[key];
        this._attributes[key] = val;
        if (!options.silence) {
          this.emit('attribute', this, options);
          this.emit('attribute:' + key, val, last, options);
        }
        return this;
      } else {
        throw new Error('unexpected arguments length');
      }
    },
    getElement: function () {
      return this._element;
    },
    setElement: function (element) {
      this._element = element;
      return this;
    },
    // remove: function () {}
  });
  return Component;
});
