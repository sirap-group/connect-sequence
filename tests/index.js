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

  it('should run all the middlewares in the same order than the given array', function () {
    var _req = {
      ids: []
    }
    var _res = {}
    var _next = function (req, res, next) {
      req.ids.push('last')
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

    expect(_req.ids.join()).to.equal('first,second,third,fourth,last')
  })

  it('should run each middleware as a callback of the previous', function () {
    var _req = {
      ids: []
    }
    var _res = {}
    var _next = function (req, res) {
      if (req && req.ids) {
        req.ids.push('last')
        expect(req.ids.join()).to.equal('first,second,third,fourth,last')
      }
    }
    var first = function (req, res, next) {
      setTimeout(function () {
        req.ids.push('first')
        next()
      }, 150)
    }
    var second = function (req, res, next) {
      setTimeout(function () {
        req.ids.push('second')
        next()
      }, 50)
    }
    var third = function (req, res, next) {
      setTimeout(function () {
        req.ids.push('third')
        next()
      }, 100)
    }
    var fourth = function (req, res, next) {
      setTimeout(function () {
        req.ids.push('fourth')
        next()
      }, 150)
    }
    var mids = [first, second, third, fourth]

    connectSequence.run(_req, _res, _next, mids)
  })
})
