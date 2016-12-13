/**
 * Created by Stefan Vogelsang on 09.12.2016.
 */
"use strict";

function checkRequired(source, defaults){
  for(var prop in defaults) {
    if (!defaults[prop] && !source[prop]) {
      throw new Error('missing required property (' + prop + ')');
    }
  }
}

function isArray(arr) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arr);
  }

  return Object.prototype.toString.call(arr) === '[object Array]';
}

function needsDeepCopy(thisOne){
  if (!thisOne || Object.prototype.toString.call(thisOne) !== '[object Object]') {
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
var merge = function merge(source, defaults){

  if(!source){
    return defaults;
  }

  checkRequired(source, defaults);

  for(var prop in defaults) {
    if (!source[prop]) {
      source[prop] = defaults[prop];
    }
    else if (source[prop] && defaults[prop]){
      if(isArray(defaults[prop])){
        mergeArray(source[prop], defaults[prop]);
      }
      else if(needsDeepCopy(defaults[prop])){
        merge(source[prop], defaults[prop]);
      }
    }
  }

  return source;
};

module.exports = merge;