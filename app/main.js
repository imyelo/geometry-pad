define(function (require, exports, module) {
  var Paper = require('core/paper');
  var paper = new Paper();
  document.querySelector('main').appendChild(paper.getElement());
  window.paper = paper;
  var m = window.m = paper.createPoint(5, 5);
  var n = window.n = paper.createPoint(30, 30);
  window.segment = paper.createSegment(m, n);
});