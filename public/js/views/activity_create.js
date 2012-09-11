var ActivityDropDownView = Backbone.View.extend({
	tagName : "li",
	// we don't need a template file if the view is this simple
	template : _.template('<a href="#" class="type-select" data-filter-type="<%=name%>"><%=name%></a>'),

	// a standard render function
	render : function() {
		var html = this.template(this.model.toJSON());
		this.$el.html(html);
		return this;
	},

	// bind to the event when a country is selected
	events : {
		"click .type-select" : "selectType"
	},

	// handle the event and trigger it so listeners can respond to it
    selectType : function(e) {
		this.trigger("select", e, this);
	}
});

var ActivityObjectEditorView = Backbone.View.extend({
    tagName : "ul",

    initialize: function(){
        this.typeSelector = new ActivityDropDownView();

    },

    render: function(){
        $(this.el).append(this.typeSelector.render());
    }

});

var ActivityEditorView = Backbone.View.extend({
    el: $("#new_activity"),

    initialize: function(){
        this.actorEditor = new ActivityObjectEditorView();
        this.objectEditor = new ActivityObjectEditorView();

    },

    events: {
        "click .verb-select":   "openVerbs",
        "change #streamName" : "setStream",
        "click #send-message" : "save"
    },

    render: function(){

    }
});