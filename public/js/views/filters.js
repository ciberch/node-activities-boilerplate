// These objects handle the 3 comboboxes in the application
// Note how the code is extremly long to handle seemingly simple things
// It points out one of the criticisms of Backbone, that it contains too much boiler plate



// this object is larger view that contains the previous 3 views
// it acts as the controller for the other 3 views and captures events from them and reacts to them
var FilterView = Backbone.View.extend({

	tagName : "div",

	initialize : function(options) {

		var _this = this;

		// get the template from the JST file
		this.template = JST["templates/filter"];

		// default values
		this.country = "all";
		this.make = "all";
		this.carmodel = "all";

		// grab the Collection objects from the options object
		this.activityObjectCollection = options.activityObjectCollection;
		this.verbCollection = options.verbCollection;
		this.carmodelCollection = options.carmodelCollection;

		// in these blocks of code, we bind to the "reset" event of each collection.
		// notice we only render the specific combobox that had the "reset" event triggered, and don't just
		// call a blind "render()" - that would cause unnecessary repaints
		//
		// we also mixin the ParamFetchCollection mixin to add some functionality to the Collections
		if (this.activityObjectCollection) {
			this.activityObjectCollection.on("reset", this.renderCountry, this);
			_.extend(this.countryCollection, Backbone.ParamFetchCollection.prototype);
		}
		if (this.makeCollection) {
			this.makeCollection.on("reset", this.renderMake, this);
			_.extend(this.makeCollection, Backbone.ParamFetchCollection.prototype);
		}
		if (this.carmodelCollection) {
			this.carmodelCollection.on("reset", this.renderCarmodel, this);
			_.extend(this.carmodelCollection, Backbone.ParamFetchCollection.prototype);
		}
	},

	// handle the events from the comboboxes, but only the "all" choice (the others are handled by their respective views)
	events : {
		"click .all-country-filter" : "selectCountry",
		"click .all-make-filter" : "selectMake",
		"click .all-carmodel-filter" : "selectCarmodel"
	},

	// render the entire view
	// notice we construct our own JSON object here, to keep it simple and error-proof
	// also notice we simply delegate the majority of the rendering to 3 small methods
	render : function() {

		var c = (this.countryCollection !== undefined);
		var m = (this.makeCollection !== undefined);
		var r = (this.carmodelCollection !== undefined);

		var json = '{"country":' + c + ', "make":' + m + ', "carmodel":' + r + '}';

		var html = this.template($.parseJSON(json));
		this.$el.html(html);

		if (this.countryCollection) {
			this.renderCountry();
		}
		if (this.makeCollection) {
			this.renderMake();
		}
		if (this.carmodelCollection) {
			this.renderCarmodel();
		}

		return this;
	},

	// renders the country combobox
	renderCountry : function() {
		var _this = this;
		// keep the first one, which is always "All Countries"
		this.$el.find(".country-filter").slice(1).remove();
		// loop through each country, create a view, and have it rendered
		// bind to the "select" event so we can capture events from this view in this object
		this.countryCollection.each(function(country){
			var view = new CountryView({model:country});
			view.on("select", function(e, v){
				_this.selectCountry(e, v);
			});
			_this.$el.find(".country-dropdown-menu").append(view.render().el);
		});
		$(".country-filter").each(function(){
			if (_this.country == $(this).data("filter-type"))
			{
				$("#all-countries").find(".choice-title").text($(this).text());
			}
		});
	},

	// renders the make combobox
	renderMake : function() {
		var _this = this;
		// keep the first one, which is always "All Makes"
		this.$el.find(".make-filter").slice(1).remove();
		// loop through each make, create a view, and have it rendered
		// bind to the "select" event so we can capture events from this view in this object
		this.makeCollection.each(function(make){
			var view = new MakeView({model:make});
			view.on("select", function(e, v){
				_this.selectMake(e, v);
			});
			_this.$el.find(".make-dropdown-menu").append(view.render().el);
		});
		$(".make-filter").each(function(){
			if (_this.make == $(this).data("filter-type"))
			{
				$("#all-makes").find(".choice-title").text($(this).text());
			}
		});
	},

	// renders the carmodel combobox
	renderCarmodel : function() {
		var _this = this;
		// keep the first one, which is always "All Cars"
		this.$el.find(".carmodel-filter").slice(1).remove();
		// loop through each carmodel, create a view, and have it rendered
		// bind to the "select" event so we can capture events from this view in this object
		this.carmodelCollection.each(function(carmodel){
			var view = new CarModelView({model:carmodel});
			view.on("select", function(e, v){
				_this.selectCarmodel(e, v);
			});
			_this.$el.find(".carmodel-dropdown-menu").append(view.render().el);
		});
		$(".carmodel-filter").each(function(){
			if (_this.carmodel == $(this).data("filter-type"))
			{
				$("#all-carmodels").find(".choice-title").text($(this).text());
			}
		});
	},

	// handles the events when one of the countries are selected
	// we pass it the event "e", and the "view" so we can work with the objects
	selectCountry : function(e, view) {
		if (!view) {
			this.country = "all";
		}
		else {
			// get the country from the view that triggered the event
			this.country = view.model.get("name");
		}
		this.make = "all";
		this.carmodel = "all";

		// fire an event so the Router can be aware of changes to the data
		this.trigger("change_country", this.country);

		// update the make combobox
		this.makeCollection.fetchWithParams({}, {country_name: this.country});

		// update the car combobox
		this.carmodelCollection.fetchWithParams({}, {country_name: this.country, make_name: this.make});

		// a little trick/hack to prevent the URL from putting a "#" at the end
		// this is only required because we are overriding some undesired Bootstrap code
		e.preventDefault();

	},

	selectMake : function(e, view) {
		if (!view) {
			this.make = "all";
		}
		else
		{
			// get the country and make from the view that triggered the event
			this.country = view.model.get("country_name");
			this.make = view.model.get("name");
		}
		this.carmodel = "all";

		// fire an event so that Router can be aware of changes to the data
		this.trigger("change_make", this.make);

		// update the car combobox
		this.carmodelCollection.fetchWithParams({},{make_name: this.make, country_name: this.country});

		// a little trick/hack to prevent the URL from putting a "#" at the end
		// this is only required because we are overriding some undesired Bootstrap code
		e.preventDefault();
	},

	selectCarmodel : function(e, view) {
		if (!view) {
			this.carmodel = "all";
		}
		else
		{
			// get the country, make, and carmodel from the view that triggered the event
			this.country = view.model.get("country_name");
			this.make = view.model.get("make_name");
			this.carmodel = view.model.get("name");
		}

		// fire and event so that the Router can be aware of changes to the data
		this.trigger("change_carmodel", this.carmodel);

		// a little trick/hack to prevent the URL from putting a "#" at the end
		// this is only required because we are overriding some undesired Bootstrap code
		e.preventDefault();
	},

	// convenience functions to make setting data on this object easier
	setFilter : function(country, make, carmodel) {
		this.setCountry(country);
		this.setMake(make);
		this.setCarmodel(carmodel);
	},

	setCountry : function(country) {
		this.country = country;
	},

	setMake : function(make) {
		this.make = make;
	},

	setCarmodel : function(carmodel) {
		this.carmodel = carmodel;
	}

});