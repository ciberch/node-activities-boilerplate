// Fetch the site configuration
var siteConf = require('./lib/getConfig');
var cf = require('cloudfoundry');
var _ = require('underscore')._;
var Guid = require('guid');

process.title = siteConf.uri.replace(/http:\/\/(www)?/, '');

var airbrake;
if (siteConf.airbrakeApiKey) {
	airbrake = require('airbrake').createClient(siteConf.airbrakeApiKey);
}

process.addListener('uncaughtException', function (err, stack) {
	console.log('Caught exception: '+err+'\n'+err.stack);
	console.log('\u0007'); // Terminal bell
	if (airbrake) { airbrake.notify(err); }
});

var connect = require('connect');
var express = require('express');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');
var notifoMiddleware = require('connect-notifo');
var DummyHelper = require('./lib/dummy-helper');
var im = require('imagemagick');

// Session store
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore(siteConf.redisOptions);

var asmsDB = require('activity-streams-mongoose')({mongoUrl: siteConf.mongoUrl, redis: siteConf.redisOptions, defaultActor: '/img/default.png'});

var thisApp = new asmsDB.ActivityObject({displayName: 'Activity Streams App', url: siteConf.uri, image:{url: '/img/as-logo-sm.png'}});

var realMongoDB = asmsDB.ActivityObject.db.db;


var thisInstance = {displayName: "Instance 0 -- Local"};
if (cf.app) {
    thisInstance.image = {url: '/img/cf-process.jpg'};
    thisInstance.url = "http://" + cf.host + ":" + cf.port;
    thisInstance.displayName = "App Instance " + cf.app['instance_index'] + " at " + thisInstance.url;
    thisInstance.content = cf.app['instance_id']
}

thisApp.save(function (err) {
    if (err === null) {
        var startAct = new asmsDB.Activity(
            {
            actor: {displayName: siteConf.user_email, image:{url: "img/me.jpg"}},
            verb: 'start',
            object: thisInstance,
            target: thisApp._id,
            title: "started"
            });

        asmsDB.publish('firehose', startAct);
    }
});

var app = module.exports = express.createServer();
app.listen(siteConf.internal_port, null);
app.asmsDB = asmsDB;
app.siteConf = siteConf;
app.thisApp = thisApp;
app.thisInstance = thisInstance;
app.cookieName = "jsessionid"; //Hack to have sticky sessions. Default connect name is 'connect.sid';
// Cookie name must be lowercase

// Setup socket.io server
var socketIo = new require('./lib/socket-io-server.js')(app, sessionStore);
var authentication = new require('./lib/authentication.js')(app, siteConf);
// Setup groups for CSS / JS assets
var assetsSettings = {
	'js': {
		'route': /\/static\/js\/[a-z0-9]+\/.*\.js/
		, 'path': './public/js/'
		, 'dataType': 'javascript'
		, 'files': [
			'http://' + siteConf.internal_host+ ':' + siteConf.internal_port + '/socket.io/socket.io.js' // special case since the socket.io module serves its own js
			, 'templates.js'
            , 'bootstrap.js'
            , 'backbone/backbone-0.9.2.js'
            , 'backbone/models.js'
            , 'backbone/views.js'
            , 'jquery.cookie.js'
            , 'jquery.client.js'
		]
		, 'debug': true
		, 'postManipulate': {
			'^': [
                assetHandler.uglifyJsOptimize,
				function insertSocketIoPort(file, path, index, isLast, callback) {
					callback(file.replace(/.#socketIoPort#./, siteConf.port));
				}
			]
		}
	}
	, 'css': {
		'route': /\/static\/css\/[a-z0-9]+\/.*\.css/
		, 'path': './public/css/'
		, 'dataType': 'css'
		, 'files': [
			'bootstrap.css'
			, 'client.css'
		]
		, 'debug': true
		, 'postManipulate': {
			'^': [
				assetHandler.fixVendorPrefixes
				, assetHandler.fixGradients
				, assetHandler.replaceImageRefToBase64(__dirname+'/public')
				, assetHandler.yuiCssOptimize
			]
		}
	}
};
// Add auto reload for CSS/JS/templates when in development
app.configure('development', function(){
	assetsSettings.js.files.push('jquery.frontend-development.js');
	[['js', 'updatedContent'], ['css', 'updatedCss']].forEach(function(group) {
		assetsSettings[group[0]].postManipulate['^'].push(function triggerUpdate(file, path, index, isLast, callback) {
			callback(file);
			dummyHelpers[group[1]]();
		});
	});
});

var assetsMiddleware = assetManager(assetsSettings);

// Settings
app.configure(function() {
	app.set('view engine', 'jade');
	app.set('views', __dirname+'/views');
});

// Middleware
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(assetsMiddleware);

	app.use(express.session({
        'key': app.cookieName
		, 'store': sessionStore
		, 'secret': siteConf.sessionSecret
	}));
	app.use(express.logger({format: ':response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer'}));
	app.use(authentication.middleware.auth());
	app.use(authentication.middleware.normalizeUserData());
	app.use(express['static'](__dirname+'/public', {maxAge: 86400000}));

	// Send notification to computer/phone @ visit. Good to use for specific events or low traffic sites.
	if (siteConf.notifoAuth) {
		app.use(notifoMiddleware(siteConf.notifoAuth, { 
			'filter': function(req, res, callback) {
				callback(null, (!req.xhr && !(req.headers['x-real-ip'] || req.connection.remoteAddress).match(/192.168./)));
			}
			, 'format': function(req, res, callback) {
				callback(null, {
					'title': ':req[x-real-ip]/:remote-addr @ :req[host]'
					, 'message': ':response-time ms - :date - :req[x-real-ip]/:remote-addr - :method :user-agent / :referrer'
				});
			}
		}));
	}
});



// ENV based configuration

// Show all errors and keep search engines out using robots.txt
app.configure('development', function(){
	app.use(express.errorHandler({
		'dumpExceptions': true
		, 'showStack': true
	}));
	app.all('/robots.txt', function(req,res) {
		res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});
	});
});
// Suppress errors, allow all search engines
app.configure('production', function(){
	app.use(express.errorHandler({
		'dumpExceptions': true
		, 'showStack': true
	}));
	app.all('/robots.txt', function(req,res) {
		res.send('User-agent: *', {'Content-Type': 'text/plain'});
	});
});

// Template helpers
app.dynamicHelpers({
	'assetsCacheHashes': function(req, res) {
		return assetsMiddleware.cacheHashes;
	}
	, 'session': function(req, res) {
		return req.session;
	}
});

// Error handling
app.error(function(err, req, res, next){
	// Log the error to Airbreak if available, good for backtracking.
	console.log(err);
	if (airbrake) { airbrake.notify(err); }

	if (err instanceof NotFound) {
		res.render('errors/404');
	} else {
		res.render('errors/500');
	}
});
function NotFound(msg){
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}

function getMetaData(req, res, next) {
    // 'Audio'
    req.actorTypes = ['Person', 'Group', 'Application', 'Service'];
    req.objectTypes = ['Application', 'Article', 'Bookmark', 'Comment', 'Event', 'File', 'Folder', 'Group', 'List', 'Note', 'Person', 'Photo', 'Place', 'Playlist', 'Product', 'Review', 'Stream', 'Service', 'Song', 'Status', 'Video'];

    req.verbs = ['Post', 'Favorite', 'Follow', 'Join', 'Like', 'Friend', 'Play', 'Save', 'Share', 'Tag', 'Create', 'Update', 'Read', 'Delete', 'Check In'];
    next();
};

function loadUser(req, res, next) {
    console.log("Request Session is");
    console.dir(req.session);

	if (!req.session.uid) {
		req.session.uid = (0 | Math.random()*1000000);
	} else if (req.session.auth){
       if (req.session.auth.github)
        req.providerFavicon = '/github.ico';
       else if (req.session.auth.twitter)
        req.providerFavicon = '/twitter.ico';
       else if (req.session.auth.facebook)
        req.providerFavicon = '/facebook.ico';
    }
    var displayName = req.session.user ? req.session.user.name : 'UID: '+(req.session.uid || 'has no UID');
    var avatarUrl = ((req.session.auth && req.session.user.image) ? req.session.user.image : '/img/codercat-sm.jpg');
    req.user = {displayName: displayName, image: {url: avatarUrl}};
    next();
}

function getDistinctVerbs(req, res, next){
    req.usedVerbs = []
    asmsDB.Activity.distinct('verb', {streams: req.session.desiredStream}, function(err, docs) {
        if (!err && docs) {
            _.each(docs, function(verb){
                req.usedVerbs.push(verb);
            });
            next();
        } else {
            next(new Error('Failed to fetch verbs'));
        }
    });
};

function getDistinctActors(req, res, next){
    req.usedActors = []
        asmsDB.Activity.distinct('actor', {streams: req.session.desiredStream}, function(err, docs) {
            if (!err && docs) {
                _.each(docs, function(obj){
                    req.usedActors.push(obj);
                });
                next();
            } else {
                next(new Error('Failed to fetch actors'));
            }
        });
};

function getDistinctObjects(req, res, next){
    req.usedObjects = []
        asmsDB.Activity.distinct('object', {streams: req.session.desiredStream}, function(err, docs) {
            if (!err && docs) {
                _.each(docs, function(obj){
                    req.usedObjects.push(obj);
                });
                next();
            } else {
                next(new Error('Failed to fetch objects'));
            }
        });
};

function getDistinctObjectTypes(req, res, next){
    req.usedObjectTypes = ['none']
        asmsDB.Activity.distinct('object.objectType', {streams: req.session.desiredStream}, function(err, docs) {
            if (!err && docs) {
                _.each(docs, function(objType){
                    req.usedObjectTypes.push(objType);
                });
                next();
            } else {
                next(new Error('Failed to fetch objTypes'));
            }
        });
};

function getDistinctActorObjectTypes(req, res, next){
    req.usedActorObjectTypes = ['none']
        asmsDB.Activity.distinct('actor.objectType', {streams: req.session.desiredStream}, function(err, docs) {
            if (!err && docs) {
                _.each(docs, function(objType){
                    req.usedActorObjectTypes.push(objType);
                });
                next();
            } else {
                next(new Error('Failed to fetch actorobjTypes'));
            }
        });
};

function getDistinctStreams(req, res, next){
    req.session.desiredStream = req.params.streamName ? req.params.streamName : "firehose";
    req.streams = {}
    asmsDB.Activity.distinct('streams', {}, function(err, docs) {
        if (!err && docs) {
            _.each(docs, function(stream){
                req.streams[stream] = {name: stream, items: []};
            });
            next();
        } else {
            next(new Error('Failed to fetch streams'));
        }
    });
}

// Routing
app.get('/', loadUser, getDistinctStreams, getDistinctVerbs, getDistinctActorObjectTypes, getDistinctObjects,
    getDistinctActors, getDistinctObjectTypes, getMetaData, function(req, res) {

    asmsDB.getActivityStreamFirehose(20, function (err, docs) {
        var activities = [];
        if (!err && docs) {
            activities = docs;

            console.dir(docs);
        }
        req.streams.firehose.items = activities;

        var data = {
            currentUser: req.user,
            providerFavicon: req.providerFavicon,
            streams : req.streams,
            desiredStream : req.session.desiredStream,
            objectTypes : req.objectTypes,
            actorTypes : req.actorTypes,
            verbs: req.verbs,
            usedVerbs: req.usedVerbs,
            usedObjects: req.usedObjects,
            usedObjectTypes: req.usedObjectTypes,
            usedActorObjectTypes: req.usedActorObjectTypes,
            usedActors: req.usedActors
        };
        if (req.is('json')) {
            res.json(data);

        } else {
           res.render('index', data);
        }
    });

});

app.post('/photos', loadUser, function(req, res, next){
    if (req.files.image) {
        im.identify(req.files.image.path, function(err, features){
          var guid = Guid.create();
          var fileId = guid + '/' + req.files.image.name;
          var gs = asmsDB.mongoose.mongo.GridStore(realMongoDB, fileId, "w", {
                content_type : req.files.image.type,
                metadata : {
                    author: req.user,
                    public : false,
                    features: features,
                    filename: req.files.image.name,
                    path: req.files.image.path,
                    size_kb: req.files.image.size / 1024 | 0
                }
            });
            gs.writeFile(req.files.image.path, function(err, doc){
                if (err) {
                  console.log("Got an error trying to save photo with id: " + fileId);
                  console.dir(err);
                  res.status(500);
                  res.send('');
                } else {
                  res.status(201);
                  res.json({url : siteConf.uri + "/photos/" + fileId, metadata: gs.metadata});
                  // TODO: Store url in users photo colllection
            }
            });

            console.log("Using ImageMagick got features ")
            console.dir(features)
        })
    } else {
        res.status(401);
        res.json({error : "Could not find the file"});
    }
});

app.get('/photos/:guid/:fileId', function(req, res) {
   // Fetch the content
    var fileId = req.params.guid + '/' + req.params.fileId;

    // TODO Check if current user allowed to see photo
    var gs = new asmsDB.mongoose.mongo.GridStore(realMongoDB, fileId, "r");
    gs.open(function(err1, gs) {
        if (err1) {
            console.log("Got an error trying to open photo with id: " + fileId);
            console.dir(err1);
            res.status(404);
            res.json({error: err1});
        } else {
            gs.seek(0, function() {
                gs.read(function(err, data) {
                    if (err) {
                        console.log("Got an error trying to read photo with id: " + fileId);
                        console.dir(err);
                        res.status(500);
                        res.json({error: err});
                    } else {
                        res.writeHead('200', {'Content-Type': gs.content_type});
                        res.end(data, 'binary');
                    }
                });
            });
        }
    });
});

app.get('/streams/:streamName', loadUser, getDistinctStreams, getDistinctVerbs, getDistinctObjects, getDistinctActors,
    getDistinctObjectTypes, getDistinctActorObjectTypes, getDistinctVerbs, getMetaData, function(req, res) {

    asmsDB.getActivityStream(req.params.streamName, 20, function (err, docs) {
        var activities = [];
        if (!err && docs) {
            activities = docs;
        }
        req.streams[req.params.streamName].items = activities;
        var data = {
            currentUser: req.user,
            providerFavicon: req.providerFavicon,
            streams : req.streams,
            desiredStream : req.session.desiredStream,
            actorTypes: req.actorTypes,
            objectTypes : req.objectTypes,
            verbs: req.verbs,
            usedVerbs: req.usedVerbs,
            usedObjects: req.usedObjects,
            usedObjectTypes: req.usedObjectTypes,
            usedActorObjectTypes: req.usedActorObjectTypes,
            usedActors: req.usedActors
        };
        if (req.is('json')) {
            res.json(data);

        } else {
           res.render('index', data);
        }
    });

});

app.get('/user', loadUser, function(req, res) {
    res.json(req.user);
});

app.get('/metadata', getMetaData, function(req, res){
    var data = {
        actorTypes: req.actorTypes,
        objectTypes : req.objectTypes,
        verbs: req.verbs
    };
    res.json(data);
});


// Initiate this after all other routing is done, otherwise wildcard will go crazy.
var dummyHelpers = new DummyHelper(app);

// If all fails, hit em with the 404
app.all('*', function(req, res){
	throw new NotFound;
});

console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+siteConf.uri);


