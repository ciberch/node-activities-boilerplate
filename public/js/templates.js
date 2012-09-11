
var jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  } 
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context); 

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno 
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});
jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["actions"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') + ' ' + ('actions') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-warning') + ' ' + ('like-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-ok') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Like</small></a></small></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') + ' ' + ('right') }, {}));
buf.push('><textarea');
buf.push(attrs({ "class": ('span4') + ' ' + ('comment-area') }, {}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('comment-post'), "class": ('span2') + ' ' + ('offset3') + ' ' + ('right') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-success') + ' ' + ('comment-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-pencil') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Post</small></a></small></div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('action_results') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('>');
if (act.likes_count && act.likes_count > 0) {
{
buf.push('<small');
buf.push(attrs({ 'id':('like_count') }, {}));
buf.push('>' + escape((interp = act.likes_count) == null ? '' : interp) + '</small><small');
buf.push(attrs({ "class": ('rest') }, {}));
buf.push('>&nbsp; liked this</small>');
}
}
buf.push('</div>');
if (act.comments) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span4') }, {}));
buf.push('><ul>');
for(var i=0; i < act.comments.length; i++) {
 var comment = comments[i];
{
buf.push('<li><div');
buf.push(attrs({ "class": ('row') + ' ' + ('comment') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = comment.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = comment.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = comment.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = comment;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div></li>');
}
 }
buf.push('</ul></div>');
}
buf.push('</div>');
 }
}
return buf.join("");
}
jade.templates["activity"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
// iterate activities
;(function(){
  if ('number' == typeof activities.length) {
    for (var $index = 0, $$l = activities.length; $index < $$l; $index++) {
      var act = activities[$index];

 if (!act.object) continue;
 var objType = " objectType-" + (act.object.objectType ? act.object.objectType : 'none');
 var actorType = " actorType-" + (act.actor.objectType ? act.actor.objectType : 'none');
 var className = "verb-" + act.verb + objType+actorType;
buf.push('<li');
buf.push(attrs({ "class": (className) }, {"class":true}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = act.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = act.actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = act.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = act.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = act;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('actions') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-warning') + ' ' + ('like-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-ok') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Like</small></a></small></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') + ' ' + ('right') }, {}));
buf.push('><textarea');
buf.push(attrs({ "class": ('span4') + ' ' + ('comment-area') }, {}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('comment-post'), "class": ('span2') + ' ' + ('offset3') + ' ' + ('right') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-success') + ' ' + ('comment-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-pencil') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Post</small></a></small></div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('action_results') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('>');
if (act.likes_count && act.likes_count > 0) {
{
buf.push('<small');
buf.push(attrs({ 'id':('like_count') }, {}));
buf.push('>' + escape((interp = act.likes_count) == null ? '' : interp) + '</small><small');
buf.push(attrs({ "class": ('rest') }, {}));
buf.push('>&nbsp; liked this</small>');
}
}
buf.push('</div>');
if (act.comments) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span4') }, {}));
buf.push('><ul>');
for(var i=0; i < act.comments.length; i++) {
 var comment = comments[i];
{
buf.push('<li><div');
buf.push(attrs({ "class": ('row') + ' ' + ('comment') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = comment.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = comment.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = comment.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = comment;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div></li>');
}
 }
buf.push('</ul></div>');
}
buf.push('</div>');
 }
buf.push('</li>');
    }
  } else {
    for (var $index in activities) {
      var act = activities[$index];

 if (!act.object) continue;
 var objType = " objectType-" + (act.object.objectType ? act.object.objectType : 'none');
 var actorType = " actorType-" + (act.actor.objectType ? act.actor.objectType : 'none');
 var className = "verb-" + act.verb + objType+actorType;
buf.push('<li');
buf.push(attrs({ "class": (className) }, {"class":true}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = act.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = act.actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = act.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = act.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = act;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('actions') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-warning') + ' ' + ('like-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-ok') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Like</small></a></small></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') + ' ' + ('right') }, {}));
buf.push('><textarea');
buf.push(attrs({ "class": ('span4') + ' ' + ('comment-area') }, {}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('comment-post'), "class": ('span2') + ' ' + ('offset3') + ' ' + ('right') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-success') + ' ' + ('comment-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-pencil') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Post</small></a></small></div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('action_results') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('>');
if (act.likes_count && act.likes_count > 0) {
{
buf.push('<small');
buf.push(attrs({ 'id':('like_count') }, {}));
buf.push('>' + escape((interp = act.likes_count) == null ? '' : interp) + '</small><small');
buf.push(attrs({ "class": ('rest') }, {}));
buf.push('>&nbsp; liked this</small>');
}
}
buf.push('</div>');
if (act.comments) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span4') }, {}));
buf.push('><ul>');
for(var i=0; i < act.comments.length; i++) {
 var comment = comments[i];
{
buf.push('<li><div');
buf.push(attrs({ "class": ('row') + ' ' + ('comment') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = comment.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = comment.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = comment.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = comment;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div></li>');
}
 }
buf.push('</ul></div>');
}
buf.push('</div>');
 }
buf.push('</li>');
   }
  }
}).call(this);

}
return buf.join("");
}
jade.templates["activity_create"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><h3>Share something...</h3></div></div><div');
buf.push(attrs({ 'id':('new_activity') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('user-box') + ' ' + ('span1') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("#"), 'rel':("tooltip"), 'title':("" + (locals.currentUser.displayName) + "") }, {"href":true,"rel":true,"title":true}));
buf.push('><img');
buf.push(attrs({ 'src':("" + (locals.currentUser.image.url) + ""), "class": ('avatar-small') + ' ' + ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/><div');
buf.push(attrs({ "class": ('clearfix') }, {}));
buf.push('></div></a></div><div');
buf.push(attrs({ "class": ('span5') + ' ' + ('large-text') }, {}));
buf.push('>Did you&nbsp;<span');
buf.push(attrs({ 'id':('verb'), "class": ('btn-group') }, {}));
buf.push('><a');
buf.push(attrs({ 'data-toggle':("dropdown"), "class": ('btn') + ' ' + ('btn-info') + ' ' + ('dropdown-toggle') }, {"data-toggle":true}));
buf.push('><span');
buf.push(attrs({ 'id':('verb-show') }, {}));
buf.push('>');
var __val__ = chosenVerb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('>');
// iterate locals.verbs
;(function(){
  if ('number' == typeof locals.verbs.length) {
    for (var $index = 0, $$l = locals.verbs.length; $index < $$l; $index++) {
      var verb = locals.verbs[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("verb-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
    }
  } else {
    for (var $index in locals.verbs) {
      var verb = locals.verbs[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("verb-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
   }
  }
}).call(this);

buf.push('</ul></span>&nbsp;a new&nbsp;<span');
buf.push(attrs({ 'id':('objectType'), "class": ('btn-group') }, {}));
buf.push('><a');
buf.push(attrs({ 'data-toggle':("dropdown"), "class": ('btn') + ' ' + ('btn-info') + ' ' + ('dropdown-toggle') }, {"data-toggle":true}));
buf.push('><span');
buf.push(attrs({ 'id':('object-show') }, {}));
buf.push('>');
var __val__ = chosenObject
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('>');
// iterate locals.objectTypes
;(function(){
  if ('number' == typeof locals.objectTypes.length) {
    for (var $index = 0, $$l = locals.objectTypes.length; $index < $$l; $index++) {
      var objectType = locals.objectTypes[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("object-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = objectType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
    }
  } else {
    for (var $index in locals.objectTypes) {
      var objectType = locals.objectTypes[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("object-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = objectType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
   }
  }
}).call(this);

buf.push('</ul></span>&nbsp;?</div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('specific-activity-input') }, {}));
buf.push('></div></div><div');
buf.push(attrs({ 'id':('finish'), "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span10') + ' ' + ('offset2') }, {}));
buf.push('><span');
buf.push(attrs({ "class": ('large-text') }, {}));
buf.push('>Final Step:&nbsp;</span><button');
buf.push(attrs({ 'id':('send-message'), "class": ('btn') + ' ' + ('btn-success') }, {}));
buf.push('>Publish</button>&nbsp;the activity to the&nbsp;<span');
buf.push(attrs({ "class": ('input-prepend') }, {}));
buf.push('><span');
buf.push(attrs({ "class": ('add-on') }, {}));
buf.push('>#</span><input');
buf.push(attrs({ 'id':('streamName'), 'type':("text"), 'value':(locals.desiredStream), "class": ('span2') + ' ' + ('prepend-fix') }, {"type":true,"value":true}));
buf.push('/></span></div></div></div>');
}
return buf.join("");
}
jade.templates["activity_details"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
}
return buf.join("");
}
jade.templates["activity_object"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div>');
}
return buf.join("");
}
jade.templates["activity_stream_actor"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
}
return buf.join("");
}
jade.templates["application"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') + ' ' + ('offset1') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('input-title'), 'type':("text"), 'placeholder':("What is it called ?"), 'id':('title'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><textarea');
buf.push(attrs({ 'placeholder':("What does it do?"), 'id':('msg'), "class": ('span8') }, {"placeholder":true}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'type':("text"), 'placeholder':("What is it's url ?"), 'id':('url'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('includeLocation'), 'type':("checkbox") }, {"type":true}));
buf.push('/><span>Include Location ?</span></label></div></div><div');
buf.push(attrs({ 'id':('map'), "class": ('hide') }, {}));
buf.push('></div></div></div>');
}
return buf.join("");
}
jade.templates["article"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') + ' ' + ('offset1') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('input-title'), 'type':("text"), 'placeholder':("Title of Article"), 'id':('title'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><textarea');
buf.push(attrs({ 'placeholder':("Article Summary"), 'id':('msg'), "class": ('span8') }, {"placeholder":true}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'type':("text"), 'placeholder':("Article's url ?"), 'id':('url'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div></div></div>');
}
return buf.join("");
}
jade.templates["auth"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('facebook') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/facebook") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/facebook.ico"), 'alt':("Facebook") }, {"src":true,"alt":true}));
buf.push('/><span>Facebook</span></a></li><li');
buf.push(attrs({ "class": ('twitter') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/twitter") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/twitter.ico"), 'alt':("Twitter") }, {"src":true,"alt":true}));
buf.push('/><span>Twitter</span></a></li><li');
buf.push(attrs({ "class": ('github') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/github") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/github.ico"), 'alt':("GitHub") }, {"src":true,"alt":true}));
buf.push('/><span>Github</span></a></li></ul>');
}
return buf.join("");
}
jade.templates["filters"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h3>Filters</h3><hr');
buf.push(attrs({  }, {}));
buf.push('/><form');
buf.push(attrs({ 'id':('form_filters') }, {}));
buf.push('><label><strong>Verbs</strong></label><p>The verb describes the type of action the actor performs on the object.</p>');
if (locals.usedVerbs)
{
// iterate locals.usedVerbs
;(function(){
  if ('number' == typeof locals.usedVerbs.length) {
    for (var $index = 0, $$l = locals.usedVerbs.length; $index < $$l; $index++) {
      var verb = locals.usedVerbs[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("verb"), 'value':(verb), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedVerbs) {
      var verb = locals.usedVerbs[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("verb"), 'value':(verb), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Object Types</strong></label>');
if (locals.usedObjectTypes)
{
// iterate locals.usedObjectTypes
;(function(){
  if ('number' == typeof locals.usedObjectTypes.length) {
    for (var $index = 0, $$l = locals.usedObjectTypes.length; $index < $$l; $index++) {
      var objType = locals.usedObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("objectType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedObjectTypes) {
      var objType = locals.usedObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("objectType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Actor Object Types</strong></label>');
if (locals.usedActorObjectTypes)
{
// iterate locals.usedActorObjectTypes
;(function(){
  if ('number' == typeof locals.usedActorObjectTypes.length) {
    for (var $index = 0, $$l = locals.usedActorObjectTypes.length; $index < $$l; $index++) {
      var objType = locals.usedActorObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actorType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedActorObjectTypes) {
      var objType = locals.usedActorObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actorType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Distinct Objects</strong></label>');
if (locals.usedObjects)
{
// iterate locals.usedObjects
;(function(){
  if ('number' == typeof locals.usedObjects.length) {
    for (var $index = 0, $$l = locals.usedObjects.length; $index < $$l; $index++) {
      var obj = locals.usedObjects[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("object"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedObjects) {
      var obj = locals.usedObjects[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("object"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
}
buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Distinct Actors</strong></label>');
if (locals.usedActors)
{
// iterate locals.usedActors
;(function(){
  if ('number' == typeof locals.usedActors.length) {
    for (var $index = 0, $$l = locals.usedActors.length; $index < $$l; $index++) {
      var obj = locals.usedActors[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actor"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedActors) {
      var obj = locals.usedActors[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actor"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
buf.push('</form>');
}
return buf.join("");
}
jade.templates["index"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('navbar') + ' ' + ('navbar-inverse') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('navbar-inner') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('container') }, {}));
buf.push('><a');
buf.push(attrs({ 'data-target':(".nav-collapse"), 'data-toggle':("collapse"), "class": ('btn') + ' ' + ('btn-navbar') }, {"data-target":true,"data-toggle":true}));
buf.push('><span');
buf.push(attrs({ "class": ('icon-bar') }, {}));
buf.push('></span><span');
buf.push(attrs({ "class": ('icon-bar') }, {}));
buf.push('></span><span');
buf.push(attrs({ "class": ('icon-bar') }, {}));
buf.push('></span></a><a');
buf.push(attrs({ 'id':('connected'), 'href':("#start-modal"), 'role':("button"), 'data-toggle':("modal"), "class": ('brand') }, {"href":true,"role":true,"data-toggle":true}));
buf.push('>node-activities-boilerplate</a><div');
buf.push(attrs({ "class": ('nav-collapse') }, {}));
buf.push('><ul');
buf.push(attrs({ "class": ('nav') }, {}));
buf.push('><li><a');
buf.push(attrs({ 'href':("http://github.com/ciberch/node-activities-boilerplate"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>Fork on GitHub</a></li>');
 if(session.auth)
{
buf.push('<li');
buf.push(attrs({ "class": ('logout') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/logout") }, {"href":true}));
buf.push('><span>Logout</span></a></li>');
}
buf.push('</ul></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 if(!session.auth)
{
buf.push('<ul');
buf.push(attrs({ "class": ('nav') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('dropdown') }, {}));
buf.push('><a');
buf.push(attrs({ 'id':('auth-button'), 'href':("#"), 'data-toggle':("dropdown") }, {"href":true,"data-toggle":true}));
buf.push('><span>Login / Signup</span><b');
buf.push(attrs({ "class": ('caret') }, {}));
buf.push('></b></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('facebook') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/facebook") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/facebook.ico"), 'alt':("Facebook") }, {"src":true,"alt":true}));
buf.push('/><span>Facebook</span></a></li><li');
buf.push(attrs({ "class": ('twitter') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/twitter") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/twitter.ico"), 'alt':("Twitter") }, {"src":true,"alt":true}));
buf.push('/><span>Twitter</span></a></li><li');
buf.push(attrs({ "class": ('github') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/github") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/github.ico"), 'alt':("GitHub") }, {"src":true,"alt":true}));
buf.push('/><span>Github</span></a></li></ul></li></ul>');
}
buf.push('<ul');
buf.push(attrs({ "class": ('nav') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('dropdown') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("#"), 'data-toggle':("dropdown") }, {"href":true,"data-toggle":true}));
buf.push('><span>Built with</span><b');
buf.push(attrs({ "class": ('caret') }, {}));
buf.push('></b></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('><li><a');
buf.push(attrs({ 'href':("https://my.cloudfoundry.com/signup/hack"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>CloudFoundry</a></li><li><a');
buf.push(attrs({ 'href':("http://activitystrea.ms/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>ActivityStrea.ms</a></li><li><a');
buf.push(attrs({ 'href':("http://mongodb.org/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>MongoDB</a></li><li><a');
buf.push(attrs({ 'href':("http://mongoosejs.com/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>MongooseJS</a></li><li><a');
buf.push(attrs({ 'href':("http://redis.io/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>Redis</a></li><li><a');
buf.push(attrs({ 'href':("http://expressjs.com/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>ExpressJS</a></li><li><a');
buf.push(attrs({ 'href':("http://socket.io/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>socket.io</a></li><li><a');
buf.push(attrs({ 'href':("http://twitter.github.com/bootstrap/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>Twitter Bootstrap</a></li></ul></li></ul></div></div></div></div><div');
buf.push(attrs({ "class": ('container') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('start-modal'), 'role':("dialog"), 'aria-labelledby':("Welcome Screen"), 'aria-hidden':("true"), "class": ('modal') + ' ' + ('hide') + ' ' + ('fade') + ' ' + ('main-hero') }, {"role":true,"aria-labelledby":true,"aria-hidden":true}));
buf.push('><div');
buf.push(attrs({ "class": ('modal-header') }, {}));
buf.push('><button');
buf.push(attrs({ 'type':("button"), 'data-dismiss':("modal"), 'aria-hidden':("true"), "class": ("close") }, {"type":true,"class":true,"data-dismiss":true,"aria-hidden":true}));
buf.push('>&times;</button><h2><a');
buf.push(attrs({ 'href':("#") }, {"href":true}));
buf.push('>Node.js Activities Boilerplate App</a></h2><span>Publish activities to the stream of your choice.&nbsp;</span><span>Consume streams in Real-time.</span></div><div');
buf.push(attrs({ "class": ('modal-body') }, {}));
buf.push('><h4>To Use</h4><p>Start by describing new activities and content others may find interesting or you want to remember.</p><hr');
buf.push(attrs({  }, {}));
buf.push('/><h4>Note: &nbsp;</h4><ul><li><span>To change the actor you can&nbsp;<a');
buf.push(attrs({ 'href':("#") }, {"href":true}));
buf.push('>Login&nbsp;</a><span>into different accounts via&nbsp;</span><a');
buf.push(attrs({ 'href':("#") }, {"href":true}));
buf.push('>OAuth</a></span></li><li>This app can also be used programmatically via the API &nbsp;</li></ul></div><div');
buf.push(attrs({ "class": ('modal-footer') }, {}));
buf.push('><button');
buf.push(attrs({ 'data-dismiss':("modal"), 'aria-hidden':("true"), "class": ('btn') }, {"data-dismiss":true,"aria-hidden":true}));
buf.push('>OK</button></div></div>');
 var chosenVerb = locals.verbs[0];
 var chosenObject = locals.objectTypes[0];
 if(session.auth)
{
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><h3>Share something...</h3></div></div><div');
buf.push(attrs({ 'id':('new_activity') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('user-box') + ' ' + ('span1') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("#"), 'rel':("tooltip"), 'title':("" + (locals.currentUser.displayName) + "") }, {"href":true,"rel":true,"title":true}));
buf.push('><img');
buf.push(attrs({ 'src':("" + (locals.currentUser.image.url) + ""), "class": ('avatar-small') + ' ' + ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/><div');
buf.push(attrs({ "class": ('clearfix') }, {}));
buf.push('></div></a></div><div');
buf.push(attrs({ "class": ('span5') + ' ' + ('large-text') }, {}));
buf.push('>Did you&nbsp;<span');
buf.push(attrs({ 'id':('verb'), "class": ('btn-group') }, {}));
buf.push('><a');
buf.push(attrs({ 'data-toggle':("dropdown"), "class": ('btn') + ' ' + ('btn-info') + ' ' + ('dropdown-toggle') }, {"data-toggle":true}));
buf.push('><span');
buf.push(attrs({ 'id':('verb-show') }, {}));
buf.push('>');
var __val__ = chosenVerb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('>');
// iterate locals.verbs
;(function(){
  if ('number' == typeof locals.verbs.length) {
    for (var $index = 0, $$l = locals.verbs.length; $index < $$l; $index++) {
      var verb = locals.verbs[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("verb-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
    }
  } else {
    for (var $index in locals.verbs) {
      var verb = locals.verbs[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("verb-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
   }
  }
}).call(this);

buf.push('</ul></span>&nbsp;a new&nbsp;<span');
buf.push(attrs({ 'id':('objectType'), "class": ('btn-group') }, {}));
buf.push('><a');
buf.push(attrs({ 'data-toggle':("dropdown"), "class": ('btn') + ' ' + ('btn-info') + ' ' + ('dropdown-toggle') }, {"data-toggle":true}));
buf.push('><span');
buf.push(attrs({ 'id':('object-show') }, {}));
buf.push('>');
var __val__ = chosenObject
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('>');
// iterate locals.objectTypes
;(function(){
  if ('number' == typeof locals.objectTypes.length) {
    for (var $index = 0, $$l = locals.objectTypes.length; $index < $$l; $index++) {
      var objectType = locals.objectTypes[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("object-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = objectType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
    }
  } else {
    for (var $index in locals.objectTypes) {
      var objectType = locals.objectTypes[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#"), 'data-type-show':("object-show"), "class": ('type-select') }, {"href":true,"data-type-show":true}));
buf.push('>');
var __val__ = objectType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
   }
  }
}).call(this);

buf.push('</ul></span>&nbsp;?</div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('specific-activity-input') }, {}));
buf.push('></div></div><div');
buf.push(attrs({ 'id':('finish'), "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span10') + ' ' + ('offset2') }, {}));
buf.push('><span');
buf.push(attrs({ "class": ('large-text') }, {}));
buf.push('>Final Step:&nbsp;</span><button');
buf.push(attrs({ 'id':('send-message'), "class": ('btn') + ' ' + ('btn-success') }, {}));
buf.push('>Publish</button>&nbsp;the activity to the&nbsp;<span');
buf.push(attrs({ "class": ('input-prepend') }, {}));
buf.push('><span');
buf.push(attrs({ "class": ('add-on') }, {}));
buf.push('>#</span><input');
buf.push(attrs({ 'id':('streamName'), 'type':("text"), 'value':(locals.desiredStream), "class": ('span2') + ' ' + ('prepend-fix') }, {"type":true,"value":true}));
buf.push('/></span></div></div></div>');
}
 else
{
buf.push('<div');
buf.push(attrs({ "class": ('hero-unit') + ' ' + ('second-hero') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("http://blog.cloudfoundry.com/tag/asms/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/img/asms-blog.png"), "class": ('arch') }, {"src":true}));
buf.push('/></a></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><h1>Welcome</h1><p>This is a boilerplate Activity Streams App. Login or Sign Up to Share Activities !</p><div');
buf.push(attrs({ "class": ('btn-group') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("#"), 'data-toggle':("dropdown"), "class": ('btn') + ' ' + ('btn-primary') + ' ' + ('dropdown-toggle') }, {"href":true,"data-toggle":true}));
buf.push('>Get Started via</a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('facebook') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/facebook") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/facebook.ico"), 'alt':("Facebook") }, {"src":true,"alt":true}));
buf.push('/><span>Facebook</span></a></li><li');
buf.push(attrs({ "class": ('twitter') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/twitter") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/twitter.ico"), 'alt':("Twitter") }, {"src":true,"alt":true}));
buf.push('/><span>Twitter</span></a></li><li');
buf.push(attrs({ "class": ('github') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/github") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/github.ico"), 'alt':("GitHub") }, {"src":true,"alt":true}));
buf.push('/><span>Github</span></a></li></ul></div></div></div></div>');
}
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('filters'), "class": ('span4') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('well') + ' ' + ('second-hero') }, {}));
buf.push('><h3>Filters</h3><hr');
buf.push(attrs({  }, {}));
buf.push('/><form');
buf.push(attrs({ 'id':('form_filters') }, {}));
buf.push('><label><strong>Verbs</strong></label><p>The verb describes the type of action the actor performs on the object.</p>');
if (locals.usedVerbs)
{
// iterate locals.usedVerbs
;(function(){
  if ('number' == typeof locals.usedVerbs.length) {
    for (var $index = 0, $$l = locals.usedVerbs.length; $index < $$l; $index++) {
      var verb = locals.usedVerbs[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("verb"), 'value':(verb), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedVerbs) {
      var verb = locals.usedVerbs[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = verb
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("verb"), 'value':(verb), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Object Types</strong></label>');
if (locals.usedObjectTypes)
{
// iterate locals.usedObjectTypes
;(function(){
  if ('number' == typeof locals.usedObjectTypes.length) {
    for (var $index = 0, $$l = locals.usedObjectTypes.length; $index < $$l; $index++) {
      var objType = locals.usedObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("objectType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedObjectTypes) {
      var objType = locals.usedObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("objectType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Actor Object Types</strong></label>');
if (locals.usedActorObjectTypes)
{
// iterate locals.usedActorObjectTypes
;(function(){
  if ('number' == typeof locals.usedActorObjectTypes.length) {
    for (var $index = 0, $$l = locals.usedActorObjectTypes.length; $index < $$l; $index++) {
      var objType = locals.usedActorObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actorType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedActorObjectTypes) {
      var objType = locals.usedActorObjectTypes[$index];

buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = objType
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actorType"), 'value':(objType), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Distinct Objects</strong></label>');
if (locals.usedObjects)
{
// iterate locals.usedObjects
;(function(){
  if ('number' == typeof locals.usedObjects.length) {
    for (var $index = 0, $$l = locals.usedObjects.length; $index < $$l; $index++) {
      var obj = locals.usedObjects[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("object"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedObjects) {
      var obj = locals.usedObjects[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("object"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
}
buf.push('<hr');
buf.push(attrs({  }, {}));
buf.push('/><label><strong>Distinct Actors</strong></label>');
if (locals.usedActors)
{
// iterate locals.usedActors
;(function(){
  if ('number' == typeof locals.usedActors.length) {
    for (var $index = 0, $$l = locals.usedActors.length; $index < $$l; $index++) {
      var obj = locals.usedActors[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actor"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
    }
  } else {
    for (var $index in locals.usedActors) {
      var obj = locals.usedActors[$index];

 var id = (obj.objectType ? obj.objectType : '(none)') + " " + (obj.displayName ? obj.displayName : obj.title)
buf.push('<label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('>');
var __val__ = id
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<input');
buf.push(attrs({ 'type':("checkbox"), 'name':("actor"), 'value':(id), 'checked':(true), "class": ('filter-checkbox') }, {"type":true,"name":true,"value":true,"checked":true}));
buf.push('/></label>');
   }
  }
}).call(this);

}
buf.push('</form></div></div><div');
buf.push(attrs({ 'id':('stream'), "class": ('span8') }, {}));
buf.push('><h3>Activity Stream</h3><div');
buf.push(attrs({ "class": ('wello') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('nav-tabs-container') }, {}));
buf.push('>');
if (locals.streams) {
{
buf.push('<ul');
buf.push(attrs({ "class": ('nav') + ' ' + ('nav-tabs') }, {}));
buf.push('>');
// iterate locals.streams
;(function(){
  if ('number' == typeof locals.streams.length) {
    for (var $index = 0, $$l = locals.streams.length; $index < $$l; $index++) {
      var stream = locals.streams[$index];

if (stream.items && stream.items.length>0)
{
buf.push('<li');
buf.push(attrs({ "class": ('active') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/streams/" + (stream.name) + "") }, {"href":true}));
buf.push('>');
var __val__ = stream.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
}
else
{
buf.push('<li><a');
buf.push(attrs({ 'href':("/streams/" + (stream.name) + "") }, {"href":true}));
buf.push('>');
var __val__ = stream.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
}
    }
  } else {
    for (var $index in locals.streams) {
      var stream = locals.streams[$index];

if (stream.items && stream.items.length>0)
{
buf.push('<li');
buf.push(attrs({ "class": ('active') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/streams/" + (stream.name) + "") }, {"href":true}));
buf.push('>');
var __val__ = stream.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
}
else
{
buf.push('<li><a');
buf.push(attrs({ 'href':("/streams/" + (stream.name) + "") }, {"href":true}));
buf.push('>');
var __val__ = stream.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
}
   }
  }
}).call(this);

buf.push('</ul>');
}
}
buf.push('</div><ul');
buf.push(attrs({ 'id':('main_stream'), "class": ('unstyled') }, {}));
buf.push('>');
 var activities = locals.streams[desiredStream].items
if (activities && activities.length) {
{
// iterate activities
;(function(){
  if ('number' == typeof activities.length) {
    for (var $index = 0, $$l = activities.length; $index < $$l; $index++) {
      var act = activities[$index];

 if (!act.object) continue;
 var objType = " objectType-" + (act.object.objectType ? act.object.objectType : 'none');
 var actorType = " actorType-" + (act.actor.objectType ? act.actor.objectType : 'none');
 var className = "verb-" + act.verb + objType+actorType;
buf.push('<li');
buf.push(attrs({ "class": (className) }, {"class":true}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = act.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = act.actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = act.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = act.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = act;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('actions') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-warning') + ' ' + ('like-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-ok') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Like</small></a></small></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') + ' ' + ('right') }, {}));
buf.push('><textarea');
buf.push(attrs({ "class": ('span4') + ' ' + ('comment-area') }, {}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('comment-post'), "class": ('span2') + ' ' + ('offset3') + ' ' + ('right') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-success') + ' ' + ('comment-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-pencil') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Post</small></a></small></div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('action_results') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('>');
if (act.likes_count && act.likes_count > 0) {
{
buf.push('<small');
buf.push(attrs({ 'id':('like_count') }, {}));
buf.push('>' + escape((interp = act.likes_count) == null ? '' : interp) + '</small><small');
buf.push(attrs({ "class": ('rest') }, {}));
buf.push('>&nbsp; liked this</small>');
}
}
buf.push('</div>');
if (act.comments) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span4') }, {}));
buf.push('><ul>');
for(var i=0; i < act.comments.length; i++) {
 var comment = comments[i];
{
buf.push('<li><div');
buf.push(attrs({ "class": ('row') + ' ' + ('comment') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = comment.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = comment.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = comment.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = comment;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div></li>');
}
 }
buf.push('</ul></div>');
}
buf.push('</div>');
 }
buf.push('</li>');
    }
  } else {
    for (var $index in activities) {
      var act = activities[$index];

 if (!act.object) continue;
 var objType = " objectType-" + (act.object.objectType ? act.object.objectType : 'none');
 var actorType = " actorType-" + (act.actor.objectType ? act.actor.objectType : 'none');
 var className = "verb-" + act.verb + objType+actorType;
buf.push('<li');
buf.push(attrs({ "class": (className) }, {"class":true}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = act.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = act.actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = act.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = act.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = act;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('actions') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-warning') + ' ' + ('like-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-ok') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Like</small></a></small></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') + ' ' + ('right') }, {}));
buf.push('><textarea');
buf.push(attrs({ "class": ('span4') + ' ' + ('comment-area') }, {}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ 'id':('comment-post'), "class": ('span2') + ' ' + ('offset3') + ' ' + ('right') }, {}));
buf.push('><small><a');
buf.push(attrs({ 'href':("#"), "class": ('btn') + ' ' + ('btn-mini') + ' ' + ('btn-success') + ' ' + ('comment-button') }, {"href":true}));
buf.push('><i');
buf.push(attrs({ "class": ('icon-pencil') + ' ' + ('icon-white') }, {}));
buf.push('></i><small>&nbsp; Post</small></a></small></div></div></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('action_results') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span2') }, {}));
buf.push('>');
if (act.likes_count && act.likes_count > 0) {
{
buf.push('<small');
buf.push(attrs({ 'id':('like_count') }, {}));
buf.push('>' + escape((interp = act.likes_count) == null ? '' : interp) + '</small><small');
buf.push(attrs({ "class": ('rest') }, {}));
buf.push('>&nbsp; liked this</small>');
}
}
buf.push('</div>');
if (act.comments) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span4') }, {}));
buf.push('><ul>');
for(var i=0; i < act.comments.length; i++) {
 var comment = comments[i];
{
buf.push('<li><div');
buf.push(attrs({ "class": ('row') + ' ' + ('comment') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span1') + ' ' + ('actor') }, {}));
buf.push('>');
 var actor = comment.actor;
 var actUrl = actor.url? actor.url: '#';
if (actor.image && actor.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (actUrl) + ""), "class": ('actor') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(actor.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
} else {
{
buf.push('<h2>:-)</h2>');
}
}
buf.push('</div><div');
buf.push(attrs({ "class": ('span6') + ' ' + ('action') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') + ' ' + ('title') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('><strong>');
var __val__ = actor.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>&nbsp;');
var __val__ = comment.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('activity_object') }, {}));
buf.push('>');
 var object = comment.object;
 var objUrl = object.url ? object.url : '#';
buf.push('<div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><br');
buf.push(attrs({  }, {}));
buf.push('/><blockquote>');
if (object.image && object.image.url) {
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (objUrl) + "") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(object.image.url), "class": ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/></a>');
}
}
if (object.displayName) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-displayName') }, {}));
buf.push('>');
var __val__ = object.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
} else if (object.title) {
{
buf.push('<strong');
buf.push(attrs({ "class": ('activity-title') }, {}));
buf.push('>');
var __val__ = object.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</strong>');
}
}
if (object.content) {
{
buf.push('<div');
buf.push(attrs({ "class": ('activity-content') }, {}));
buf.push('>');
var __val__ = object.content
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
}
buf.push('</blockquote></div></div><div');
buf.push(attrs({ "class": ('row') + ' ' + ('details') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 var timedItem = comment;
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('small') }, {}));
buf.push('>');
var __val__ = (timedItem.userFriendlyDate ? timedItem.userFriendlyDate : timedItem.published)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div></div>');
 if (timedItem.provider && timedItem.provider.icon) {
{
buf.push('<div');
buf.push(attrs({ "class": ('span3') + ' ' + ('timestamp') }, {}));
buf.push('><span>Via&nbsp;</span><a');
buf.push(attrs({ 'href':("" + (timedItem.provider.url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('><span>');
var __val__ = timedItem.provider.displayName
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span><img');
buf.push(attrs({ 'src':(timedItem.provider.icon.url), "class": ('service') }, {"src":true}));
buf.push('/></a></div>');
}
}
buf.push('</div></div></div></div></li>');
}
 }
buf.push('</ul></div>');
}
buf.push('</div>');
 }
buf.push('</li>');
   }
  }
}).call(this);

}
}
buf.push('</ul></div></div></div></div>');
}
return buf.join("");
}
jade.templates["layout"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head><meta');
buf.push(attrs({ 'http-equiv':("Content-Type"), 'content':("text/html; charset=utf-8") }, {"http-equiv":true,"content":true}));
buf.push('/><link');
buf.push(attrs({ 'rel':("stylesheet"), 'href':("/css/bootstrap.css"), 'type':("text/css") }, {"rel":true,"href":true,"type":true}));
buf.push('/><link');
buf.push(attrs({ 'rel':("stylesheet"), 'href':("/css/client.css"), 'type':("text/css") }, {"rel":true,"href":true,"type":true}));
buf.push('/><title>Activity Streams</title></head><body>');
var __val__ = body
buf.push(null == __val__ ? "" : __val__);
buf.push('<script');
buf.push(attrs({ 'src':("/js/jquery.min.js"), 'type':("text/javascript") }, {"src":true,"type":true}));
buf.push('></script><script');
buf.push(attrs({ 'src':("/js/underscore-min.js"), 'type':("text/javascript") }, {"src":true,"type":true}));
buf.push('></script><script');
buf.push(attrs({ 'src':("/js/helper.js"), 'type':("text/javascript") }, {"src":true,"type":true}));
buf.push('></script><script');
buf.push(attrs({ 'type':("text/javascript") }, {"type":true}));
buf.push('>var App = {\n helper : new AppHelper()\n}</script><script');
buf.push(attrs({ 'src':("/static/js/" + (assetsCacheHashes.js||0) + "/client.js"), 'type':("text/javascript") }, {"src":true,"type":true}));
buf.push('></script><script');
buf.push(attrs({ 'src':("https://maps.googleapis.com/maps/api/js?sensor=true") }, {"src":true}));
buf.push('></script></body></html>');
}
return buf.join("");
}
jade.templates["nav_bar"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('navbar') + ' ' + ('navbar-inverse') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('navbar-inner') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('container') }, {}));
buf.push('><a');
buf.push(attrs({ 'data-target':(".nav-collapse"), 'data-toggle':("collapse"), "class": ('btn') + ' ' + ('btn-navbar') }, {"data-target":true,"data-toggle":true}));
buf.push('><span');
buf.push(attrs({ "class": ('icon-bar') }, {}));
buf.push('></span><span');
buf.push(attrs({ "class": ('icon-bar') }, {}));
buf.push('></span><span');
buf.push(attrs({ "class": ('icon-bar') }, {}));
buf.push('></span></a><a');
buf.push(attrs({ 'id':('connected'), 'href':("#start-modal"), 'role':("button"), 'data-toggle':("modal"), "class": ('brand') }, {"href":true,"role":true,"data-toggle":true}));
buf.push('>node-activities-boilerplate</a><div');
buf.push(attrs({ "class": ('nav-collapse') }, {}));
buf.push('><ul');
buf.push(attrs({ "class": ('nav') }, {}));
buf.push('><li><a');
buf.push(attrs({ 'href':("http://github.com/ciberch/node-activities-boilerplate"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>Fork on GitHub</a></li>');
 if(session.auth)
{
buf.push('<li');
buf.push(attrs({ "class": ('logout') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/logout") }, {"href":true}));
buf.push('><span>Logout</span></a></li>');
}
buf.push('</ul></div><div');
buf.push(attrs({ "class": ('span5') }, {}));
buf.push('>');
 if(!session.auth)
{
buf.push('<ul');
buf.push(attrs({ "class": ('nav') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('dropdown') }, {}));
buf.push('><a');
buf.push(attrs({ 'id':('auth-button'), 'href':("#"), 'data-toggle':("dropdown") }, {"href":true,"data-toggle":true}));
buf.push('><span>Login / Signup</span><b');
buf.push(attrs({ "class": ('caret') }, {}));
buf.push('></b></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('facebook') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/facebook") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/facebook.ico"), 'alt':("Facebook") }, {"src":true,"alt":true}));
buf.push('/><span>Facebook</span></a></li><li');
buf.push(attrs({ "class": ('twitter') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/twitter") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/twitter.ico"), 'alt':("Twitter") }, {"src":true,"alt":true}));
buf.push('/><span>Twitter</span></a></li><li');
buf.push(attrs({ "class": ('github') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("/auth/github") }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/github.ico"), 'alt':("GitHub") }, {"src":true,"alt":true}));
buf.push('/><span>Github</span></a></li></ul></li></ul>');
}
buf.push('<ul');
buf.push(attrs({ "class": ('nav') }, {}));
buf.push('><li');
buf.push(attrs({ "class": ('dropdown') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("#"), 'data-toggle':("dropdown") }, {"href":true,"data-toggle":true}));
buf.push('><span>Built with</span><b');
buf.push(attrs({ "class": ('caret') }, {}));
buf.push('></b></a><ul');
buf.push(attrs({ "class": ('dropdown-menu') }, {}));
buf.push('><li><a');
buf.push(attrs({ 'href':("https://my.cloudfoundry.com/signup/hack"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>CloudFoundry</a></li><li><a');
buf.push(attrs({ 'href':("http://activitystrea.ms/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>ActivityStrea.ms</a></li><li><a');
buf.push(attrs({ 'href':("http://mongodb.org/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>MongoDB</a></li><li><a');
buf.push(attrs({ 'href':("http://mongoosejs.com/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>MongooseJS</a></li><li><a');
buf.push(attrs({ 'href':("http://redis.io/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>Redis</a></li><li><a');
buf.push(attrs({ 'href':("http://expressjs.com/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>ExpressJS</a></li><li><a');
buf.push(attrs({ 'href':("http://socket.io/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>socket.io</a></li><li><a');
buf.push(attrs({ 'href':("http://twitter.github.com/bootstrap/"), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>Twitter Bootstrap</a></li></ul></li></ul></div></div></div></div>');
}
return buf.join("");
}
jade.templates["person"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') + ' ' + ('offset1') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('input-title'), 'type':("text"), 'placeholder':("Display Name"), 'id':('title'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'type':("text"), 'placeholder':("Person's web page ?"), 'id':('url'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div></div></div>');
}
return buf.join("");
}
jade.templates["photo"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('>');
 var photoTitle = act.object ? act.object.title : '';
 var photoUrl = act.object ? act.object.url : '';
 if(act.object && act.object.image) {
{
buf.push('<div');
buf.push(attrs({ 'id':('thumbnail'), "class": ('span3') + ' ' + ('offset1') }, {}));
buf.push('><img');
buf.push(attrs({ 'src':("" + (act.object.image.url) + "") }, {"src":true}));
buf.push('/></div>');
}
 } else {
{
buf.push('<div');
buf.push(attrs({ 'id':('photo'), "class": ('span3') + ' ' + ('offset1') }, {}));
buf.push('><form');
buf.push(attrs({ 'id':('new_photo'), 'method':("post"), 'enctype':("multipart/form-data"), 'action':("/photos") }, {"method":true,"enctype":true,"action":true}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span3') }, {}));
buf.push('><h4>Step 1: Select Photo</h4></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span3') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('input-file') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('input-file-input'), 'type':("file"), 'name':("image"), 'accept':("image/*"), 'required':("required") }, {"type":true,"name":true,"accept":true,"required":true}));
buf.push('/></div><div');
buf.push(attrs({ "class": ('clearfix') }, {}));
buf.push('></div><hr');
buf.push(attrs({  }, {}));
buf.push('/><h4>Step 2: Upload to Cloud<i');
buf.push(attrs({ "class": ('icon-upload') }, {}));
buf.push('></i></h4><input');
buf.push(attrs({ 'id':('upload-file'), 'type':("submit"), 'value':("Upload File"), "class": ('btn') + ' ' + ('btn-warning') }, {"type":true,"value":true}));
buf.push('/></div></div></form></div>');
}
 }
buf.push('<div');
buf.push(attrs({ 'id':('details'), "class": ('span6') + ' ' + ('offset1') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><h4>Step 3: Complete details</h4></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('input-title'), 'type':("text"), 'placeholder':("Describe the photo"), 'value':("" + (photoTitle) + ""), 'id':('title'), "class": ('span6') }, {"type":true,"placeholder":true,"value":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><input');
buf.push(attrs({ 'type':("text"), 'placeholder':("Url of photo on another site ?"), 'value':("" + (photoUrl) + ""), 'id':('url'), "class": ('span6') }, {"type":true,"placeholder":true,"value":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('includeLocation'), 'type':("checkbox") }, {"type":true}));
buf.push('/><span>Include Location ?</span></label></div></div><div');
buf.push(attrs({ 'id':('map'), "class": ('hide') }, {}));
buf.push('></div></div></div>');
}
return buf.join("");
}
jade.templates["place"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') + ' ' + ('offset1') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('input-title'), 'type':("text"), 'placeholder':("What is it called ?"), 'id':('title'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><textarea');
buf.push(attrs({ 'placeholder':("Describe the place"), 'id':('msg'), "class": ('span8') }, {"placeholder":true}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'type':("text"), 'placeholder':("Website for the place"), 'id':('url'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('includeLocation'), 'type':("checkbox") }, {"type":true}));
buf.push('/><span>Where is this place ?</span></label></div></div><div');
buf.push(attrs({ 'id':('map'), "class": ('hide') }, {}));
buf.push('></div></div></div>');
}
return buf.join("");
}
jade.templates["service"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') + ' ' + ('offset1') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('input-title'), 'type':("text"), 'placeholder':("What is it called ?"), 'id':('title'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><textarea');
buf.push(attrs({ 'placeholder':("Describe the service."), 'id':('msg'), "class": ('span8') }, {"placeholder":true}));
buf.push('></textarea></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span8') }, {}));
buf.push('><input');
buf.push(attrs({ 'type':("text"), 'placeholder':("What is it's url ?"), 'id':('url'), "class": ('span8') }, {"type":true,"placeholder":true}));
buf.push('/></div></div><div');
buf.push(attrs({ "class": ('row') }, {}));
buf.push('><div');
buf.push(attrs({ "class": ('span6') }, {}));
buf.push('><label');
buf.push(attrs({ "class": ('checkbox') }, {}));
buf.push('><input');
buf.push(attrs({ 'id':('includeLocation'), 'type':("checkbox") }, {"type":true}));
buf.push('/><span>Include Location ?</span></label></div></div><div');
buf.push(attrs({ 'id':('map'), "class": ('hide') }, {}));
buf.push('></div></div></div>');
}
return buf.join("");
}
jade.templates["start-modal"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'id':('start-modal'), 'role':("dialog"), 'aria-labelledby':("Welcome Screen"), 'aria-hidden':("true"), "class": ('modal') + ' ' + ('hide') + ' ' + ('fade') + ' ' + ('main-hero') }, {"role":true,"aria-labelledby":true,"aria-hidden":true}));
buf.push('><div');
buf.push(attrs({ "class": ('modal-header') }, {}));
buf.push('><button');
buf.push(attrs({ 'type':("button"), 'data-dismiss':("modal"), 'aria-hidden':("true"), "class": ("close") }, {"type":true,"class":true,"data-dismiss":true,"aria-hidden":true}));
buf.push('>&times;</button><h2><a');
buf.push(attrs({ 'href':("#") }, {"href":true}));
buf.push('>Node.js Activities Boilerplate App</a></h2><span>Publish activities to the stream of your choice.&nbsp;</span><span>Consume streams in Real-time.</span></div><div');
buf.push(attrs({ "class": ('modal-body') }, {}));
buf.push('><h4>To Use</h4><p>Start by describing new activities and content others may find interesting or you want to remember.</p><hr');
buf.push(attrs({  }, {}));
buf.push('/><h4>Note: &nbsp;</h4><ul><li><span>To change the actor you can&nbsp;<a');
buf.push(attrs({ 'href':("#") }, {"href":true}));
buf.push('>Login&nbsp;</a><span>into different accounts via&nbsp;</span><a');
buf.push(attrs({ 'href':("#") }, {"href":true}));
buf.push('>OAuth</a></span></li><li>This app can also be used programmatically via the API &nbsp;</li></ul></div><div');
buf.push(attrs({ "class": ('modal-footer') }, {}));
buf.push('><button');
buf.push(attrs({ 'data-dismiss':("modal"), 'aria-hidden':("true"), "class": ('btn') }, {"data-dismiss":true,"aria-hidden":true}));
buf.push('>OK</button></div></div>');
}
return buf.join("");
}
jade.templates["user-box"] = function(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('user-box') + ' ' + ('span1') }, {}));
buf.push('><a');
buf.push(attrs({ 'href':("#"), 'rel':("tooltip"), 'title':("" + (locals.currentUser.displayName) + "") }, {"href":true,"rel":true,"title":true}));
buf.push('><img');
buf.push(attrs({ 'src':("" + (locals.currentUser.image.url) + ""), "class": ('avatar-small') + ' ' + ('img-rounded') + ' ' + ('avatar') }, {"src":true}));
buf.push('/><div');
buf.push(attrs({ "class": ('clearfix') }, {}));
buf.push('></div></a></div>');
}
return buf.join("");
}