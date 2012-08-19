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

	var socketIoClient = io.connect(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': ['xhr-polling']
	});
	socketIoClient.on('connect', function () {
		$$('#connected').addClass('on').find('strong').text('Online');
	});

	var image = $.trim($('#image').val());
	var service = $.trim($('#service').val());

    var $ul = $('#main_stream');

    // set up the router here - remember the router is like a controller in Rails
    //var dashboardRouter = new DashboardRouter({filterView: filterView, colorView: colorView, carView: carListView});

    // the required Backbone way to start up the router
    //Backbone.history.start({pushState: true});

	socketIoClient.on('message', function(json) {
		var doc = JSON.parse(json);
        if (doc) {
            console.log(doc);
            var $li = $(jade.templates["activity"]({activities: [doc]}));
            $ul.prepend($li);
        }
		if ($ul.children.count > 20) {
            $ul.children.last.remove();
        }
	});

    function trimForServer(items) {
        if (items && items.length > 0) {
            var val = items[0];
            return val.innerText.trimRight().toLowerCase();
        }
        return null;
    }

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


        $("#send-message").click(function() {
            var msg = $("#msg").val();
            var url = $('#url').val();
            var title = $('#title').val();
            var streamName = $('#streamName').val();
            var objectType = trimForServer($('#object-show'));
            var verb = trimForServer($('#verb-show'));

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
                socketIoClient.emit("message", act);
            }
            return false;
        });
    });

	socketIoClient.on('disconnect', function() {
		$$('#connected').removeClass('on').find('strong').text('Offline');
	});
})(jQuery);


