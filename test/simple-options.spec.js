/**
 * Created by Stefan Vogelsang on 09.12.2016.
 */
"use strict";

var should = require('should');
var sinon = require('sinon');
var sut = require('../lib/simple-options');
var resMock = require('./response-mock-builder');

describe('simple options', function() {

  describe('merge', function() {

    describe('required property checks', function() {

      it('should throw if value is missing', function() {
        should.throws(function() {sut({name: 'A'}, {name: 'B', index: undefined});});
      });

      it('should not throw if default value is false', function() {
        should.doesNotThrow(function() {sut({name: 'A'}, {name: 'B', index: false});});
      });

      it('should throw if value is missing (null)', function() {
        should.throws(function() {sut({name: 'A'}, {name: 'B', index: null});});
      });

      it('should throw if value is missing deeper in hierarchie', function() {
        should.throws(function() {sut({name: 'A', some: {index: 2}}, {name: 'B', some: {index: 3, other: undefined}});});
      });

      it('should not throw if required values are specified', function() {
        should.doesNotThrow(function() {sut({name: 'A', index: 1}, {name: 'B', index: undefined});});
      });

      it('should not throw if required values are specified deeper in hierarchie', function() {
        should.doesNotThrow(function() {sut({name: 'A', some: {index: 2, other: 'exists'}}, {name: 'B', some: {index: 3, other: undefined}});});
      });

    });

    describe('flat hierarchie', function(){

      it('should use default if value is missing', function() {
        should(sut({}, {name: 'B'})).deepEqual({name: 'B'});
      });

      it('should use default if value is missing', function() {
        should(sut({}, {val: false})).deepEqual({val: false});
      });

      it('should not use default if value is present', function() {
        should(sut({val: false}, {val: true})).deepEqual({val: false});
      });

      it('should use defaults for missing array elements', function() {
        should(sut({items: ['A', 'B']}, {items: ['C', 'D', 'E']})).deepEqual({items: ['A', 'B', 'E']});
      });

      it('should not fail if source array contains more elements than defaults', function() {
        should(sut({items: ['A', 'B', 'C']}, {items: ['C', 'D']})).deepEqual({items: ['A', 'B', 'C']});
      });

    });

    describe('deep hierarchie', function(){

      it('should use default if value is missing', function() {
        should(sut({}, {item: {name: 'B'}})).deepEqual({item: {name: 'B'}});
      });

      it('should merge objects deep', function() {
        should(sut({item: {name: 'A', val: false}}, {item: {name: 'B', number: 10}})).deepEqual({item: {name: 'A', number: 10, val: false}});
      });

      it('should merge array elements', function() {
        should(sut([{item: {name: 'A'}}, {item: {name: 'B'}}], [{item: {name: 'C', number: 2}}, {item: {name: 'D', number: 2}}]))
          .deepEqual([{item: {name: 'A', number: 2}}, {item: {name: 'B', number: 2}}]);
      });

      it('should use defaults for missing array elements', function() {
        should(sut([{item: {name: 'A'}}, {item: {name: 'B'}}], [{item: {name: 'C', number: 2}}, {item: {name: 'D', number: 2}}, {item: {name: 'E', number: 3}}]))
          .deepEqual([{item: {name: 'A', number: 2}}, {item: {name: 'B', number: 2}}, {item: {name: 'E', number: 3}}]);
      });
    });
  });

  describe('fromBody', function() {

    it('should send status code 400 if required parameter is missing', function(done) {
      var status = sinon.spy();
      var res = resMock().status(status).build();
      sut.fromBody({body:{}}, res, {name: null}, function(){
        should(status.calledWith(400)).be.true;
        done();
      });
    });

    it('should send message containing missing parameter name if required parameter is missing', function(done) {
      var send = sinon.spy();
      var res = resMock().send(send).build();
      sut.fromBody({body:{}}, res, {name: null}, function(){
        should(send.calledWith('missing required property (name)')).be.true;
        done();
      });
    });

    it('should pass options to callback function on success', function(done) {
      sut.fromBody({body:{}}, null, {name: 'name'}, function(_, options){
        should(options).deepEqual({name: 'name'});
        done();
      });
    });

    it('should pass error to callback function on failure', function(done) {
      sut.fromBody({body:{}}, resMock().build(), {name: null}, function(err){
        should(err.message).equal('missing required property (name)');
        done();
      });
    });
  });

  describe('fromQuery', function() {

    it('should send status code 400 if required parameter is missing', function(done) {
      var status = sinon.spy();
      var res = resMock().status(status).build();
      sut.fromQuery({params:{}}, res, {name: null}, function(){
        should(status.calledWith(400)).be.true;
        done();
      });
    });

    it('should send message containing missing parameter name if required parameter is missing', function(done) {
      var send = sinon.spy();
      var res = resMock().send(send).build();
      sut.fromQuery({params:{}}, res, {name: null}, function(){
        should(send.calledWith('missing required property (name)')).be.true;
        done();
      });
    });

    it('should pass options to callback function on success', function(done) {
      sut.fromQuery({params:{}}, null, {name: 'name'}, function(_, options){
        should(options).deepEqual({name: 'name'});
        done();
      });
    });

    it('should pass error to callback function on failure', function(done) {
      sut.fromQuery({params:{}}, resMock().build(), {name: null}, function(err){
        should(err.message).equal('missing required property (name)');
        done();
      });
    });
  });
});