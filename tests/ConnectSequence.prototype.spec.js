'use strict'

var path = require('path')
var chai = require('chai')
var ConnectSequence = require(path.resolve('./lib/ConnectSequence'))

var describe = global.describe
var it = global.it
var expect = chai.expect

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
})

describe('ConnectSequence.prototype', function () {
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
})

describe('new ConnectSequence()', function () {
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

describe('new ConnectSequence().append(mid_1, mid_2, ..., mid_n)', function () {
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

describe('new ConnectSequence().appendList([mid_1, mid_2, ..., mid_n])', function () {
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
