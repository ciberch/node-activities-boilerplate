module.exports = function(app, cf) {

    var getUri = function(path) {
        return app.siteConf.uri + path;
    }

    // Setup the Asms DB and User Schema and Auth
    var defaultAvatar = getUri('/img/codercat-sm.jpg');

    var streamLib = require('activity-streams-mongoose')({
        mongoUrl: app.siteConf.mongoUrl,
        redis: app.siteConf.redisOptions,
        defaultActor: defaultAvatar
    });

    var authentication = new require('./authentication.js')(streamLib, app.siteConf);

    var asmsDB = new streamLib.DB(streamLib.db, streamLib.types);
    streamLib.asmsDB = asmsDB;

    // Setup default Objects
    var thisInstance = {objectType : "AppInstance"};
    if (cf.app) {
        thisInstance.image = {url: getUri('/img/cf-process.jpg')};
        thisInstance.url = "http://" + cf.host + ":" + cf.port;
        thisInstance.displayName = "App Instance " + cf.app['instance_index'] + " at " + thisInstance.url;
        thisInstance.content = cf.app['instance_id']
    } else {
        thisInstance.displayName =  "Instance 0 -- Local";
    }

    var thisApp = new asmsDB.ActivityObject({
        displayName: 'Activity Streams App',
        url: app.siteConf.uri,
        image:{url: getUri('/img/as-logo-sm.png')}
    });

    thisApp.save(function (err) {
        if (err === null) {
            var startAct = new asmsDB.Activity({
                actor: {displayName: app.siteConf.user_email, image:{url: getUri("/img/me.jpg")}},
                verb: 'start',
                object: thisInstance,
                target: thisApp._id,
                title: "started"
            });

            startAct.publish('firehose');
        }
    });

    var thisProvider = new asmsDB.ActivityObject({
        'displayName': 'Cloud Foundry',
        icon:{url: 'http://www.cloudfoundry.com/images/favicon.ico'}
    });
    thisProvider.save(function(err) {
        if (!err) {
            thisProvider = null;
        } else {
            console.log("Got error publishing welcome message")
        }
    });


    var publishActivity = function(desiredStream, currentUser, provider, actHash) {

        if (actHash && actHash.object && actHash.object.objectType && actHash.verb) {
            actHash.actor = currentUser;
            actHash.provider = provider._id;

            if (!actHash.title) {
                actHash.title = actHash.verb  + "ed a new " + actHash.object.objectType;
            }

            var act = new asmsDB.Activity(actHash);
            // Send back the message to the users room.
            act.publish(desiredStream);
        } else {
            console.log("Missing required parameters");
            console.log(actHash);
            throw("Missing required parameters " + actHash);
        }
    };

    var getDistinct = function (req, res, next, term, init){
        var key = 'used.' + term;
        req[key] = init ? init : [];
        asmsDB.Activity.distinct(term, {streams: req.session.desiredStream}, function(err, docs) {
            if (!err && docs) {
                _.each(docs, function(result){
                    req[key].push(result);
                });
                next();
            } else {
                next(new Error('Failed to fetch ' + term));
            }
        });
    }



    return {
        getDistinct : getDistinct,
        defaultAvatar: defaultAvatar,
        defaultStream :"firehose",
        thisProvider : thisProvider,
        streamLib : streamLib,
        asmsDB: asmsDB,
        publishActivity : publishActivity,
        authentication : authentication,
        thisApp: thisApp,
        thisInstance: thisInstance,
        getUri: getUri,
        metadata: {
            actorTypes: ['Person', 'Group', 'Application', 'Service'],
            objectTypes: ['Application', 'Article', 'Bookmark', 'Comment', 'Event', 'File', 'Folder', 'Group', 'List', 'Note',
                'Person', 'Photo', 'Place', 'Playlist', 'Product', 'Review', 'Stream', 'Service', 'Song', 'Status', 'Video'],
            verbs: ['Post', 'Favorite', 'Follow', 'Join', 'Like', 'Friend', 'Play', 'Save', 'Share', 'Tag', 'Create',
                'Update', 'Read', 'Delete', 'Check In']
        }
    }
};
