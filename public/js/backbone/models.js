var Activity = Backbone.Model.extend({
    url : "/activities",
    idAttribute: "_id",
    // From activity-streams-mongoose/lib/activityMongoose.js
    defaults: {
        verb: 'post',
        object: null, //ActivityObject
        actor: null, //ActivityObject
        url: '',
        title: '',
        content: '',
        icon: null, // MediaLinkHash
        target: null, //ActivityObject
        published: Date.now,
        updated: Date.now,
        inReplyTo: null, //Activity
        provider: null, //ActivityObject
        generator: null, //ActivityObject
        userFriendlyDate: 'No idea when'
    },
    validate: function(attrs) {

    if (! attrs.object) {
        return "Object is missing"
    }
    if (!attrs.object.title) {
      return "Title is missing";
    }
  }
});
var ActivityList = Backbone.Collection.extend({
	model: Activity,
    urlRoot : "/streams",
    initialize : function() {
        this.name = App.desiredStream;
        this.orphans = {};
        this.included =  App.included;
        this.filters = App.filters;
        this.names = ['verb', 'objectType', 'actorObjectType'];
    },
    url : function(){
        var query = '';
        for (var i=0; i < this.names.length; i++){
            var itemName = this.names[i];
            var arr = this.included[itemName + 's'];
            for (var j=0; j < arr.length; j++) {
                query += "&" + itemName + "=" + arr[j];
            }
        }
        return this.urlRoot + "/" + this.name +"?json=1" + query;
    },
    parse: function(response){
        this.name = response.desiredStream;
        this.included = response.included;
        this.filters = response.filters;
        var data = response.streams[response.desiredStream].items;
        return data;
    },
    insertChild: function(item, elem){
        if (item.get("verb") === "like") {
          var likes = elem.get("likes");
          if (!likes)
              likes = {};

          var actor = item.get("actor")._id;
          likes[actor] = true;
          elem.set("likes", likes);
          var likes_count = _.keys(likes).length;
          elem.set("likes_count", likes_count);
        } else if(item.get("object").objectType === "comment"){
            var c = elem.get("comments");
            if (!c){
                c = [];
            }
            var data = item.toJSON();
            var date = Date.parse(item.get('published'));
            data.userFriendlyDate = App.helper.fuzzy(date);
            data.inReplyTo = null;
            c.push(data);
            var comments_count = c.length;
            elem.set("comments", c);
            elem.set("comments_count", comments_count);
        }
    },
    reset: function(data){
        this.remove(this.models, {silent: true}); // since we overwrote reset
        this.orphans = {};
        var collection = this;
        _.each(data, function(hash){
            var model = new Activity(hash);
            collection.addOrInsertChild(model);
        });

    },
    addOrInsertChild: function(item) {
        var replyId = item.get('inReplyTo');
        if (replyId){
            var elem =  this.get(replyId);
            if (elem) {
                this.insertChild(item, elem);
            } else {
                if (!this.orphans[replyId])
                    this.orphans[replyId] = [];
                this.orphans[replyId].push(item);
            }
        }  else {
            this.add(item);
            var id = item.get("_id");
            var collection = this;
            if (this.orphans[id]) {
                var items = this.orphans[id];
                _.each(items, function(child) {
                    collection.insertChild(child, item);
                });
                this.orphans[id] = [];
            }
        }
    }
});

var ActivityObject = Backbone.Model.extend({
    defaults : {
        image: null, // MediaLinkHash
        icon: null, // MediaLinkHash
        displayName: '',
        summary: '',
        content: '',
        url: '',
        author: null, //ActivityObject
        published: Date.now,
        objectType: '',
        updated: Date.now
    }

});

var ActivityObjectType = Backbone.Model.extend({});

var ActivityObjectTypeList = Backbone.Collection.extend({
	model : ActivityObjectType,
	url : "/objectTypes"
});

var ActivityVerb = Backbone.Model.extend({});
var ActivityVerbList = Backbone.Collection.extend({
	model : ActivityVerb,
	url : "/verbs"
});

var User = Backbone.Model.extend({
    defaults : {
        signedIn : false,
        displayName : 'User'
    }
});