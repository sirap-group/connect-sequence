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

  it('should run all the middlewares in the passed array of middlewares', function () {
    var _req = {
      ids: []
    }
    var _res = {}
    var _next = function (req, res, next) {
      req.ids.push('initial')
    }
    var first = function (req, res, next) {
      req.ids.push('first')
    }
    var second = function (req, res, next) {
      req.ids.push('second')
    }
    var third = function (req, res, next) {
      req.ids.push('third')
    }
    var fourth = function (req, res, next) {
      req.ids.push('fourth')
    }
    var mids = [first, second, third, fourth]

    connectSequence.run(_req, _res, _next, mids)

    expect(_req.ids).to.contain('initial')
    expect(_req.ids).to.contain('first')
    expect(_req.ids).to.contain('second')
    expect(_req.ids).to.contain('third')
    expect(_req.ids).to.contain('fourth')
  })
})
