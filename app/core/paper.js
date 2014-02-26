define(function (require, exports, module) {
  var EventBase = require('library/EventBase/eventbase');
  var Point = require('model/point');
  var Segment = require('model/segment');
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
      point.setElement(elem);
      this.getElement().appendChild(elem);
      elem.setAttribute('r', 5);
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
        point.preview(x + (+elem.getAttribute('cx')), y + (+elem.getAttribute('cy')));
      }).end(function (x, y, e) {
        // refresh isnot required here
        point.refresh();
        point.move(x + (+elem.getAttribute('cx')), y + (+elem.getAttribute('cy')));
      }).bind();
      return point;
    },
    createSegment: function (pointA, pointB) {
      var segment = new Segment(pointA, pointB);
      var elem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      elem.classList.add('segment');
      elem.setAttribute('fill', '#999');
      segment.setElement(elem);
      this.getElement().appendChild(elem);
      elem.setAttribute('x1', pointA.getAttribute('x'));
      elem.setAttribute('y1', pointA.getAttribute('y'));
      elem.setAttribute('x2', pointB.getAttribute('x'));
      elem.setAttribute('y2', pointB.getAttribute('y'));
      segment.bind('attribute:x1', function (x1) {
        elem.setAttribute('x1', x1);
      });
      segment.bind('attribute:y1', function (y1) {
        elem.setAttribute('y1', y1);
      });
      segment.bind('attribute:x2', function (x2) {
        elem.setAttribute('x2', x2);
      });
      segment.bind('attribute:y2', function (y2) {
        elem.setAttribute('y2', y2);
      });
      segment.bind('move', function (current, last) {
        var length =  Math.sqrt(Math.pow((current.x2 - current.x1), 2) + Math.pow((current.y2 - current.y1), 2));
        console.log('move segment: from (' + last.x1 + ', ' + last.y1 + ', ' + last.x2 + ', ' + last.y2 + 
          ') to (' + current.x1 + ', ' + current.y1 + ', ' + current.x2 + ', ' + current.y2 + '), ' + 
          'length: ' + length
        );
      });
      drag(elem).move(function (x, y, e) {
        // just preview the effect before drag action finished
        var x1, y1, x2, y2;
        x1 = x + (+elem.getAttribute('x1'));
        y1 = y + (+elem.getAttribute('y1'));
        x2 = x + (+elem.getAttribute('x2'));
        y2 = y + (+elem.getAttribute('y2'));
        segment.preview(x1, y1, x2, y2);
      }).end(function (x, y, e) {
        // refresh isnot required here
        var x1, y1, x2, y2;
        x1 = x + (+elem.getAttribute('x1'));
        y1 = y + (+elem.getAttribute('y1'));
        x2 = x + (+elem.getAttribute('x2'));
        y2 = y + (+elem.getAttribute('y2'));
        segment.refresh();
        segment.move(x1, y1, x2, y2);
      }).bind();
      return segment;
    }
  });

  return Paper;
});
