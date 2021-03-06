POLYGON_OFFSET = 13;
ANIMATION_RATE = 20;
CANVAS_DIMENSION = 400;

$.RhythmRing.prototype.endAnimation = function() {
  if (this.animating) {
    this.refreshHandlesAndLabels();
    this.animating = false;
    if (this.markedForCollapseAt) {
      this.actionAt("delete", this.yankedId);
      this.markedForCollapseAt = null;
    }
  }
};

$.RhythmRing.prototype.animatePolygon = function() {
  if (!this.animating) return;
  setTimeout(function() {
    this.refreshPolygon();
    this.animatePolygon();
  }.bind(this), ANIMATION_RATE);
};

$.RhythmRing.prototype.refreshPolygon = function() {
  var prevPos = null;
  var firstPos = null;
  this.ctx.clearRect(0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION);
  for (var i = 0; i <= this.rhythmCells.length * 2; i++ ) {
    j = i % this.rhythmCells.length;
    if (i > this.rhythmCells.length && j > firstPos) break;
    var curPosition = $(".cell[ord='" + j + "']").position();
    if (!curPosition) { curPosition = $(".cell-handle.grabbed").position(); }
    var curPos = [curPosition.left, curPosition.top];
    if (this.rhythmCells[j]) {
      if (prevPos) this.drawSide(curPos, prevPos);
      if (!firstPos) firstPos = j;
      prevPos = curPos.slice();
    }
  }
};

$.RhythmRing.prototype.drawSide = function(curPos, prevPos) {
  this.ctx.beginPath();
  this.ctx.moveTo(prevPos[0] + POLYGON_OFFSET, prevPos[1] + POLYGON_OFFSET);
  this.ctx.lineTo(curPos[0] + POLYGON_OFFSET, curPos[1] + POLYGON_OFFSET);
  this.ctx.lineWidth = 2;
  this.ctx.stroke();
};
