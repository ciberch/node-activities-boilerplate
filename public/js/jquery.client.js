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

    var $ul = $$('#stream ul');

	socketIoClient.on('message', function(json) {
		var doc = JSON.parse(json);
        if (doc) {
            var data = {activities: [doc]};
            var fx = jade.templates["activity"];
            var act_html = fx(data);
            var $li = $(act_html);
            $ul.prepend($li);
            console.log($li);
        }
		if ($ul.children.count > 20) {
            $ul.children.last.remove();
        }
	});

    $(document).ready(function(){
        $("#send-message").click(function() {
            var msg = $("#msg").val();
            if (msg && msg.length > 0) {
                $("#msg").val('');
                socketIoClient.send(msg);
            }
            return false;
        });
    });

	socketIoClient.on('disconnect', function() {
		$$('#connected').removeClass('on').find('strong').text('Offline');
	});
})(jQuery);


