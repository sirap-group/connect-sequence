'use strict'

var path = require('path')
var chai = require('chai')
var ConnectSequence = require(path.resolve('./lib/ConnectSequence'))
var MissingArgumentError = require(path.resolve('./lib/errors/MissingArgumentError'))

var describe = global.describe
var before = global.before
var it = global.it
var expect = chai.expect

process.env.NODE_ENV = 'test'

describe('ConnectSequence', function () {
  it('should be a function', function () {
    expect(ConnectSequence).to.be.a('function')
  })

  it('should have a "run" property', function () {
    expect(ConnectSequence).to.have.property('run')
  })

  it('should have a prototype', function () {
    expect(ConnectSequence).to.have.property('prototype')
  })

  describe('.run()', function () {
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

  describe('.prototype', function () {
    it('should be an object', function () {
      expect(ConnectSequence.prototype).to.be.a('object')
    })

    it('should have a "append" method', function () {
      expect(ConnectSequence.prototype).to.have.property('append')
      expect(ConnectSequence.prototype.append).to.be.a('function')
    })

    it('should have a "appendList" method', function () {
      expect(ConnectSequence.prototype).to.have.property('appendList')
      expect(ConnectSequence.prototype.appendList).to.be.a('function')
    })

    it('should have a "run" method', function () {
      expect(ConnectSequence.prototype).to.have.property('run')
      expect(ConnectSequence.prototype.appendList).to.be.a('function')
    })

    describe('.constructor', function () {
      it('should be an object of type "ConnectSequence"', function () {
        var seq = new ConnectSequence()
        expect(seq).to.be.a('object')
        expect(seq).to.be.an.instanceof(ConnectSequence)
      })

      it('should init the "middleware" instance property as an empty Array', function () {
        var seq = new ConnectSequence()
        expect(seq).to.has.a.property('middlewares')
        expect(seq.middlewares).to.be.a('array')
        expect(seq.middlewares.length).to.be.equal(0)
      })
    })
  })

  describe('#append()', function () {
    it('should augments the length of the middlewares array by the number of given middlewares', function () {
      var seq = new ConnectSequence()
      var mid = function (req, res, next) { next() }
      seq.append(mid)
      expect(seq.middlewares.length).to.equal(1)
      seq.append(mid)
      expect(seq.middlewares.length).to.equal(2)
      seq.append(mid, mid)
      expect(seq.middlewares.length).to.equal(4)
      seq.append()
      expect(seq.middlewares.length).to.equal(4)
      seq.append(mid, mid, mid)
      expect(seq.middlewares.length).to.equal(7)
    })

    it('should keep the same order of the given middlewares', function () {
      var seq = new ConnectSequence()
      var mid0 = function (req, res, next) { next() }
      var mid1 = function (req, res, next) { next() }
      var mid2 = function (req, res, next) { next() }
      var mid3 = function (req, res, next) { next() }
      var mid4 = function (req, res, next) { next() }
      var mid5 = function (req, res, next) { next() }
      var mid6 = function (req, res, next) { next() }
      seq.append(mid0)
      seq.append(mid1, mid2)
      seq.append()
      seq.append(mid3, mid4, mid5)
      seq.append(mid6)
      var mids = [mid0, mid1, mid2, mid3, mid4, mid5, mid6]
      for (var i = 0; i < mids.length; i++) {
        var mid = mids[i]
        expect(seq.middlewares[i]).to.equal(mid)
      }
    })

    it('should throw a TypeError and reject all middlewares if one is not a function', function () {
      var seq = new ConnectSequence()
      var mid1 = function (req, res, next) { next() }
      var mid2 = 'not a function'
      var mid3 = function (req, res, next) { next() }
      var cantAppend = function () {
        seq.append(mid1, mid2, mid3)
      }
      var shouldAppend = function () {
        seq.append(mid1, mid3)
      }
      expect(cantAppend).to.throw(TypeError)
      expect(seq.middlewares.length).to.be.equal(0)
      expect(shouldAppend).to.not.throw(Error)
      expect(seq.middlewares.length).to.be.equal(2)
    })
  })

  describe('#appendList()', function () {
    it('should throw TypeError if the first argument is not an array', function () {
      var funcs = [
        function () {
          var seq = new ConnectSequence()
          seq.appendList('not an array')
        },
        function () {
          var seq = new ConnectSequence()
          seq.appendList({foo: 'not an array'})
        },
        function () {
          var seq = new ConnectSequence()
          seq.appendList(function () { return 'not an array' })
        }
      ]
      for (var i = 0; i < funcs.length; i++) {
        expect(funcs[i]).to.throw(TypeError)
      }
    })

    it('should augments the length of the middlewares array by the number of given middlewares', function () {
      var seq = new ConnectSequence()
      var mid = function (req, res, next) { next() }
      seq.appendList([mid])
      expect(seq.middlewares.length).to.equal(1)
      seq.appendList([mid])
      expect(seq.middlewares.length).to.equal(2)
      seq.appendList([mid, mid])
      expect(seq.middlewares.length).to.equal(4)
      seq.appendList([])
      expect(seq.middlewares.length).to.equal(4)
      seq.appendList([mid, mid, mid])
      expect(seq.middlewares.length).to.equal(7)
    })

    it('should keep the same order of the given middlewares', function () {
      var seq = new ConnectSequence()
      var mid0 = function (req, res, next) { next() }
      var mid1 = function (req, res, next) { next() }
      var mid2 = function (req, res, next) { next() }
      var mid3 = function (req, res, next) { next() }
      var mid4 = function (req, res, next) { next() }
      var mid5 = function (req, res, next) { next() }
      var mid6 = function (req, res, next) { next() }
      seq.appendList([mid0])
      seq.appendList([mid1, mid2])
      seq.appendList([])
      seq.appendList([mid3, mid4, mid5])
      seq.appendList([mid6])
      var mids = [mid0, mid1, mid2, mid3, mid4, mid5, mid6]
      for (var i = 0; i < mids.length; i++) {
        var mid = mids[i]
        expect(seq.middlewares[i]).to.equal(mid)
      }
    })

    it('should throw a TypeError and reject all middlewares if one is not a function', function () {
      var seq = new ConnectSequence()
      var mid1 = function (req, res, next) { next() }
      var mid2 = 'not a function'
      var mid3 = function (req, res, next) { next() }
      var cantAppend = function () {
        seq.appendList([mid1, mid2, mid3])
      }
      var shouldAppend = function () {
        seq.appendList([mid1, mid3])
      }
      expect(cantAppend).to.throw(TypeError)
      expect(seq.middlewares.length).to.be.equal(0)
      expect(shouldAppend).to.not.throw(Error)
      expect(seq.middlewares.length).to.be.equal(2)
    })
  })

  describe('#run()', function () {
    it('should be a function', function () {
      var seq = new ConnectSequence()
      expect(seq.run).to.be.a('function')
    })

    it('should throw MissingArgumentError if called with lower than 3 arguments', function () {
      var seq = new ConnectSequence()
      var req = {}
      var res = {}
      var func = function () {
        var mid0 = function (req, res, next) { next() }
        var mid1 = function (req, res, next) { next() }
        var mid2 = function (req, res, next) { next() }
        var mid3 = function (req, res, next) { next() }
        seq.appendList([mid0, mid1, mid2, mid3])
        seq.run(req, res)
      }
      expect(func).to.throw(MissingArgumentError)
    })

    it('should throw TypeError if the given arguments have a bad type', function () {
      var seq = new ConnectSequence()
      var next = function (req, res) { return true }
      var mid0 = function (req, res, next) { next() }
      var mid1 = function (req, res, next) { next() }
      var mid2 = function (req, res, next) { next() }
      var mid3 = function (req, res, next) { next() }
      seq.appendList([mid0, mid1, mid2, mid3])

      var func0 = function () { seq.run({}, {}, 'not a function') }
      var func1 = function () { seq.run({}, 'not an object', next) }
      var func2 = function () { seq.run('not an object', {}, next) }
      var funcs = [func0, func1, func2]
      for (var i = 0; i < funcs.length; i++) {
        expect(funcs[i]).to.throw(TypeError)
      }
    })

    it.skip('should run the initial next middleware at last', function () {
      var req = {}
      var res = {}
      var _next
      var seq = new ConnectSequence()
      var first = function (req, res, next) {
        req.output = 'first'
      }
      seq.appendList([first, first, first, first])
      before(function (done) {
        seq.run(req, res, _next)
        _next = function (req, res) {
          req.output = 'initialNext'
          done()
        }
      })
      expect(req.output).to.equal('initialNext')
    })
  })
})
