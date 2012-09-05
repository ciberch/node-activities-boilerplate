module.exports = function(app, cf) {

    var getUri = function(path) {
        return app.siteConf.uri + path;
    }

    var defaultStream = "firehose";

    // Setup the Asms DB and User Schema and Auth
    var defaultAvatar = getUri('/img/codercat-sm.jpg');

    var actorTypes = ['Person', 'Group', 'Application', 'Service'];
    var objectTypes = ['Application', 'Article', 'Bookmark', 'Comment', 'Event', 'File', 'Folder', 'Group', 'List', 'Note', 'Person', 'Photo', 'Place', 'Playlist', 'Product', 'Review', 'Stream', 'Service', 'Song', 'Status', 'Video']
    var verbs = ['Post', 'Favorite', 'Follow', 'Join', 'Like', 'Friend', 'Play', 'Save', 'Share', 'Tag', 'Create', 'Update', 'Read', 'Delete', 'Check In']

    var streamLib = require('activity-streams-mongoose')({
        mongoUrl: app.siteConf.mongoUrl,
        redis: app.siteConf.redisOptions,
        defaultActor: defaultAvatar
    });

    var authentication = new require('./authentication.js')(streamLib, app.siteConf);

    var asmsDB = new streamLib.DB(streamLib.db, streamLib.types);
    streamLib.asmsDB = asmsDB;

    // Setup default Objects
    // TODO: Change to find or create by
    var thisInstance = {objectType : "AppInstance"};
    if (cf.app) {
        thisInstance.image = {url: getUri('/img/cf-process.jpg')};
        thisInstance.url = "http://" + cf.host + ":" + cf.port;
        thisInstance.displayName = "App Instance " + cf.app['instance_index'] + " at " + thisInstance.url;
        thisInstance.content = cf.app['instance_id']
    } else {
        thisInstance.displayName =  "Instance 0 -- Local";
    }

    var appOwner = {displayName: app.siteConf.user_email, image:{url: getUri("/img/me.jpg")}};

    var thisApp = new asmsDB.ActivityObject({
        displayName: 'Activity Streams App',
        url: app.siteConf.uri,
        image:{url: getUri('/img/as-logo-sm.png')}
    });

    thisApp.save(function (err) {
        if (err) throw err
        var startAct = new asmsDB.Activity({
            actor: appOwner,
            verb: 'start',
            object: thisInstance,
            target: thisApp._id,
            title: "started"
        });

        startAct.publish('firehose');
    });

    var thisProvider = new asmsDB.ActivityObject({
        'displayName': 'Cloud Foundry',
        icon:{url: 'http://www.cloudfoundry.com/images/favicon.ico'}
    });
    thisProvider.save(function(err){if (err) throw err});

    var github = new asmsDB.ActivityObject({displayName: 'GitHub', url: 'http://github.com', icon : {url: 'http://github.com/favicon.ico'}});
    github.save(function(err){if (err) throw err});
    var facebook = new asmsDB.ActivityObject({displayName: 'Facebook', url: 'http://facebook.com', icon : {url: 'http://facebook.com/favicon.ico'}});
    facebook.save(function(err){if (err) throw err});
    var twitter = new asmsDB.ActivityObject({displayName: 'Twitter', url: 'http://twitter.com', icon : {url: 'http://twitter.com/favicon.ico'}});
    twitter.save(function(err){if (err) throw err});

    var getCurrentUserObject = function(session) {
        var currentUser = {};

        if (session.user) {
            currentUser.displayName = session.user.displayName;
        } else {
            currentUser.displayName = 'UID: '+(session.uid || 'has no UID');
        }
        currentUser.image = { url: ((session.auth && session.user.image) ? session.user.image : defaultAvatar)};

        // Its a bit of an abstraction to say that the author of you Facebook User was Facebook
        if (session.auth) {
            if (session.auth.github) {
                currentUser.author = github;
            } else if (session.auth.facebook) {
                currentUser.author = facebook;
            } else if (session.auth.twitter) {
                currentUser.author = twitter;
            }
        }
        return currentUser;
    }

    var publishActivity = function(desiredStream, currentUser, actHash) {

        if (!currentUser) throw("Cannot publish activity without an actor");
        if (actHash && actHash.object && actHash.object.objectType && actHash.verb) {
            actHash.actor = currentUser;

            if (!actHash.title) {
                actHash.title = actHash.verb  + "ed a new " + actHash.object.objectType;
            }

            var act = new asmsDB.Activity(actHash);
            // Send back the message to the users room.
            act.publish(desiredStream);
        } else {
            console.log("Missing required parameters");
            console.log(actHash);
            throw(new Error("Missing required parameters"));
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
                next(new Error('Failed to fetch distinct ' + term));
            }
        });
    }

    return {
        helpers: {
            getUri: getUri,
            getCurrentUserObject : getCurrentUserObject,
            publishActivity : publishActivity,
            getDistinct : getDistinct
        },
        default :{
            provider : thisProvider,
            app: thisApp,
            instance: thisInstance,
            avatar: defaultAvatar,
            stream : defaultStream
        },
        users : {
            providers :{
                facebook: facebook,
                twitter: twitter,
                github : github
            }
        },
        streamLib : streamLib,
        asmsDB: asmsDB,
        authentication : authentication,
        metadata: {
            actorTypes: actorTypes,
            objectTypes: objectTypes,
            verbs: verbs
        }
    }
};
