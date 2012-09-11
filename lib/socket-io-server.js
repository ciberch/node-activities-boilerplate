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

        var session = client.handshake.session;

        var desiredStream = session.desiredStream ? session.desiredStream : asmsClient.default.stream;
        asmsDB.Activity.subscribe(desiredStream,  function(channel, json) {
          if (channel == desiredStream) {
              client.send(json);
          }
        });

        var currentUser = asmsClient.helpers.getCurrentUserObject(session);

        if (currentUser._id) {
            asmsClient.helpers.publishActivity(desiredStream, currentUser, {
                    verb: 'connect',
                    object: asmsClient.default.instance,
                    target: asmsClient.default.app,
                    provider: asmsClient.default.provider,
                    title: "connected to"
                });

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

		client.on('create-activity', function(actHash) {
            actHash.provider = asmsClient.default.provider;
            asmsClient.helpers.publishActivity(desiredStream, currentUser, actHash);
		});

	});

	io.sockets.on('error', function(){ console.log(arguments); });

	return io;
};
