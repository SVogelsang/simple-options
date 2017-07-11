/**
 * Created by Stefan Vogelsang on 09.12.2016.
 */
"use strict";

var assert = require('assert');
var should = require('should');
var sut = require('../lib/simple-options');

describe('simple options', function() {

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
      should(sut([{item: {name: 'A'}}, {item: {name: 'B'}}], [{item: {name: 'C', number: 2}}, {item: {name: 'D', number: 2}}])).deepEqual([{item: {name: 'A', number: 2}}, {item: {name: 'B', number: 2}}]);
    });

    it('should use defaults for missing array elements', function() {
      should(sut([{item: {name: 'A'}}, {item: {name: 'B'}}], [{item: {name: 'C', number: 2}}, {item: {name: 'D', number: 2}}, {item: {name: 'E', number: 3}}]))
        .deepEqual([{item: {name: 'A', number: 2}}, {item: {name: 'B', number: 2}}, {item: {name: 'E', number: 3}}]);
    });

  });
});