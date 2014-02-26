define(function (require, exports, module) {
  var EventBase = require('library/EventBase/eventbase');
  var Point = require('model/point');
  var drag = require('library/drag/drag');
  var reload = require('library/reload/reload');

  var Paper = function (svg) {
    return this instanceof Paper ? this.initialize(svg) : new Paper(svg);
  };
  _.extend(Paper.prototype, EventBase.prototype, {
    initialize: function (svg) {
      this._element = svg || document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      return this;
    },
    getElement: function () {
      return this._element;
    }
  }, {
    createPoint: function (x, y) {
      var point = new Point(x, y);
      var elem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      elem.classList.add('point');
      elem.setAttribute('r', 5);
      elem.setAttribute('fill', '#666');
      point.setElement(elem);
      this.getElement().appendChild(elem);
      elem.setAttribute('cx', x);
      elem.setAttribute('cy', y);
      point.bind('attribute:x', function (x) {
        elem.setAttribute('cx', x);
      });
      point.bind('attribute:y', function (y) {
        elem.setAttribute('cy', y);
      });
      point.bind('move', function (current, last) {
        var distance = Math.sqrt(Math.pow((last.x - current.x), 2) + Math.pow((last.y - current.y), 2));
        console.log('move point: from (' + last.x + ', ' + last.y + ') to (' + current.x + ', ' + last.y + ')');
        console.log('distance: ' + distance);
      });
      drag(elem).move(function (x, y, e) {
        // just preview the effect before drag action finished
        point.preview(x, y);
      }).end(function (x, y, e) {
        // refresh isnot required here
        point.refresh();
        point.move(x, y);
      }).bind();
      return point;
    }
  });

  return Paper;
});
