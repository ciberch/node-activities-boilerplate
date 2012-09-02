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

    console.log("IO is");
    console.dir(io);

	App.socketIoClient = io.connect(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': ['xhr-polling']
	});
	App.socketIoClient.on('connect', function () {
		$$('#connected').addClass('on').find('strong').text('Online');
	});

	var image = $.trim($('#image').val());
	var service = $.trim($('#service').val());

    var $ul = $('#main_stream');
    App.map = null;
    var streamView = new ActivityStreamView();

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

        $(".type-select").on("click", function() {
            var itemName = $(this).data("type-show");
            if (itemName) {
                $("#" + itemName)[0].innerHTML= this.innerText + " &nbsp;";
            }
        });

        $("#includeLocation").on("click", function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(App.getLocation);
            } else {
                alert("Geo Location is not supported on your device");
            }
        });


        $("#send-message").click(function() {
            console.log("In send message");
            var msg = $("#msg").val();
            var url = $('#url').val();
            var title = $('#title').val();
            var streamName = $('#streamName').val();
            var objectType = App.helper.trimForServer($('#object-show'));
            var verb = App.helper.trimForServer($('#verb-show'));

            if (verb && objectType && msg && msg.length > 0) {
                $("#msg").val('');
                $('#title').val('');
                $('#url').val('');

                var act = {
                    object: {content: msg, objectType: objectType, title: title, url: url},
                    verb: verb,
                    streams: [streamName]
                };

                console.dir(act);
                console.log("Sending activity");
                App.socketIoClient.emit("message", act);
            }
            return false;
        });
    });



})(jQuery);


