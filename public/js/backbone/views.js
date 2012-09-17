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
       likes[App.currentUser] = true;
       this.model.set("likes", likes);
       console.log("In likes");

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
       this.model.set("comments_count", comments_count);
       this.model.save();
       return this;
   }


 });

var ActivityStreamView = Backbone.View.extend({
    el: '#main_stream', // el attaches to existing element

    initialize: function(){
        _.bindAll(this, 'render', 'prependItem', 'changeStreamFilter');
        this.collection = new ActivityList();
        var data = App.streams[App.desiredStream];
        if (data && data.items) {
            this.collection.reset(data.items.reverse());
            this.render();
        }
        this.collection.bind('unshift', this.prependItem); // collection event binder
        this.maxSize = 50;
    },
    render: function(){
        this.$el.empty();
        _(this.collection.models).each(function(item){ // in case collection is not empty
            this.prependItem(item);
        }, this);
    },
    prependItem: function(item){
      var itemView = new ActivityView({ model: item });

      this.$el.prepend(itemView.render().el);

      if (this.el.children.count > this.maxSize) {
          this.el.children.last.remove();
      }
    },
    changeStreamFilter : function(name, val, show){
        var className = "." + name + "-" + val;
        var name = name + 's';
        var isPresent = _.include(this.collection.included[name], val);
        if (show) {
            this.$el.find(className).show();
            if (!isPresent)
                this.collection.included[name].push(val);
        }
        else {
            this.$el.find(className).hide();
            if (isPresent) {
                this.collection.included[name] = [];
                for(var i=0; i< this.collection.included[name].length; i++) {
                    var item =  this.collection.included[name][i];
                    if (item !== val) {
                        this.collection.included[name].push(item);
                    }
                }
            }
        }

        var _this = this;
        this.collection.fetch({success: function(){
            _this.render();
        }});
    }
});


var ActivityFilterView = Backbone.View.extend({
    el: '#form_filters',
    initialize: function(){
        _.bindAll(this, 'render', 'filterClick');
    },
    events: {
        "click .filter-checkbox" : "filterClick"
    },
    render:  function(){
    },
    filterClick : function(event){
        console.log("filter click");
        console.dir(event.target);
        this.streamView.changeStreamFilter(event.target.name, event.target.value, event.target.checked);
    }
});




