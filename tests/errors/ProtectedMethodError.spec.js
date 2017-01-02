'use strict'

var path = require('path')
var chai = require('chai')
var CustomError = require(path.resolve('./lib/errors/CustomError'))
var ProtectedMethodError = require(path.resolve('./lib/errors/ProtectedMethodError'))
var PrivateMethodError = require(path.resolve('./lib/errors/PrivateMethodError'))

var describe = global.describe
var beforeEach = global.beforeEach
var it = global.it
var expect = chai.expect

describe('ProtectedMethodError', function () {
  it('should be a function', function () {
    expect(ProtectedMethodError).to.be.a('function')
  })

  it("should have a 'DEFAULT_ERROR_MESSAGE' static constant property", function () {
    expect(ProtectedMethodError).to.be.a.property('DEFAULT_ERROR_MESSAGE')
  })

  describe('.prototype', function () {
    it('should be an object', function () {
      expect(ProtectedMethodError.prototype).to.be.a('object')
    })

    it('should be an instance of CustomError', function () {
      expect(ProtectedMethodError.prototype).to.be.an.instanceof(CustomError)
    })

    describe('.constructor', function () {
      it('should be a function', function () {
        expect(ProtectedMethodError.prototype.constructor).to.be.a('function')
      })

      it("should have a 'name' property w/ the value 'ProtectedMethodError'", function () {
        expect(ProtectedMethodError.prototype.constructor).to.be.a.property('name')
        expect(ProtectedMethodError.prototype.constructor.name).to.equal('ProtectedMethodError')
      })
    })

    describe('.constructor()', function () {
      it('should be an instance of ProtectedMethodError', function () {
        var err = new ProtectedMethodError()
        expect(err).to.be.an.instanceof(ProtectedMethodError)
      })

      it("should have a 'message' property of type 'String'", function () {
        var msg = 'i am private'
        var err = new ProtectedMethodError(msg)
        expect(err).to.be.a.property('message')
        expect(err.message).to.be.a('String')
      })

      it("should have a 'stack' property of type 'String'", function () {
        var msg = 'i am private'
        var err = new ProtectedMethodError(msg)
        expect(err).to.be.a.property('stack')
        expect(err.stack).to.be.a('String')
      })

      describe('when a non-string argument is given', function () {
        var err0, err1, err2
        var func, obj, arr

        beforeEach(function () {
          func = function () { err0 = new ProtectedMethodError(func) }
          obj = function () { err1 = new ProtectedMethodError({ foo: 'bar' }) }
          arr = function () { err2 = new ProtectedMethodError([ 'foo', 'baz' ]) }
        })

        it('should not fail', function () {
          expect(func).to.not.throw()
          expect(obj).to.not.throw()
          expect(arr).to.not.throw()
        })

        it('should define the "message" property as a String', function () {
          expect(err0.message).to.be.a('String')
          expect(err1.message).to.be.a('String')
          expect(err2.message).to.be.a('String')
        })
      })

      describe('when no argument is given', function () {
        it('should set the default error message', function () {
          var err = new ProtectedMethodError()
          expect(err.message).to.be.a('String')
          expect(err.message).to.be.equal(ProtectedMethodError.DEFAULT_ERROR_MESSAGE)
        })
      })
    })

    describe('#setMessage()', function () {
      describe('when called from outside', function () {
        it('should throw "PrivateMethodError"', function () {
          var func = function () {
            var err = new ProtectedMethodError(func)
            return err.setMessage('foo')
          }
          expect(func).to.throw(Error)
        })
      })
    })

    describe('#createStackTrace()', function () {
      describe('when called from outside', function () {
        it('should throw "PrivateMethodError"', function () {
          expect(function () {
            return new ProtectedMethodError('foo').createStackTrace()
          }).to.throw(PrivateMethodError)
        })
      })
    })
  })
})
