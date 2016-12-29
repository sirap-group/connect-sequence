'use strict'

var path = require('path')
var chai = require('chai')
var MissingArgumentError = require(path.resolve('./lib/errors/MissingArgumentError'))

var describe = global.describe
var it = global.it
var expect = chai.expect

describe('MissingArgumentError', function () {
  it('should be a function', function () {
    expect(MissingArgumentError).to.be.a('function')
  })
  it("should has a 'DEFAULT_ERROR_MESSAGE' static constant property", function () {
    expect(MissingArgumentError).to.be.a.property('DEFAULT_ERROR_MESSAGE')
  })

  describe('.prototype', function () {
    it('should be a function', function () {
      expect(MissingArgumentError.prototype).to.be.a('OBJECT')
    })
    it('should be an instance of Error', function () {
      expect(MissingArgumentError.prototype).to.be.an.instanceof(Error)
    })

    describe('.constructor()', function () {
      it('should be an instance of Error', function () {
        var err = new MissingArgumentError()
        expect(MissingArgumentError.prototype).to.be.an.instanceof(Error)
        expect(err).to.be.an.instanceof(MissingArgumentError)
      })
      it("should has a 'name' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new MissingArgumentError(msg)
        expect(err).to.be.a.property('name')
        expect(err.message).to.be.a('String')
      })
      it("should has a 'message' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new MissingArgumentError(msg)
        expect(err).to.be.a.property('message')
        expect(err.message).to.be.a('String')
      })
      it("should has a 'stack' property of type 'String'", function () {
        var msg = "'arg' is missing"
        var err = new MissingArgumentError(msg)
        expect(err).to.be.a.property('stack')
        expect(err.stack).to.be.a('String')
      })
      it('should not fail if an bad type is given instead of a string as first argument', function () {
        var err
        var func = function () { err = new MissingArgumentError(func) }
        var obj = function () { err = new MissingArgumentError({ foo: 'bar' }) }
        var arr = function () { err = new MissingArgumentError([ 'foo', 'baz' ]) }

        expect(func).to.not.throw('TypeError')
        expect(err.message).to.be.a('String')

        expect(obj).to.not.throw('TypeError')
        expect(err.message).to.be.a('String')

        expect(arr).to.not.throw('TypeError')
        expect(err.message).to.be.a('String')
      })
      it('should fails if we call the private createStackTrace method', function () {
        var func = function () {
          var err = new MissingArgumentError(func)
          var t = err.createStackTrace()
          console.log(t)
        }
        expect(func).to.throw(Error)
      })
      it('should has a default error message if no argument is given', function () {
        var err = new MissingArgumentError()
        expect(err.message).to.be.a('String')
        expect(err.message).to.be.equal(MissingArgumentError.DEFAULT_ERROR_MESSAGE)
      })
    })
  })
})
