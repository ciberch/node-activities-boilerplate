// Fetch the site configuration
var siteConf = require('./lib/getConfig');
var _ = require('underscore')._;

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

var mongoose = require('mongoose');
mongoose.connect(siteConf.mongoUrl);

// Session store
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore(siteConf.redisOptions);

var asmsDB = require('activity-streams-mongoose')(mongoose, {full: false, redis: siteConf.redisOptions, defaultActor: '/img/default.png'});

var thisApp = {displayName: 'Activity Streams App', url: siteConf.uri, image:{url: '/img/as-logo-sm.png'}};

// A quick test
var target = new asmsDB.ActivityObject({displayName: "Cloud Foundry" , url: "http://www.cloudfoundry.com"});
target.save(function (err) {
    if (err === null) {
        var startAct = new asmsDB.Activity(
            {
            actor: {displayName: siteConf.user_email, image:{url: "img/me.jpg"}},
            verb: 'start',
            object: thisApp,
            title: "started the app",
            target: target._id
            });

        asmsDB.publish('firehose', startAct);
    }
});

var app = module.exports = express.createServer();
app.listen(siteConf.internal_port, null);
app.asmsDB = asmsDB;
app.siteConf = siteConf;
app.thisApp = thisApp;

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
		'store': sessionStore
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

function loadUser(req, res, next) {
	if (!req.session.uid) {
		req.session.uid = (0 | Math.random()*1000000);
	} else if (req.session.auth){
       if (req.session.auth.github)
        req.providerFavicon = '//github.com/favicon.ico';
       else if (req.session.auth.twitter)
        req.providerFavicon = '//twitter.com/favicon.ico';
       else if (req.session.auth.facebook)
        req.providerFavicon = '//facebook.com/favicon.ico';
    }
    next();
}

function getDistinctStreams(req, res, next){
    req.streams = {}
    asmsDB.Activity.distinct('streams', {}, function(err, docs) {
        if (!err && docs) {
            _.each(docs, function(stream){
                req.streams[stream] = {name: stream, items: []};
            });

            console.log("Fetched all streams *******");
            console.dir(req.streams);
            next();
        } else {
            next(new Error('Failed to fetch streams'));
        }
    });
}

// Routing
app.get('/', loadUser, getDistinctStreams, function(req, res) {
    req.session.desiredStream = "firehose";

    asmsDB.getActivityStreamFirehose(20, function (err, docs) {
        var activities = [];
        if (!err && docs) {
            activities = docs;
        }
        req.streams.firehose.items = activities;
        res.render('index', {'providerFavicon': req.providerFavicon, 'streams' : req.streams});
    });

});

app.get('/streams/:streamName', loadUser, getDistinctStreams, function(req, res) {
    req.session.desiredStream = req.params.streamName;

    asmsDB.getActivityStream(req.params.streamName, 20, function (err, docs) {
        var activities = [];
        if (!err && docs) {
            activities = docs;
        }
        req.streams[req.params.streamName].items = activities;
        res.render('index', {'providerFavicon': req.providerFavicon, 'streams' : req.streams});
    });

});

// Initiate this after all other routing is done, otherwise wildcard will go crazy.
var dummyHelpers = new DummyHelper(app);

// If all fails, hit em with the 404
app.all('*', function(req, res){
	throw new NotFound;
});

console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+siteConf.uri);


