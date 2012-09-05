module.exports = function Server(expressInstance, sessionStore) {
	var parseCookie = require('connect').utils.parseCookie;
	var io = require('socket.io').listen(expressInstance);

    var asmsClient = expressInstance.asmsClient;
    var asmsDB = asmsClient.asmsDB;

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

        // Join user specific channel, this is good so content is send across user tabs.
		client.join(client.handshake.sid);

        var desiredStream = asmsClient.default.stream;
        var session = client.handshake.session;
        var currentUser = asmsClient.helpers.getCurrentUserObject(session);
        if (session.desiredStream) {
            desiredStream = session.desiredStream;
            console.log("User " + currentUser.displayName + " has chosen to view this stream " + desiredStream);
        }

        asmsDB.Activity.subscribe(desiredStream,  function(channel, json) {
            console.log("Sending to client " + currentUser.displayName + " a message");
            console.log(json);
            client.send(json);
        });

        if (session.user && session.user.displayName) {
            asmsClient.helpers.publishActivity(desiredStream, currentUser, {
                    verb: 'connect',
                    object: asmsClient.default.instance,
                    target: asmsClient.default.app,
                    provider: asmsClient.default.provider,
                    title: "connected to"
                });
        } else {
            console.log("I don't know who the user is");
            //console.dir(session);
        }

		client.on('message', function(actHash) {
            console.log("Got a new message from the client");
            console.log(actHash);
            actHash.provider = asmsClient.default.provider;
            asmsClient.helpers.publishActivity(desiredStream, currentUser, actHash);
		});

        if (session.user && session.user.displayName) {
            client.on('disconnect', function() {
                //console.log('disconnect');
                asmsClient.helpers.publishActivity(desiredStream, currentUser, {
                    verb: 'disconnect',
                    title: "disconnected from",
                    provider: asmsClient.default.provider,
                    object: asmsClient.default.instance,
                    target: asmsClient.default.app
                });

            });
        }
	});

	io.sockets.on('error', function(){ console.log(arguments); });

	return io;
};
