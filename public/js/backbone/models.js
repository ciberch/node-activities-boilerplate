var Activity = Backbone.Model.extend({
    url : "/activities",
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
    url : "/activities"
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