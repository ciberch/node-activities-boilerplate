module.exports = function Server(expressInstance, sessionStore) {
	var parseCookie = require('connect').utils.parseCookie;
	var io = require('socket.io').listen(expressInstance);

    var asmsClient = expressInstance.asmsClient;
    var asmsDB = asmsClient.asmsDB;

    var getNestedVal = function(obj, field){
        if (field.indexOf('.') === -1) {
            return obj[field];
        } else {
            var parts = field.split('.');
            var currentObj = obj[parts[0]];
            if (currentObj) {
                var newfieldName = parts.splice(1).join('.');
                return getNestedVal(currentObj,newfieldName);
            } else
                return null;
        }
    };

    // True if obj matches query query
    var canSyndicate = function(obj, desiredQuery) {
        var result = true;
        if (desiredQuery) {
            if (desiredQuery["$and"]) {
                for (var i=0; i < desiredQuery['$and'].length; i++) {
                    if (!result){
                        break;
                    }
                    var query = desiredQuery['$and'][i];
                    console.dir(query);
                    var query_keys = _.keys(query);
                    if (query_keys.length === 1) {
                        var field = query_keys[0];
                        var val = getNestedVal(obj, field);
                        if (typeof(query[field]) === "string") {
                            // A match
                            console.log("Comparing " + query[field] + " to " + val);

                            if (typeof(val) === "string")
                                result &= (query[field] === val);
                            else
                                result &= _.include(val, query[field]);
                        } else {
                            var operator = _.keys(query[field])[0];
                            var included = _.include(query[field][operator], val);
                            if ((operator === "$in" && !included) || (operator === "$nin" && included))
                                result &= false;

                        }
                    } else {
                        throw(new Error("Wrong format for query " + query));
                    }
                }
            }
        }
        return result;
    };


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

        var desiredQuery = session.streamQuery;

        asmsDB.Activity.subscribe(desiredStream,  function(channel, json) {
          if (channel == desiredStream) {
              var act = JSON.parse(json);
              console.log("Checking if can syndicate act for query with verb: " + act.verb + " and obj type: " + act.object.objectType);
              if (canSyndicate(act, desiredQuery)) {
                console.log("YES");
                client.send(json);
              } else {
                  console.log("NO");
              }
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

        client.on('save-activity', function(actHash) {
            console.log("Saving an activity");
            throw(new Error("Activity Save - Not Implemented"));
        });

	});

	io.sockets.on('error', function(){ console.log(arguments); });

	return io;
};
