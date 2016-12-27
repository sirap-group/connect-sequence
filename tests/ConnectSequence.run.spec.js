'use strict'

var path = require('path')
var chai = require('chai')
var ConnectSequence = require(path.resolve('./lib/connect-sequence'))

var describe = global.describe
var it = global.it
var expect = chai.expect

describe('ConnectSequence.run()', function () {
  it('should be a function', function () {
    expect(ConnectSequence.run).to.be.a('function')
  })

  it('should throw an Error if one argument is missing', function () {
    var initMid = function (req, res) {}
    var noopMid = function (req, res, next) { next() }
    var run0 = function () {
      ConnectSequence.run()
    }
    var run1 = function () {
      ConnectSequence.run({})
    }
    var run2 = function () {
      ConnectSequence.run({}, {})
    }
    var run3 = function () {
      ConnectSequence.run({}, {}, function (next) { next() })
    }
    var run4 = function () {
      ConnectSequence.run({}, {}, noopMid)
    }
    var run5 = function () {
      ConnectSequence.run({}, {}, initMid, [noopMid, noopMid, noopMid])
    }
    expect(run0).to.throw(Error)
    expect(run1).to.throw(Error)
    expect(run2).to.throw(Error)
    expect(run3).to.throw(Error)
    expect(run4).to.throw(Error)
    expect(run5).to.not.throw(Error)
  })

  it('should run the initial next middleware at last', function () {
    var _req = {}
    var _res = {}
    var _next = function (req, res) {
      req.output = 'initialNext'
      expect(req.output).to.equal('initialNext')
    }
    var first = function (req, res, next) {
      req.output = 'first'
    }
    var second = first
    var third = first
    var fourth = first
    var mids = [first, second, third, fourth]

    ConnectSequence.run(_req, _res, _next, mids)
  })

  it('should run all the middlewares in the passed array of middlewares', function () {
    var _req = {
      ids: []
    }
    var _res = {}
    var _next = function (req, res) {
      req.ids.push('initial')
      expect(req.ids).to.contain('initial')
      expect(req.ids).to.contain('first')
      expect(req.ids).to.contain('second')
      expect(req.ids).to.contain('third')
      expect(req.ids).to.contain('fourth')
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

    ConnectSequence.run(_req, _res, _next, mids)
  })

  it('should run all the middlewares in the same order than the given array', function () {
    var _req = {
      ids: []
    }
    var _res = {}
    var _next = function (req, res) {
      req.ids.push('last')
      expect(req.ids.join()).to.equal('first,second,third,fourth,last')
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

    ConnectSequence.run(_req, _res, _next, mids)
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

    ConnectSequence.run(_req, _res, _next, mids)
  })
})
