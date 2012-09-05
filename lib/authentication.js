module.exports = function Server(streamLib, siteConf) {
    var https = require('https');
    var everyauth = require('everyauth');
    var types = streamLib.types;

    var mongoose = require("mongoose")
        , Schema = mongoose.Schema
        , mongooseAuth = require('mongoose-auth')
      , User;

    types.UserSchema.plugin(mongooseAuth, {
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
                    return streamLib.asmsDB.User;
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

	// Fetch and format data so we have an easy object with user data to work with.
	function normalizeUserData() {
		function handler(req, res, next) {

			if (req.session && !req.session.user && req.session.auth && req.session.auth.loggedIn) {
				var user = req.user ? req.user : {};

                if (!user.image && !user.displayName) {
                    if (req.session.auth.github && req.session.auth.github.user) {
                        user.image = 'http://1.gravatar.com/avatar/'+req.session.auth.github.user.gravatar_id+'?s=48';
                        user.displayName = req.session.auth.github.user.name;
                        user.id = 'github-'+req.session.auth.github.user.id;
                    }
                    if (req.session.auth.twitter && req.session.auth.twitter.user) {
                        user.image = req.session.auth.twitter.user.profile_image_url;
                        user.displayName = req.session.auth.twitter.user.name;
                        user.id = 'twitter-'+req.session.auth.twitter.user.id_str;
                    }
                    if (req.session.auth.facebook) {
                        user.image = req.session.auth.facebook.user.picture;
                        user.displayName = req.session.auth.facebook.user.name;
                        user.id = 'facebook-'+req.session.auth.facebook.user.id;

                        // Need to fetch the users image...
                        https.get({
                            'host': 'graph.facebook.com'
                            , 'path': '/me/picture?access_token='+req.session.auth.facebook.accessToken
                        }, function(response) {
                            user.image = response.headers.location;
                            if (user.save) {
                                user.save(function(err){
                                   if (err) {
                                       next(err);
                                   } else {
                                       console.log("Saved.");
                                   }
                                });
                            }
                            req.session.user = user;
                            next();
                        }).on('error', function(e) {
                            req.session.user = user;
                            next();
                        });
                        return;
                    }

                    if (user.save) {
                        user.save(function(err){
                           if (err) {
                               next(err);
                           } else {
                               console.log("Saved User in normalize ************************ 2");
                           }
                        });
                    }
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