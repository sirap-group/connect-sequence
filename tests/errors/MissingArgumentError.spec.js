'use strict'

var path = require('path')
var chai = require('chai')
var CustomError = require(path.resolve('./lib/errors/CustomError'))
var MissingArgumentError = require(path.resolve('./lib/errors/MissingArgumentError'))

var describe = global.describe
var beforeEach = global.beforeEach
var it = global.it
var expect = chai.expect

describe('MissingArgumentError', function () {
  it('should be a function', function () {
    expect(MissingArgumentError).to.be.a('function')
  })

  it("should have a 'DEFAULT_ERROR_MESSAGE' static constant property", function () {
    expect(MissingArgumentError).to.have.a.property('DEFAULT_ERROR_MESSAGE')
  })

  describe('.prototype', function () {
    it('should be an object', function () {
      expect(MissingArgumentError.prototype).to.be.an('object')
    })

    it('should be an instance of CustomError', function () {
      expect(MissingArgumentError.prototype).to.be.an.instanceof(CustomError)
    })

    describe('.constructor', function () {
      it('should be a function', function () {
        expect(MissingArgumentError.prototype.constructor).to.be.a('function')
      })

      it("should have a 'name' property w/ the value 'MissingArgumentError'", function () {
        expect(MissingArgumentError.prototype.constructor).to.be.a.property('name')
        expect(MissingArgumentError.prototype.constructor.name).to.equal('MissingArgumentError')
      })
    })

    describe('.constructor()', function () {
      it('should be an instance of MissingArgumentError', function () {
        var err = new MissingArgumentError()
        expect(err).to.be.an.instanceof(MissingArgumentError)
      })

      it("should have a 'message' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new MissingArgumentError(msg)
        expect(err).to.be.a.property('message')
        expect(err.message).to.be.a('String')
      })

      it("should have a 'stack' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new MissingArgumentError(msg)
        expect(err).to.have.a.property('stack')
        expect(err.stack).to.be.a('String')
      })

      describe('when a non-string argument is given', function () {
        var err0, err1, err2
        var func, obj, arr

        beforeEach(function () {
          func = function () { err0 = new MissingArgumentError(func) }
          obj = function () { err1 = new MissingArgumentError({ foo: 'bar' }) }
          arr = function () { err2 = new MissingArgumentError([ 'foo', 'baz' ]) }
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
          var err = new MissingArgumentError()
          expect(err.message).to.be.a('String')
          expect(err.message).to.be.equal(MissingArgumentError.DEFAULT_ERROR_MESSAGE)
        })
      })
    })
  })
})
