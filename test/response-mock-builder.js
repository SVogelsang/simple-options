"use strict";

module.exports = function() {
  var mock = {
    set: function() {return mock;},
    status: function() {return mock;},
    send: function() {return mock},
    end: function() {return mock}
  };

  return {
    build: function() {
      return mock;
    },
    send: function(spy) {
      mock.send = function() {spy(arguments); return mock;};
      return this;
    },
    set: function(spy) {
      mock.set = function() {spy(arguments); return mock;};
      return this;
    },
    status: function(spy) {
      mock.status = function() {spy(arguments); return mock;};
      return this;
    },
    end: function(spy) {
      mock.end = function() {spy(arguments); return mock;};
      return this;
    }
  }
};