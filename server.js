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
var app = module.exports = express.createServer();

app.siteConf = siteConf;
app.cookieName = "jsessionid"; //Hack to have sticky sessions. Default connect name is 'connect.sid';

// Setup the Schema and Auth
var asmsClient = new require('./lib/asms-client.js')(app, cf);
app.asmsClient = asmsClient;

app.listen(siteConf.internal_port, null);

// Setup socket.io server
var socketIo = new require('./lib/socket-io-server.js')(app, sessionStore);

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
            , 'backbone/activity_create_view.js'
            , 'backbone/views.js'
            , 'jquery.cookie.js'
            , 'jquery.form.js'
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
	app.use(asmsClient.authentication.middleware.mongooseAuth());
	app.use(asmsClient.authentication.middleware.normalizeUserData());
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

function getDistinctVerbs(req, res, next){
    asmsClient.helpers.getDistinct(req, res, next, 'verb');
};

function getDistinctActors(req, res, next){
    asmsClient.helpers.getDistinct(req, res, next, 'actor');
};

function getDistinctObjects(req, res, next){
    asmsClient.helpers.getDistinct(req, res, next, 'object', ['none']);
};

function getDistinctObjectTypes(req, res, next){
    asmsClient.helpers.getDistinct(req, res, next, 'object.object.type', ['none']);
};

function getDistinctActorObjectTypes(req, res, next){
    asmsClient.helpers.getDistinct(req, res, next, 'actor.object.type', ['none']);
};

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
    req.actorTypes = asmsClient.metadata.actorTypes;
    req.objectTypes = asmsClient.metadata.objectTypes;
    req.verbs = asmsClient.metadata.verbs;
    next();
};

function loadUser(req, res, next) {
    if (!req.session.uid) {
        req.session.uid = Guid.create();
    }
    req.user = app.asmsClient.helpers.getCurrentUserObject(req.session);
    next();
}


var sizes = [{name : 'sm', width : 256},{name : 'xs', 'width' : 60}]

function reducePhoto(req, res, next){
    var photoIngested = req.photosUploaded['original'];
    if (photoIngested) {
        var sizeName = sizes[req.nextSizeIndex].name;
        var destPath = photoIngested.metadata.path + '-' + sizeName ;
        var nameParts = photoIngested.metadata.filename.split('.');
        var newName = nameParts[0] + '-' + sizeName + '.' + nameParts[1];
        var width = sizes[req.nextSizeIndex].width;

        im.resize({
          srcPath: photoIngested.metadata.path,
          dstPath: destPath,
          width:   width
        }, function(err, stdout, stderr){
          if (err) {
              next(err);
          } else {
            console.log("The photo was resized to " + width + "px wide");
            var guid = Guid.create();
            var fileId = guid + '/' + newName;
            var ratio = photoIngested.metadata.width / width;
            var height = photoIngested.metadata.height / ratio;
            var gs = asmsClient.streamLib.GridStore(asmsClient.streamLib.realMongoDB, fileId, "w", {
                  content_type : req.files.image.type,
                  metadata : {
                      author: req.session.user._id,
                      public : false,
                      filename: newName,
                      width: width,
                      height: height,
                      path: destPath
                  }
              });
              gs.writeFile(destPath, function(err, doc){
                  if (err) {
                    next(err);
                  } else {
                      var url = siteConf.uri + "/photos/" + fileId;
                      req.photosUploaded[sizeName] = {url : url, metadata: gs.metadata};
                      req.nextSizeIndex = req.nextSizeIndex + 1;
                      next();
                  }
              });
          }
        });
    }
};

function ingestPhoto(req, res, next){
    if (req.files.image) {
        im.identify(req.files.image.path, function(err, features){
            if (features && features.width) {
                var guid = Guid.create();
                var fileId = guid + '/' + req.files.image.name;
                var gs = asmsClient.streamLib.GridStore(asmsClient.streamLib.realMongoDB, fileId, "w", {
                    content_type : req.files.image.type,
                    metadata : {
                        author: req.session.user._id,
                        public : false,
                        filename: req.files.image.name,
                        path: req.files.image.path,
                        width: features.width,
                        height: features.height,
                        format: features.format,
                        size_kb: req.files.image.size / 1024 | 0
                    }
                });
                gs.writeFile(req.files.image.path, function(err, doc){
                    if (err) {
                      next(err);
                    } else {
                        if (! req.photosUploaded) {
                            req.photosUploaded = {};
                        }
                        var url = siteConf.uri + "/photos/" + fileId;
                        req.photosUploaded['original'] = {url : url, metadata: gs.metadata};
                        req.nextSizeIndex = 0;
                        next();
                    }
                });
            } else {
                if (err) throw err;
                throw(new Error("Cannot get width for photo"));
            }
        });
    } else {
        next(new Error("Could not find the file"));
    }
};

function getDistinctStreams(req, res, next){
    req.session.desiredStream = req.params.streamName ? req.params.streamName : "firehose";
    req.streams = {}
    asmsClient.asmsDB.Activity.distinct('streams', {}, function(err, docs) {
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

    asmsClient.asmsDB.Activity.getFirehose(20, function (err, docs) {
        var activities = [];
        if (!err && docs) {

            activities = docs;
        } else {
            throw err;
        }
        req.streams.firehose = {name: 'firehose', items: activities}

        var data = {
            currentUser: req.user,
            streams : req.streams,
            desiredStream : req.session.desiredStream,
            objectTypes : req.objectTypes,
            actorTypes : req.actorTypes,
            verbs: req.verbs,
            usedVerbs: req['used.verb'],
            usedObjects: req['used.object'],
            usedObjectTypes: req['used.object.type'],
            usedActorObjectTypes: req['used.actor.object.type'],
            usedActors: req['used.actor']
        };

        if (req.is('json')) {
            res.json(data);

        } else {
           res.render('index', data);
        }
    });

});

app.post('/photos', loadUser, ingestPhoto, reducePhoto, reducePhoto, function(req, res, next){
    if (!req.session.auth) {
        res.status('401');
        res.send();
    } else {
        if (req.photosUploaded) {
            res.status(201);
            if (req.session.user) {

                asmsClient.asmsDB.User.findOne(req.session.user._id, function(err, doc) {
                    if (err) {
                        next(err);
                    } else {
                        if (_.isUndefined(doc.photos)) {
                            doc.photos = [];
                        }
                        var aoHash = {
                            author: doc,
                            objectType : 'image',
                            url: req.photosUploaded.original.url,
                            displayName : req.photosUploaded.original.metadata.filename,
                            image: {
                                url:req.photosUploaded.sm.url,
                                width: req.photosUploaded.sm.metadata.width,
                                height: req.photosUploaded.sm.metadata.height
                            },
                            fullImage : {
                                url: req.photosUploaded.original.url,
                                width: req.photosUploaded.original.metadata.width,
                                height: req.photosUploaded.original.metadata.height
                            },
                            thumbnail : {
                                url: req.photosUploaded.xs.url,
                                width: req.photosUploaded.xs.metadata.width,
                                height: req.photosUploaded.xs.metadata.height
                            }
                        };
                        var ao = new asmsClient.asmsDB.ActivityObject(aoHash);
                        ao.save(function(err, imageDoc){
                            doc.photos.push(imageDoc._id);

                            doc.save(function(err2) {
                                if (err2) {
                                    next(err2);
                                } else {
                                    var act = new asmsDB.Activity({
                                        verb: 'post',
                                        actor: doc,
                                        title: 'posted a photo',
                                        object: aoHash
                                    });
                                    act.publish('personal');
                                    res.json(act);
                                }
                            });
                        });


                }
            });
            } else {
                res.json(req.photosUploaded);
            }
        } else {
            res.status(500);
            console.log("Error uploading photo due to ");
            console.dir(req);
            res.json({error: "Couldn't upload photo"});
        }
    }

});

app.get('/photos/:guid/:fileId', function(req, res) {
   // Fetch the content
    var fileId = req.params.guid + '/' + req.params.fileId;

    // TODO Check if current user allowed to see photo
    var gs = new asmsClient.streamLib.GridStore(asmsClient.streamLib.realMongoDB, fileId, "r");
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

        asmsClient.asmsDB.Activity.getStream(req.params.streamName, 20, function (err, docs) {
        var activities = [];
        if (!err && docs) {
            activities = docs;
        } else {
            throw err;
        }
        req.streams[req.params.streamName].items = activities;
        var data = {
            currentUser: req.user,
            streams : req.streams,
            desiredStream : req.session.desiredStream,
            actorTypes: req.actorTypes,
            objectTypes : req.objectTypes,
            verbs: req.verbs,
            usedVerbs: req['used.verb'],
            usedObjects: req['used.object'],
            usedObjectTypes: req['used.object.type'],
            usedActorObjectTypes: req['used.actor.object.type'],
            usedActors: req['used.actor']
        };
        if (req.is('json')) {
            res.json(data);

        } else {
           res.render('index', data);
        }
    });

});

app.get('/me', loadUser, function(req, res) {
    res.json(asmsClient.helpers.getCurrentUserObject(req.session));
    //res.json(req.session.user);
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

var startAct = new asmsClient.asmsDB.Activity({
    actor: asmsClient.default.owner,
    verb: 'start',
    object: asmsClient.default.instance,
    target: asmsClient.default.app._id,
    title: "started"
});

startAct.publish('firehose');


