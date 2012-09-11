var ActivityView = Backbone.View.extend({
   initialize: function(){
     _.bindAll(this, 'render', 'like', 'comment'); // every function that uses 'this' as the current object should be in here
     this.model.bind('change', this.render, this);
//     this.model.on('change:likes_count', 'render');
//     this.model.on('change:comments_count', 'render');
   },
    events: {
        "click .like-button" : "like",
        "click .comment-button" : "comment"
    },
   render: function(){
     var actData = this.model.toJSON();
     var date = Date.parse(this.model.get('published'));
     var awesomeDate = App.helper.fuzzy(date);
       actData['userFriendlyDate'] = awesomeDate;
     this.$el.html(jade.templates["activity"]({activities: [actData]}));
     return this; // for chainable calls, like .render().el
   },
   like : function() {
       var likes = this.model.get("likes");
       if (!likes) {
           likes = {};
       }
       likes[this.user] = true;
       this.model.set("likes", likes);

       var likes_count = _.keys(likes).length;
       this.model.set("likes_count", likes_count)
       this.model.save();
       return this;
   },
   comment: function() {
       var content = this.$el.find(".comment-area").val();
       var comments = this.model.get("comments");
       if (!comments){
           comments = [];
       }
       comments.push({actor : App.currentUser, object: { objectType : 'comment', content: content}, published : Date.new});
       var comments_count = comments.length;
       this.model.set("comments_count", comments_count)
       this.model.save();
       return this;
   }


 });

var ActivityStreamView = Backbone.View.extend({
    el: '#main_stream', // el attaches to existing element

    initialize: function(){
        _.bindAll(this, 'render', 'appendItem'); // every function that uses 'this' as the current object should be in here
        this.collection = new ActivityList();
        this.collection.bind('add', this.appendItem); // collection event binder
        this.maxSize = 20;
    },
    render: function(){
        _(this.collection.models).each(function(item){ // in case collection is not empty
            self.appendItem(item);
        }, this);
    },

    appendItem: function(item){
      var itemView = new ActivityView({ model: item });

      this.$el.prepend(itemView.render().el);

      if (this.el.children.count > this.maxSize) {
          this.el.children.last.remove();
      }
    }
});




