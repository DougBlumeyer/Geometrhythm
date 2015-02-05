Geometrhythm.Views.RhythmsList = Backbone.CompositeView.extend({

  template: JST['rhythms/list'],

  events: {
    "click li.rhythm" : "selectRhythm",
    "change .creator" : "filterByCreator",
    "change .liker" : "filterByLiker",
    "change .rhythm-str" : "filterByRhythmStr",
    "change .rhythm-id" : "filterByRhythmId"
  },

  initialize: function(options) {
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'add', this.addRhythmListItemView);
    this.listenTo(this.collection, 'remove', this.removeRhythmListItemView)

    this.users = options.users;

    // if (options.creator) {
      this.creatorId = options.creator;
    //   this.filterByCreator();
    // } else if (options.liker) {
      this.likerId = options.liker;
    //   this.filterByLiker();
    // } else {
    //
    // }

    this.collection.each(function(rhythm) {
      this.addRhythmListItemView(rhythm);
    }.bind(this))

    console.log("hey this might have stuff in it when we start");
    console.log(this.collection.filter);

  },

  render: function() {
    var content = this.template({
      rhythms: this.collection,
      users: this.users,
      cur_rhythm: this.model,
      liker: this.likerId,
      creator: this.creatorId,
      rhythm_str: this.rhythmStr
    })
    this.$el.html(content);
    this.attachSubviews();
    return this;
  },

  addRhythmListItemView: function(rhythm) {
    var rhythmListItemView = new Geometrhythm.Views.RhythmListItemView({
      model: rhythm
    });
    this.addSubview('ol.subview-version', rhythmListItemView);
  },

  removeRhythmListItemView: function(rhythm) {
    var subviews = this.subviews('ol.subview-version');
    var subviewToRemove = _(subviews).find( function(sv){
      return sv.model.id == rhythm.id;
    });
    this.removeSubview('ol.subview-version', subviewToRemove);
  },

  filterByCreator: function(event) {

    // if (event) {
    //   var creator_id = $(event.currentTarget).val();
    // } else {
    //   var creator_id = this.creatorId;
    // }
    //
    // if (creator_id === "") {
    //   this.creatorId = null;
    //   this.collection.filter.creator_id = null;
    //   this.collection.fetch();
    // } else {
    //   this.creatorId = creator_id;
    //   this.collection.filter.creator_id = this.creatorId;
    //   this.collection.fetchByFilter();
    //   // debugger
    // }

    this.creatorId = $(event.currentTarget).val();
    if (this.creatorId === "") {
      this.creatorId = null;
      delete this.collection.filter.creator_id;
      //this.collection.fetch();
    } else {
      this.collection.filter.creator_id = this.creatorId;
      console.log(this.collection.filter);

    }
    this.collection.fetchByFilter();
    // this.collection.fetch({ data: { creator_id: this.creatorId } });
  },

  filterByLiker: function(event) {

    this.likerId = $(event.currentTarget).val()
    if (this.likerId === "") {
      this.likerId = null;
      delete this.collection.filter.liker_id;
      //this.collection.fetch();
    } else {
      this.collection.filter.liker_id = this.likerId;
      console.log(this.collection.filter);

    }
    this.collection.fetchByFilter();
  },

  filterByRhythmStr: function(event) {

    this.rhythmStr = $(event.currentTarget).val()
    if (this.rhythmStr === "") {
      this.rhythmStr = null;
      delete this.collection.filter.rhythm_str;
      //this.collection.fetch();
    } else {
      this.collection.filter.rhythm_str = this.rhythmStr;
      console.log(this.collection.filter);

    }
    // debugger
    this.collection.fetchByFilter();
  },

  // filterByRhythmId: function(event) {
  //
  //   this.filterId = $(event.currentTarget).val()
  //   this.collection.filter.id = this.filterId;
  //   console.log(this.collection.filter);
  //   this.collection.fetchByFilter();
  //   // debugger
  // },

  selectRhythm: function(event){
    event.preventDefault();
    var id = $(event.currentTarget).data('id');
    var selectedRhythm = this.collection.getOrFetch(id);
    this.model.set(selectedRhythm.attributes);
    $.cookie('_Geometrhythm_stored_rhythm', $(event.currentTarget).attr('rhythm-str'), { expires: 7, path: '/' });
    Backbone.history.navigate('/', {trigger: true})
  },

});
