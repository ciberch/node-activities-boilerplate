module.exports = function Server(expressInstance, sessionStore) {
	var parseCookie = require('connect').utils.parseCookie;
	var io = require('socket.io').listen(expressInstance);
    var asmsServer = expressInstance.asmsDB;
    var thisApp = expressInstance.thisApp;
    var thisInstance = expressInstance.thisInstance;

	io.configure(function () {
		io.set('log level', 0);
	});

	io.set('authorization', function(handshakeData, ack) {
		var cookies = parseCookie(handshakeData.headers.cookie);
		sessionStore.get(cookies[expressInstance.cookieName], function(err, sessionData) {
			handshakeData.session = sessionData || {};
			handshakeData.sid = cookies[expressInstance.cookieName]|| null;
			ack(err, err ? false : true);
		});
	});

	io.sockets.on('connection', function(client) {
		var user = client.handshake.session.user ? client.handshake.session.user.name : 'UID: '+(client.handshake.session.uid || 'has no UID');

        var desiredStream = "firehose";

        if (client.handshake.session && client.handshake.session.desiredStream) {
            desiredStream = client.handshake.session.desiredStream;
            console.log("User " + user + " has chosen to view this stream " + desiredStream);
        } else {
            console.log("No desired stream");
            console.dir(client.handshake);
        }

		// Join user specific channel, this is good so content is send across user tabs.
		client.join(client.handshake.sid);


        var avatarUrl = ((client.handshake.session.auth && client.handshake.session.user.image) ? client.handshake.session.user.image : '/img/codercat-sm.jpg');
        var currentUser = {displayName: user, image: {url: avatarUrl}};


        asmsServer.subscribe(desiredStream,  function(channel, json) {

            client.send(json);
        });

        var cf_provider = new asmsServer.ActivityObject({'displayName': 'Cloud Foundry', icon:{url: 'http://www.cloudfoundry.com/images/favicon.ico'}});
        cf_provider.save(function(err) {
            if (err == null) {
                if (client.handshake.session.user && client.handshake.session.user.name) {
                    var act = new asmsServer.Activity({
                            id: 1,
                            actor: currentUser,
                            verb: 'connect',
                            object: thisInstance,
                            target: thisApp._id,
                            title: "connected to",
                            provider: cf_provider._id
                        });
                }
                console.dir(act);
            asmsServer.publish(desiredStream, act);

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

		client.on('message', function(actHash) {
            console.log("Got a new message from the client");
            console.dir(actHash);

            actHash.actor = currentUser;
            actHash.provider = provider._id;

            if (actHash.verb == "post") {
                actHash.title = "posted a " + actHash.object.objectType;

            }

            var act = new asmsServer.Activity(actHash);

            // Send back the message to the users room.
            asmsServer.publish(desiredStream, act);

            console.log("Published act");
            console.dir(act);
		});

        if (client.handshake.session.user && client.handshake.session.user.name) {
            client.on('disconnect', function() {
                //console.log('disconnect');
                asmsServer.publish(desiredStream, new asmsServer.Activity({
                    actor: currentUser,
                    verb: 'disconnect',
                    object: thisInstance,
                    target: thisApp._id,
                    title: "disconnected from",
                    provider: cf_provider._id
                }));

            });
        }
	});

	io.sockets.on('error', function(){ console.log(arguments); });

	return io;
};
