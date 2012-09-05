module.exports = function Server(expressInstance, sessionStore) {
	var parseCookie = require('connect').utils.parseCookie;
	var io = require('socket.io').listen(expressInstance);

    var asmsClient = expressInstance.asmsClient;
    var asmsDB = asmsClient.asmsDB;
    var thisApp = asmsClient.thisApp;
    var thisInstance = asmsClient.thisInstance;
    var defaultAvatar = asmsClient.defaultAvatar;

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
        var desiredStream = asmsClient.defaultStream;
        var session = client.handshake.session;
		var user = null;

        if (session.user) {
            user = session.user.displayName;
        } else {
            user = 'UID: '+(session.uid || 'has no UID');
        }


        if (session.desiredStream) {
            desiredStream = session.desiredStream;
            console.log("User " + user + " has chosen to view this stream " + desiredStream);
        }

		// Join user specific channel, this is good so content is send across user tabs.
		client.join(client.handshake.sid);


        var avatarUrl = ((session.auth && session.user.image) ? session.user.image : defaultAvatar);
        var currentUser = {displayName: user, image: {url: avatarUrl}};


        asmsDB.Activity.subscribe(desiredStream,  function(channel, json) {
            client.send(json);
        });

        if (session.user && session.user.displayName) {
            asmsClient.publishActivity(desiredStream, currentUser, asmsClient.thisProvider, {
                    verb: 'connect',
                    object: thisInstance,
                    target: thisApp._id,
                    title: "connected to"
                });
        } else {
            console.log("I don't know who the user is");
            //console.dir(session);
        }


        var provider = new asmsDB.ActivityObject({'displayName': 'The Internet', icon: {url: 'http://www.w3.org/favicon.ico'}});
        if (session.auth) {
            if (session.auth.github) {
                provider.displayName = 'GitHub';
                provider.icon = {url: 'http://github.com/favicon.ico'};
            } else if (session.auth.facebook) {
                provider.displayName = 'Facebook';
                provider.icon = {url: 'http://facebook.com/favicon.ico'};
            } else if (session.auth.twitter) {
                provider.displayName = 'Twitter';
                provider.icon = {url: 'http://twitter.com/favicon.ico'};
            }
        }
        provider.save();

		client.on('message', function(actHash) {
            console.log("Got a new message from the client");
            console.log(actHash);
            asmsClient.publishActivity(desiredStream, currentUser, provider, actHash);
		});

        if (session.user && session.user.displayName) {
            client.on('disconnect', function() {
                //console.log('disconnect');
                asmsClient.publishActivity(desiredStream, currentUser, provider, {
                    verb: 'disconnect',
                    title: "disconnected from",
                    object: thisInstance,
                    target: thisApp._id
                });

            });
        }
	});

	io.sockets.on('error', function(){ console.log(arguments); });

	return io;
};
