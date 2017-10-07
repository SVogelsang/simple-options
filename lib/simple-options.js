/**
 * Created by Stefan Vogelsang on 09.12.2016.
 */
"use strict";

function checkRequired(source, defaults){
  for(var prop in defaults) {
    if (isMissing(defaults[prop]) && isMissing(source[prop])) {
      throw new Error('missing required property (' + prop + ')');
    }
  }
}

function isMissing(value) {
  return value === undefined || value === null;
}

function isArray(arr) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arr);
  }

  return Object.prototype.toString.call(arr) === '[object Array]';
}

function needsDeepCopy(thisOne){
  if (isMissing(thisOne) || Object.prototype.toString.call(thisOne) !== '[object Object]') {
    return false;
  }

  var hasOwnConstructor = Object.prototype.hasOwnProperty.call(thisOne, 'constructor');
  var hasIsPrototypeOf = thisOne.constructor && thisOne.constructor.prototype && Object.prototype.hasOwnProperty.call(thisOne.constructor.prototype, 'isPrototypeOf');
  if (thisOne.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  for (var prop in thisOne) {
    if(!Object.prototype.hasOwnProperty.call(thisOne, prop)){
      return false;
    }
  }

  return true;
}

function mergeArray(source, defaults){
  for(var item in defaults){
    source[item] = merge(source[item], defaults[item]);
  }
}

function merge(source, defaults){

  if(isMissing(source)){
    return defaults;
  }

  checkRequired(source, defaults);

  for(var prop in defaults) {
    if (isMissing(source[prop])) {
      source[prop] = defaults[prop];
    }
    else if (!isMissing(source[prop]) && !isMissing(defaults[prop])){
      if(isArray(defaults[prop])){
        mergeArray(source[prop], defaults[prop]);
      }
      else if(needsDeepCopy(defaults[prop])){
        merge(source[prop], defaults[prop]);
      }
    }
  }

  return source;
}

function fromExpress(source, defaults, res, callback) {

  try {
    if(callback) {
      callback(undefined, merge(source, defaults));
    }
  }
  catch (err) {
    res.set('Content-Type', 'text/plain');
    res.status(err.code || 400).send(err.message || err).end();

    if(callback) {
      callback(err);
    }
  }
}

function fromBody(req, res, defaults, callback) {
  fromExpress(req.body, defaults, res, callback);
}

function fromQuery(req, res, defaults, callback) {
  fromExpress(req.params, defaults, res, callback);
}

module.exports = merge;
module.exports.fromBody = fromBody;
module.exports.fromQuery = fromQuery;