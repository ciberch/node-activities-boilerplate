var Activity = Backbone.Model.extend({});
var ActivityList = Backbone.Collection.extend({
	model: Activity,
    url : "/activities"
});

var ActivityObject = Backbone.Model.extend({});

var ActivityObjectType = Backbone.Model.extend({});
var ActivityObjectList = Backbone.Collection.extend({
	model : ActivityObjectType,
	url : "/objectTypes"
});

var ActivityVerb = Backbone.Model.extend({});
var ActivityVerbList = Backbone.Collection.extend({
	model : ActivityVerb,
	url : "/verbs"
});