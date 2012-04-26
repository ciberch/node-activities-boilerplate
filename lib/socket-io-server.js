module.exports = function Server(expressInstance, sessionStore) {
	var parseCookie = require('connect').utils.parseCookie;
	var io = require('socket.io').listen(expressInstance);
    var asmsServer = expressInstance.asmsDB;

	io.configure(function () {
		io.set('log level', 0);
	});

	io.set('authorization', function(handshakeData, ack) {
		var cookies = parseCookie(handshakeData.headers.cookie);
		sessionStore.get(cookies['connect.sid'], function(err, sessionData) {
			handshakeData.session = sessionData || {};
			handshakeData.sid = cookies['connect.sid']|| null;
			ack(err, err ? false : true);
		});
	});

	io.sockets.on('connection', function(client) {
		var user = client.handshake.session.user ? client.handshake.session.user.name : 'UID: '+(client.handshake.session.uid || 'has no UID');

		// Join user specific channel, this is good so content is send across user tabs.
		client.join(client.handshake.sid);


        var thisApp = {displayName: 'Activity Streams App', url: expressInstance.siteConf.uri};
        var avatarUrl = ((client.handshake.session.auth && client.handshake.session.user.image) ? client.handshake.session.user.image : '/img/default.png');
        var currentUser = {displayName: user, image: {url: avatarUrl}};
        var firehose = "firehose";

        asmsServer.subscribe(firehose,  function(channel, json) {
            console.log("Got a message back from Sub channel ");
            console.log(json);

            client.send(json);
        });

        var cf_provider = new asmsServer.ActivityObject({'displayName': 'Cloud Foundry', icon:{url: 'http://www.cloudfoundry.com/images/favicon.ico'}});
        cf_provider.save(function(err) {
            if (err == null) {
                var act = new asmsServer.Activity({
                        actor: thisApp,
                        verb: 'to-welcome',
                        object: currentUser,
                        title: "welcomes",
                        provider: cf_provider._id
                    });
                console.dir(act);
            asmsServer.publish(firehose, act);

            } else {
                console.log("Got error publishing welcome message")
            }
        });

        var provider = new asmsServer.ActivityObject({'displayName': 'The Internet', icon: {url: 'http://www.w3.org/favicon.ico'}});
        if (client.handshake.session.auth) {
            if (client.handshake.session.auth.github) {
                provider.displayName = 'GitHub';
                provider.icon = {url: 'http://github.com/favicon.ico'};
            } else if (client.handshake.session.auth.facebook) {
                provider.displayName = 'Facebook';
                provider.icon = {url: 'http://facebook.com/favicon.ico'};
            } else if (client.handshake.session.auth.twitter) {
                provider.displayName = 'Twitter';
                provider.icon = {url: 'http://twitter.com/favicon.ico'};
            }
        }
        provider.save();

		client.on('message', function(msg) {
				var act = new asmsServer.Activity({
						actor: currentUser,
						object: {displayName:msg},
						title: "posted a message",
						provider: provider._id
				});

				// Send back the message to the users room.
				asmsServer.publish(firehose, act);

				console.log("Published act");
				console.dir(act);
		});

		client.on('disconnect', function() {
            //console.log('disconnect');
            asmsServer.publish(firehose, new asmsServer.Activity({
                actor: thisApp,
                verb: 'says-goodbye',
                object: currentUser,
                title: "says goodbye to",
                provider: cf_provider._id
            }));

        });
	});

	io.sockets.on('error', function(){ console.log(arguments); });

	return io;
};
