var assert = require('assert');
var acorn = require('acorn');
var fs = require('fs');

var globals = require('./');

var fixtureCode = fs.readFileSync('fixture.js').toString();
var fixtureExpectedGlobals = require('./fixture.json');

assert.deepEqual(globals(acorn.parse(fixtureCode)), fixtureExpectedGlobals)