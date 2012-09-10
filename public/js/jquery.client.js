// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info, log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

(function ($) {

	// Shorthand jQuery selector cache. Only use on selectors for the DOM that won't change.
	var $$ = (function() {
		var cache = {};
		return function(selector) {
			if (!cache[selector]) {
				cache[selector] = $(selector);
			}
			return cache[selector];
		};
	})();

	App.socketIoClient = io.connect(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': ['xhr-polling']
	});
	App.socketIoClient.on('connect', function () {
		$$('#connected').addClass('on').find('strong').text('Online');
	});

    $('#new_photo').ajaxForm(function(data) {
        $('#new_activity');
        // TODO: Make this prettier like a flash alert
        alert("Uploaded Photo to your Personal Stream");
    });

	var image = $.trim($('#image').val());
	var service = $.trim($('#service').val());

    var $ul = $('#main_stream');
    App.map = null;
    var streamView = new ActivityStreamView();

    var defaultSync = Backbone.sync;

    Backbone.sync = function(method, model, options) {
        console.dir(model);
        if (model.url === "/activities") {
            if (method === "create") {
								var act = model.toJSON();
								App.socketIoClient.emit("create-activity", act);
            } else if (method === "save") {
                var act = model.toJSON();
        				App.socketIoClient.emit("save-activity", act);
                alert("Saving activity");
            }
            return true;
        } else {
            alert("Doing a different kind of operation " + model.urlRoot);
            defaultSync(method, model, options);
        }
    }

    var newActView = new ActivityCreateView();

    // set up the router here - remember the router is like a controller in Rails
    //var dashboardRouter = new DashboardRouter({filterView: filterView, colorView: colorView, carView: carListView});

    // the required Backbone way to start up the router
    //Backbone.history.start({pushState: true});

	App.socketIoClient.on('message', function(json) {
		var doc = JSON.parse(json);
        if (doc) {
            streamView.collection.add(new Activity(doc));
        }
	});

    App.socketIoClient.on('disconnect', function() {
   		$$('#connected').removeClass('on').find('strong').text('Offline');
   	});

    $(document).ready(function(){

        $(".filter-checkbox").on("click", function(){
            if (this.checked == false) {
                $("#main_stream ." + this.name + "-" +this.value).hide();
            } else {
                $("#main_stream ." + this.name + "-" +this.value).show();
            }
        });

    });



})(jQuery);


