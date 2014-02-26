define(function (require, exports, module) {
  var Point = require('component/point');
  var Segment = require('component/segment');

  var Stage = function (svg) {
    this.root = svg;
    return this;
  };
  Stage.prototype.linkPoint = function (point) {
    var elem = this.append('p').attr('x', point.getAttribute(x)).attr('y', point.getAttribute(y));
    point.link(elem);
    return elem;
  };


  var stage = new Stage();


  var exports = {};

  exports.createPoint = function (x, y) {
    var point = new Point();
    point.initialize(x, y);
    var elem = Stage.linkPoint(point);
    point.bind('move', function () {
      elem.attr('x', point.getAttribute(x)).attr('y', point.getAttribute(y));
    });
    point.bind('remove', function () {
      elem.remove();
    });

  };




  var createSegmentBetweenTwoPoint = function (pointA, pointB) {
    var segment = new Segment();
    var remove;
    segment.initialize(pointA, pointB);
    segment.bind('move', function (current, last) {
      pointA.move(current.x1, current.y1, {silence: true});
      pointB.move(current.x2, current.y2, {silence: true});
    });
    pointA.once('remove', function () {
      segment.remove();
    });
    pointB.once('remove', function () {
      segment.remove();
    });
    return segment;
  };

  window.c = createSegmentBetweenTwoPoint;
});
