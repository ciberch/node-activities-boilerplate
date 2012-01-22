var cf = require('cloudfoundry');
var settings = {
	'sessionSecret': 'sessionSecret'
    , 'host' : '127.0.0.1'
	, 'port': 8080
	, 'uri': 'http://moni-air.local:8080' // Without trailing /
    , 'redisOptions': new Object
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

if (cf.cloud) {
	settings.uri = 'http://asms.cloudfoundry.com';
    settings.host = cf.host;
	settings.port = cf.port  || 80; // CloudFoundry uses process.env.VMC_APP_PORT

	settings.airbrakeApiKey = process.env.airbrake_api_key; // Error logging, Get free API key from https://airbrakeapp.com/account/new/Free

    if (cf.redis['redis-asms'] != null) {
        var redisConfig = cf.redis['redis-asms'].credentials;
        settings.redisOptions.port = redisConfig.port;
        settings.redisOptions.host = redisConfig.hostname;
        settings.redisOptions.pass = redisConfig.password;
    }
}
module.exports = settings;