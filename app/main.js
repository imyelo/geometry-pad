define(function (require, exports, module) {
  var Paper = require('core/paper');
  var paper = new Paper();
  document.querySelector('main').appendChild(paper.getElement());
  window.paper = paper;
  window.point = paper.createPoint(3, 5);
});