'use strict'

var path = require('path')
var chai = require('chai')
var connectSequence = require(path.resolve('./lib/connect-sequence'))

var describe = global.describe
var it = global.it
var expect = chai.expect

describe('connectSequence.run(req, res, next, middlewares)', function () {
  it('should run the initial next middleware at last', function () {
    var _req = {}
    var _res = {}
    var _next = function (req, res, next) {
      req.output = 'initialNext'
    }
    var first = function (req, res, next) {
      req.output = 'first'
    }
    var second = first
    var third = first
    var fourth = first
    var mids = [first, second, third, fourth]

    connectSequence.run(_req, _res, _next, mids)

    expect(_req.output).to.equal('initialNext')
  })
})
