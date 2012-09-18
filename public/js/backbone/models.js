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
        streams: ['firehose'],
        likes: {},
        likes_count: 0,
        comments: [],
        comments_count: 0,
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
        console.log("Query is " + query);
        return this.urlRoot + "/" + this.name +"?json=1" + query;
    },
    parse: function(response){
        this.name = response.desiredStream;
        this.included = response.included;
        this.filters = response.filters;
        var data = response.streams[response.desiredStream].items;
        return data;
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
        attachments: [], //ActivityObject
        upstreamDuplicates: [], //string
        downstreamDuplicates: [], //string
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