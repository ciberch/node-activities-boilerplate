# node-activities-boilerplate

`node-activities-boilerplate` is a fork of [node-express-boilerplate](https://github.com/mape/node-express-boilerplate) which is a simple express boilerplate app which does SSO using `Facebook`, `Twitter` and `GitHub`

Instead of raw messaging back and forth between clients and server, `node-activities-boilerplate` uses [activitystrea.ms](http://activitystrea.ms/) to send well structured messages(activities) and
aggregate them in an Activities MongoDB collection. It also uses Redis' PubSub to notify clients in real time of what changes are happening in the db and has client side logic to update the UI appropriately.
This functionality is delivered via the package [activity-streams-mongoose](https://github.com/cloudfoundry-samples/activity-streams-mongoose)

### New Features include:

* Bootstrap as the foundation css
* Jade Templates which are executable server-side and client-side
* New Social Networking Look
* Persistence of activities and streams to MongoDB
* Real time syndication of stream data using Redis

### Core Features include:

* Bundling [socket.io](http://socket.io/) and integrating with the [express](https://github.com/visionmedia/express) session store so data can be shared
* Providing pre-made hooks to [authenticate](https://github.com/bnoguchi/everyauth) users via facebook/twitter/github
* An [assetmanager](https://github.com/mape/connect-assetmanager/) that concatenates/mangles/compresses your CSS/JS assets to be as small and fast to deliver as possible, as well as cache busting using MD5 hashes
* Auto updates of the browser (inline/refresh) as soon as CSS/JS/template-files are changed in order to remove all those annoying “save, tab, refresh” repetitions
* [Notifications](http://notifo.com/) to your computer/mobile phone on certain user actions
* Sane defaults in regards to productions/development environments
* Logs errors to [Airbrakeapp.com](http://airbrakeapp.com/pages/home) in order to track any errors users are encountering
* Auto matching of urls to templates without having to define a specific route (such as, visiting /file-name/ tries to serve file-name.ejs and fallbacks to index.ejs - this is helpful for quick static info pages)

## Install on dev machine

``` bash
git clone https://github.com/mape/node-express-boilerplate <myproject>
cd <myproject>
npm install
```

* Edit siteConfig.js if needed
* Run locally

``` bash
node server.js
```

## Install on CloudFoundry
* Install vmc if you have not already done so

``` bash
sudo gem install vmc --pre
```

* Edit manifest.yml to have a unique name for your app. Replace "asms" with a name you want

* Deploy the app to Cloud Foundry

``` bash
  vmc push --nostart
```

## Get keys for all social netwOrks and services
### Build your Facebook App at
- https://developers.facebook.com/apps
- Add your app url to the Facebook App Domain list

### Build your Twitter App at
- https://dev.twitter.com/apps/new
- Use callback url http://your-app-name.cloudfoundry.com/auth/twitter/callback

### Build Github App at
- https://github.com/settings/applications/new
- Use callback http://your-app-name.cloudfoundry.com/auth/github/callback

* Run this command with your keys

``` bash
export APP_NAME=<your_name>
vmc env-add $APP_NAME airbrake_api_key=your_key
vmc env-add $APP_NAME github_client_id=github_id
vmc env-add $APP_NAME github_client_secret=github_secret
vmc env-add $APP_NAME facebook_app_id=fb_id
vmc env-add $APP_NAME facebook_app_secret=fb_secret
vmc env-add $APP_NAME NODE_ENV=production
vmc env-add $APP_NAME twitter_consumer_key=twitter_key
vmc env-add $APP_NAME twitter_consumer_secret=twitter_secret
```

## Finally

``` bash
  vmc start
```
