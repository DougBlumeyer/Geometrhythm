// Like most of my analysis-related files, this was rushed and
// does not reflect my best coding practices. I will clean it up soon.

// For a better impression of the good coding style I'm capable of,
// please look at the javascripts/rhythm_ring folder. That was written under
// significantly less duress, and demonstrates modularity and expressiveness.

Geometrhythm.Views.AnalysisInterval = Backbone.View.extend({

  template: JST['analysis/interval'],

  events: {
    'mouseover .FIC_sq' : 'displayIntervals',
    'mouseout .FIC_sq' : 'hideIntervals'
  },

  initialize: function() {
    this.canvas = $('body').find('#polygon-analysis-canvas')
    this.ctx = this.canvas[0].getContext("2d");
    this.ctx.strokeStyle="#ff9800";
    this.ctx.lineWidth = 3;
    this.ctx.shadowBlur=20;
    this.ctx.shadowColor="#ff9800";
  },

  render: function() {
    this.ctx.strokeStyle="#ff9800";
    this.ctx.lineWidth=3;
    this.ctx.shadowBlur=20;
    this.ctx.shadowColor="#ff9800";

    if (this.model) {
      var len = this.model.get("full_interval_content").length;
      var max_height = this.model.get("tallness");
      var widthPercentageUnit = 85 / len;
      var heightPixelsUnit = ((window.innerWidth / 4.25) * 0.85) / len;
      if (heightPixelsUnit * max_height > 120) {
        widthPercentageUnit = widthPercentageUnit *
          (120 / (heightPixelsUnit * max_height));
        heightPixelsUnit = 120 / max_height;
      }
      var content = this.template({
        rhythm: this.model,
        widthPercentageUnit: widthPercentageUnit,
        heightPixelsUnit: heightPixelsUnit,
        len: len,
        max_height: max_height
      });
      this.$el.html(content);
    } else {
      this.$el.html("");
    }
    return this;
  },

  displayIntervals: function(event) {
    this.ctx.strokeStyle="#ff9800";
    this.ctx.lineWidth=3;
    this.ctx.shadowBlur=20;
    this.ctx.shadowColor="#ff9800";

    //$(this.canvas).css('display','inline');
    var ord = $(event.currentTarget).attr('ord');
    var linesToDraw = this.model.get("full_intervals_onset_pairs")[ord];
    $('body').find(".FIC_sq[ord='" + ord + "']").addClass('columnHovered');
    this.ctx.clearRect(0,0,400,400);
    var that = this;
    linesToDraw.forEach( function(lineToDraw) {
      var posParse1 = $('body').find(".cell[ord='" + lineToDraw[0] + "']")
        .position();
      var pos1 = [posParse1.left, posParse1.top];
      var posParse2 = $('body').find(".cell[ord='" + lineToDraw[1] + "']")
        .position();
      var pos2 = [posParse2.left, posParse2.top];
      that.ctx.beginPath();
      that.ctx.moveTo(pos1[0] + 13, pos1[1] + 13);
      that.ctx.lineTo(pos2[0] + 13, pos2[1] + 13);
      that.ctx.stroke();
    })
  },

  hideIntervals: function() {
    $('body').find(".FIC_sq").removeClass('columnHovered');
    this.ctx.clearRect(0,0,400,400);
    //$(this.canvas).css('display','none');
  }
})
