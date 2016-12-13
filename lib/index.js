/**
 * Created by Stefan Vogelsang on 09.12.2016.
 */
"use strict";


var sut = require('./simple-options');

var out = sut({items: ['A', 'B']}, {items: ['C', 'D', 'E']})

var i=0;