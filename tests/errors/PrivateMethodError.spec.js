'use strict'

var path = require('path')
var chai = require('chai')
var PrivateMethodError = require(path.resolve('./lib/errors/PrivateMethodError'))

var describe = global.describe
var it = global.it
var expect = chai.expect

describe('PrivateMethodError', function () {
  it('should be a function', function () {
    expect(PrivateMethodError).to.be.a('function')
  })
  it("should has a 'DEFAULT_ERROR_MESSAGE' static constant property", function () {
    expect(PrivateMethodError).to.be.a.property('DEFAULT_ERROR_MESSAGE')
  })

  describe('.prototype', function () {
    it('should be an object', function () {
      expect(PrivateMethodError.prototype).to.be.a('object')
    })
    it('should be an instance of Error', function () {
      expect(PrivateMethodError.prototype).to.be.an.instanceof(Error)
    })

    describe('.constructor()', function () {
      it('should be an instance of PrivateMethodError', function () {
        var err = new PrivateMethodError()
        expect(err).to.be.an.instanceof(PrivateMethodError)
      })
      it("should has a 'name' property of type 'String'", function () {
        var msg = 'i am private'
        var err = new PrivateMethodError(msg)
        expect(err).to.be.a.property('name')
        expect(err.message).to.be.a('String')
      })
      it("should has a 'message' property of type 'String'", function () {
        var msg = 'i am private'
        var err = new PrivateMethodError(msg)
        expect(err).to.be.a.property('message')
        expect(err.message).to.be.a('String')
      })
      it("should has a 'stack' property of type 'String'", function () {
        var msg = 'i am private'
        var err = new PrivateMethodError(msg)
        expect(err).to.be.a.property('stack')
        expect(err.stack).to.be.a('String')
      })
      it('should not fail if an bad type is given instead of a string as first argument', function () {
        var err
        var func = function () { err = new PrivateMethodError(func) }
        var obj = function () { err = new PrivateMethodError({ foo: 'bar' }) }
        var arr = function () { err = new PrivateMethodError([ 'foo', 'baz' ]) }

        expect(func).to.not.throw('TypeError')
        expect(err.message).to.be.a('String')

        expect(obj).to.not.throw('TypeError')
        expect(err.message).to.be.a('String')

        expect(arr).to.not.throw('TypeError')
        expect(err.message).to.be.a('String')
      })
      it('should fails if we call the private createStackTrace method', function () {
        var func = function () {
          var err = new PrivateMethodError(func)
          var t = err.createStackTrace()
          console.log(t)
        }
        expect(func).to.throw(Error)
      })
      it('should has a default error message if no argument is given', function () {
        var err = new PrivateMethodError()
        expect(err.message).to.be.a('String')
        expect(err.message).to.be.equal(PrivateMethodError.DEFAULT_ERROR_MESSAGE)
      })
    })
  })
})