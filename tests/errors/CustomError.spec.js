'use strict'

var path = require('path')
var chai = require('chai')
var CustomError = require(path.resolve('./lib/errors/CustomError'))

var describe = global.describe
var it = global.it
var expect = chai.expect

describe('CustomError', function () {
  it('should be a function', function () {
    expect(CustomError).to.be.a('function')
  })

  it("should not have a 'DEFAULT_ERROR_MESSAGE' static constant property (child classes should have one)", function () {
    expect(CustomError).to.not.have.a.property('DEFAULT_ERROR_MESSAGE')
  })

  describe('.prototype', function () {
    it('should be a function', function () {
      expect(CustomError.prototype).to.be.a('OBJECT')
    })

    it('should be an instance of Error', function () {
      expect(CustomError.prototype).to.be.an.instanceof(Error)
    })

    describe('.constructor()', function () {
      it('should be an instance of CustomError', function () {
        var err = new CustomError()
        expect(CustomError.prototype).to.be.an.instanceof(Error)
        expect(err).to.be.an.instanceof(CustomError)
      })

      it("should have a 'name' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new CustomError(msg)
        expect(err).to.be.a.property('name')
        expect(err.message).to.be.a('String')
      })

      it("should have a 'message' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new CustomError(msg)
        expect(err).to.be.a.property('message')
        expect(err.message).to.be.a('String')
        expect(err.message).to.equal(msg)
      })

      it("should have a 'stack' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new CustomError(msg)
        expect(err).to.be.a.property('stack')
        expect(err.stack).to.be.a('String')
      })

      it("should have a 'createStackTrace' property of type 'function'", function () {
        var err = new CustomError('yo')
        expect(err).to.have.a.property('createStackTrace')
        expect(err.createStackTrace).to.be.a('function')
      })

      it("should have a 'privatize' property of type 'function'", function () {
        var err = new CustomError()
        expect(err).to.be.a.property('privatize')
        expect(err.privatize).to.be.a('function')
      })

      it("should have a 'protect' property of type 'function'", function () {
        var err = new CustomError()
        expect(err).to.be.a.property('protect')
        expect(err.protect).to.be.a('function')
      })

      it('should not fail if an bad type is given instead of a string as first argument', function () {
        var err
        var func = function () { err = new CustomError(func) }
        var obj = function () { err = new CustomError({ foo: 'bar' }) }
        var arr = function () { err = new CustomError([ 'foo', 'baz' ]) }

        expect(func).to.not.throw('TypeError')
        expect(obj).to.not.throw('TypeError')
        expect(arr).to.not.throw('TypeError')
      })

      it('should fails if we call the private createStackTrace method', function () {
        var func = function () {
          var err = new CustomError(func)
          var t = err.createStackTrace()
          console.log(t)
        }
        expect(func).to.throw(Error)
      })

      it('should fails if a child class call the protected createStackTrace method', function () {
        var func = function () {
          var err = new CustomError(func)
          var t = err.createStackTrace()
          console.log(t)
        }
        expect(func).to.throw(Error)
      })

      it('should not have a default error message if no argument is given (child class should have)', function () {
        var err = new CustomError()
        expect(err.message).to.not.be.a('String')
        expect(err.message).to.be.undefined
      })
    })
  })
})
