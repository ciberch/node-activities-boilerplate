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
        console.log(doc);
		var msg = doc.actor.displayName + ' ' + doc.title + ' ' + doc.object.displayName;

		var $li = $('<li>');
        var $row = $('<div class="row"></div>');
        $li.append($row);

        var $span = $('<div class="span2"></div>');
        $row.append($span);
        var image = '/img/codercat-sm.jpg';
        if (doc.actor.image && doc.actor.image.url) {
            image = doc.actor.image.url;
        }
        $span.append($('<img class="avatar">').attr('src', image));

        var $span2 = $('<div class="span8"></div>');
        $row.append($span2);

        var x= '';
        if (doc.provider && doc.provider.icon) {
            x = '<br/>Via: <img class="service" src="' + doc.provider.icon.url + '" />';
        }
        $span2.append('<div class="activity"><strong>' + doc.actor.displayName + '</strong> ' + doc.title +
             ': <br/><blockquote>' + doc.object.displayName + '</blockquote>' + x + '</div>');
        $ul.prepend($li);

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


