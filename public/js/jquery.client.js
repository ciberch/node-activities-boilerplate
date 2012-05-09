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

    $(document).ready(function(){

        $(".filter-checkbox").live("click", function(){
            if (this.checked == false) {
                $("#main_stream ." + this.name + "-" +this.value).hide();
            } else {
                $("#main_stream ." + this.name + "-" +this.value).show();
            }
        });

        $("#send-message").click(function() {
            var msg = $("#msg").val();
            var title = $('#title').val();
            var streamName = $('#streamName').val();

            if (msg && msg.length > 0) {
                $("#msg").val('');
                $('#title').val('');

                var act = {object: {content: msg, objectType: 'note', title: title}, verb: 'post', streams: [streamName]};

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


