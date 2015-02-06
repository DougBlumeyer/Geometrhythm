Geometrhythm.Views.Info = Backbone.View.extend({
  templateShowYours: JST['info/show_yours'],
  templateShowAnothers: JST['info/show_anothers'],
  templateShowLoggedOut: JST['info/show_logged_out'],
  templateClaim: JST['info/claim'],
  templateSignUpToClaim: JST['info/sign_up_to_claim'],
  templateSplash: JST['info/splash'],

  initialize: function(options) {
    this.listenTo(this.model, 'sync change:likers', this.render); //change:play_count
    this.template = this[options.template]; //this[options.template] || this.template;
  },

  events: {
    'click #sign-up-to-claim-rhythm' : 'signUpToClaimRhythm',
    'click #claim-rhythm' : 'claimRhythm',
    'submit form.suggest-name' : 'suggestName',
    'submit form.add-comment' : 'addComment',
    'submit form.add-meta-comment' : 'addMetaComment',
    'click button.view-creations' : 'viewCreations',
    'click button.view-likes' : 'viewLikes',
    'click span.name_deets_link' : 'expandNames',
    'click span.name_deets_collapse' : 'collapseNames',
  },

  render: function(options) {
    // debugger

    var earliestNameId = null;
    var primaryName = null;
    this.model.get("namings") && this.model.get("namings").forEach(function(naming) {
      // debugger
      if (earliestNameId == undefined || naming.name.id <= earliestNameId) {
        console.log("went in here");
        earliestNameId = naming.name.id;
        primaryName = naming.name.name;
      }
    });
     debugger
    var content = this.template({
      rhythm: this.model,
      primaryName: primaryName,
      nameDeets: this.nameDeets
    });
    this.$el.html(content);
    return this;
  },

  signUpToClaimRhythm: function() {
    window.location.href = '/users/new'
  },

  claimRhythm: function() {
    var rhythmToClaim = new Geometrhythm.Models.Rhythm();

    var dbRhythm = Geometrhythm.Collections.rhythms.find( function(rhythm){
        return rhythm.get("rhythm_str") === $('#current-rhythm').val();
      }
    );
    if (dbRhythm) {
      $('#cur-rhythm-id').val(dbRhythm.id)
    } else {
      $('#cur-rhythm-id').val("")
    }

    rhythmToClaim.set({
      creator_id: $('#cur-user-id').val(),
      rhythm_str: $('#current-rhythm').val()
    });
    rhythmToClaim.save({}, {
      success: function() {
        Geometrhythm.Collections.rhythms.add(rhythmToClaim);
        Geometrhythm.Collections.rhythms.fetch();
      }
    });
  },

  suggestName: function(event) {
    event.preventDefault();
    var attrs = $(event.currentTarget).serializeJSON();
    var dbName = Geometrhythm.Collections.names.find( function(name){
        return name.get("name") === attrs["name"].name;
      }
    );
    if (!dbName) {
      var dbName = new Geometrhythm.Models.Name(attrs);
      var that = this;
      dbName.save({}, {
        success: function() {
          that.saveNaming(dbName);
        }
      });
    } else {
      this.saveNaming(dbName);
    }
  },

  saveNaming: function(dbName) {
    var naming = new Geometrhythm.Models.Naming({
      rhythm_id: $('#cur-rhythm-id').val(),
      namer_id: $('#cur-user-id').val(),
      name_id: dbName.id
    });
    var that = this;
    naming.save({}, {
      success: function() {
        that.model.fetch();
      }
    });
  },

  addComment: function(event) {
    event.preventDefault();
    var attrs = $(event.currentTarget).serializeJSON();
    var comment = new Geometrhythm.Models.Comment({
      commentable_id: $('#cur-rhythm-id').val(),
      commentable_type: 'Rhythm',
      user_id: $('#cur-user-id').val(),
      body: $(event.currentTarget).serializeJSON()["comment"].body
    });
    var that = this;
    comment.save({}, {
      success: function() {
        that.model.fetch();
      }
    });
  },

  addMetaComment: function(event) {
    event.preventDefault();
    var attrs = $(event.currentTarget).serializeJSON();
    var comment = new Geometrhythm.Models.Comment({
      commentable_id: $(event.currentTarget).serializeJSON()["comment"].comment_id,
      commentable_type: 'Comment',
      user_id: $('#cur-user-id').val(),
      body: $(event.currentTarget).serializeJSON()["comment"].body
    });
    var that = this;
    comment.save({}, {
      success: function() {
        that.model.fetch();
      }
    });
  },

  viewCreations: function(event) {
    Backbone.history.navigate("/creations/" + $(event.currentTarget).val(),
      {trigger: true});
  },

  viewLikes: function(event) {
    Backbone.history.navigate("/likes/" + $(event.currentTarget).val(),
      {trigger: true});
  },

  expandNames: function() {
    this.nameDeets = true;
    this.render();
  },

  collapseNames: function() {
    this.nameDeets = false;
    this.render();
  }

});
