var cf = require('cloudfoundry');
var settings = {
    'user_email' : 'mwilkinson@vmware.com',
    'user' : {
        'name' : 'Monica Wilkinson',
        'website' : 'http://ciberch.cloudfoundry.com'
    },
	'sessionSecret': 'sessionSecret'
    , 'internal_host' : '127.0.0.1'
    , 'internal_port' : 8080
	, 'port': 8080
	, 'uri': 'http://moni-air.local:8080' // Without trailing /
    , 'redisOptions': {host: '127.0.0.1', port: 6379}
    , 'mongoUrl': 'mongodb://localhost/mongodb-asms'
	// You can add multiple recipients for notifo notifications
	, 'notifoAuth': null /*[
		{
			'username': ''
			, 'secret': ''
		}
	]*/


	// Enter API keys to enable auth services, remove entire object if they aren't used.
	, 'external': {
		'facebook': {
			appId: process.env.facebook_app_id,
			appSecret: process.env.facebook_app_secret
		}
		, 'twitter': {
			consumerKey: process.env.twitter_consumer_key,
			consumerSecret: process.env.twitter_consumer_secret
		}
		, 'github': {
			appId: process.env.github_client_id,
			appSecret: process.env.github_client_secret
		}
	}

	, 'debug': cf.cloud
};

console.log("ENV for new CF is");
console.dir(process.env);

if (cf.cloud) {
	settings.uri = 'http://' + cf.app.name + '.cfapps.io';
    settings.internal_host = cf.host;
    settings.internal_port = cf.port;
	settings.port = 80; // CloudFoundry uses process.env.VMC_APP_PORT

	settings.airbrakeApiKey = process.env.airbrake_api_key; // Error logging, Get free API key from https://airbrakeapp.com/account/new/Free

    var redisCloud = 'rediscloud-n/a', redisConfig;

    if (cf.redis['redis-asms'] != null) {
        redisConfig = cf.redis['redis-asms'].credentials;

    } else if (cf.services[redisCloud] && cf.services[redisCloud].length == 1) {
        console.log("Using Redis Cloud");
        svc = cf.services[redisCloud][0];
        redisConfig = svc['credentials'];
    }

    if (redisConfig) {
        settings.redisOptions.port = redisConfig.port;
        settings.redisOptions.host = redisConfig.hostname;
        settings.redisOptions.pass = redisConfig.password;
        console.log("Redis options are");
        console.dir(settings.redisOptions);
    }

    var mongolab = 'mongolab-n/a'; // Cloud Foundry v2.0

    if (cf.mongodb['mongo-asms']) {
        var cfg = cf.mongodb['mongo-asms'].credentials;
        settings.mongoUrl = ["mongodb://", cfg.username, ":", cfg.password, "@", cfg.hostname, ":", cfg.port,"/" + cfg.db].join('');
    } else if (cf.services[mongolab] && cf.services[mongolab].length == 1) {
        console.log("Using MongoLab");
        var svc = cf.services[mongolab][0];
        settings.mongoUrl = svc['credentials']['uri'];
    } else {
        console.log("Could not find a MongoDB :(")
        console.dir(cf.services);
    }
    settings.user_email = cf.app['users'][0];
}
module.exports = settings;