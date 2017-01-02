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

  it("should not have a 'DEFAULT_ERROR_MESSAGE' static constant property (child classes should)", function () {
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

      describe('when giving a non-string argument', function () {
        it('should not fail', function () {
          var func = function () { return new CustomError(func) }
          var obj = function () { return new CustomError({ foo: 'bar' }) }
          var arr = function () { return new CustomError([ 'foo', 'baz' ]) }

          expect(func).to.not.throw()
          expect(obj).to.not.throw()
          expect(arr).to.not.throw()
        })
      })

      describe('when called without argument', function () {
        it('should not have a default error message (child classes should)', function () {
          var err = new CustomError()
          expect(err.message).to.not.be.a('String')
          expect(err.message).to.be.undefined
        })
      })

      describe('when called without argument from a child class', function () {
        it('should set the child class DEFAULT_ERROR_MESSAGE', function () {
          var err
          var ChildError = function ChildError (msg) {
            CustomError.call(this, msg)
          }
          ChildError.prototype = Object.create(CustomError.prototype)
          ChildError.prototype.constructor = ChildError
          ChildError.DEFAULT_ERROR_MESSAGE = 'child error'
          err = new ChildError()
          expect(err).to.be.an('object')
          expect(err).to.be.an.instanceof(ChildError)
          expect(err.message).to.be.a('string')
          expect(err.message).to.equal(ChildError.DEFAULT_ERROR_MESSAGE)
        })
      })
    })
  })
})
