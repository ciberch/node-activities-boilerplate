// The DashboardRouter acts as the controller in this MVC setup
// It is responsible for listening to the events from each view, and then dispatching them back to all the other views
// It also handles the responsibility of the routing, so using Backbone's internal routing mechanisms, it
// listens to routes and handles setting up the views appropriately.
var DashboardRouter = Backbone.Router.extend({

	// set up the router with all the views on our page, and then listen to all the events that
	// can get triggered
	initialize : function(options) {
		var _this = this;

        this.activityEditView = options.activityEditView,
		this.filterView = options.filterView;
        this.streamView = options.streamView;
        this.activityView = options.activityView;

		this.filterView.on("change_verb change_actor change_object", function(text) {
			Backbone.history.navigate(_this.streamView.stream + "/" +  _this.filterView.verb + "/" + _this.filterView.objectType + "/" + _this.filterView.actorType, {trigger: true});
		});

		this.streamView.on("change_stream", function(text) {
			Backbone.history.navigate(_this.streamView.stream + "/" + _this.filterView.verb + "/" + _this.filterView.objectType + "/" + _this.filterView.actorType , {trigger: true});
		});
	},

	// set up all the routes in this object
	// make sure to handle every possible scenario, since we want to handle every possibility a user can type in
	routes : {
		"" : "all",
		":stream/" : "show",
		":stream/:verb" : "show",
		":stream/:verb/:objectType" : "show",
		":stream/:verb/:objectType/:actorType" : "show"
	},

	// handle the index case specially, and reroute it to the dashboard
	all : function() {
		Backbone.history.navigate("firehose/", {trigger: true});
	},

	// this function is called by Backbone when any route is matched from our routes object
	// it defaults the parameters if they aren't passed in, and then sets these values on the views themselves
	// finally, it is responsible for re-rendering the views
	// remember, the views now have new data, so they must be re-rendered to show the new data
	show : function(stream, verb, objectType, actorType) {
		stream = stream || "firehose";
		verb = verb || "";
		objectType = objectType || "";
        actorType = actorType || "";
		this.filterView.setFilter(verb, objectType, actorType);
		this.filterView.render();

		this.streamView.setStream(stream);
		this.streamView.render();

		this.activityView.setFilters(stream, verb, objectType, actorType);
		this.activityView.render();
	}

});