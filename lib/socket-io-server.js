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


        var thisApp = {displayName: 'Node-Express-Boilerplate App', url: expressInstance.siteConf.uri};
        var avatarUrl = ((client.handshake.session.auth && client.handshake.session.user.image) ? client.handshake.session.user.image : '/img/default.png');
        var currentUser = {displayName: user, image: {url: avatarUrl}};
        var firehose = "firehose";

        asmsServer.subscribe(firehose,  function(channel, json) {
            client.send(json);
        });

        asmsServer.publish(firehose, new asmsServer.Activity({
            actor: thisApp,
            verb: 'to-welcome',
            object: currentUser,
            title: "welcomes"
        }));

		client.on('message', function(msg) {
			// Send back the message to the users room.
            asmsServer.publish(firehose, new asmsServer.Activity({
                actor: currentUser,
                object: {displayName:msg},
                title: "posted a message"
            }));
		});

		client.on('disconnect', function() {
            //console.log('disconnect');
            asmsServer.publish(firehose, new asmsServer.Activity({
                actor: thisApp,
                verb: 'says-goodbye',
                object: currentUser,
                title: "says goodbye to"
            }));

        });
	});

	io.sockets.on('error', function(){ console.log(arguments); });

	return io;
};
