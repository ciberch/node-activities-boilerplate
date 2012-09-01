module.exports = function Server(expressInstance, siteConf) {
    var https = require('https');
    var mongoose = require("mongoose")
        , Schema = mongoose.Schema
        , mongooseAuth = require('mongoose-auth')
        , UserSchema = new Schema({
            roles: [String],
            photos: [String],
            streams_followed: [String]
        })
      , User;

    UserSchema.plugin(mongooseAuth, {
            facebook: {
                everyauth: {
                    myHostname: siteConf.uri
                  , appId: siteConf.external.facebook.appId
                  , appSecret: siteConf.external.facebook.appSecret
                  , redirectPath: '/'
                }
            },
            twitter: {
                everyauth: {
                    myHostname: siteConf.uri
                  , consumerKey: siteConf.external.twitter.consumerKey
                  , consumerSecret: siteConf.external.twitter.consumerSecret
                  , redirectPath: '/'
                }
            },
            github: {
                everyauth: {
                    myHostname: siteConf.uri
                  , appId: siteConf.external.github.appId
                  , appSecret: siteConf.external.github.appSecret
                  , redirectPath: '/'
                }
            },
            // Here, we attach your User model to every module
            everymodule: {
              everyauth: {
                  User: function () {
                    return User;
                  },
                  handleLogout: function (req, res) {
                    delete req.session.user;
                    req.logout();
                    res.writeHead(303, { 'Location': this.logoutRedirectPath() });
                    res.end();
                  }
              }
            }
        }
    );

    mongoose.model('User', UserSchema);

    mongoose.connect(siteConf.mongoUrl);

    User = mongoose.model('User');


	// Fetch and format data so we have an easy object with user data to work with.
	function normalizeUserData() {
		function handler(req, res, next) {
            console.log("In normalizeUserData **************");

			if (req.session && !req.session.user && req.session.auth && req.session.auth.loggedIn) {
                console.log("Logged in a user");
                console.dir(req.session.auth);
				var user = {};
				if (req.session.auth.github) {
					user.image = 'http://1.gravatar.com/avatar/'+req.session.auth.github.user.gravatar_id+'?s=48';
					user.name = req.session.auth.github.user.name;
					user.id = 'github-'+req.session.auth.github.user.id;
				}
				if (req.session.auth.twitter) {
					user.image = req.session.auth.twitter.user.profile_image_url;
					user.name = req.session.auth.twitter.user.name;
					user.id = 'twitter-'+req.session.auth.twitter.user.id_str;
				}
				if (req.session.auth.facebook) {
					user.image = req.session.auth.facebook.user.picture;
					user.name = req.session.auth.facebook.user.name;
					user.id = 'facebook-'+req.session.auth.facebook.user.id;

					// Need to fetch the users image...
					https.get({
						'host': 'graph.facebook.com'
						, 'path': '/me/picture?access_token='+req.session.auth.facebook.accessToken
					}, function(response) {
						user.image = response.headers.location;
						req.session.user = user;
						next();
					}).on('error', function(e) {
						req.session.user = user;
						next();
					});
					return;
				}
				req.session.user = user;
			}
			next();
		}
		return handler;
	}

	return {
		'middleware': {
			'mongooseAuth': mongooseAuth.middleware
			, 'normalizeUserData': normalizeUserData
		}
	};
};