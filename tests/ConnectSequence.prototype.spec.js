'use strict'

var path = require('path')
var chai = require('chai')
var ConnectSequence = require(path.resolve('./lib/connect-sequence'))

var describe = global.describe
var it = global.it
var expect = chai.expect

describe('ConnectSequence', function () {
  it('should be a function', function () {
    expect(ConnectSequence).to.be.a('function')
  })

  it('should contain the `run` property', function () {
    expect(ConnectSequence).to.have.property('run')
  })

  it('should have a prototype', function () {
    expect(ConnectSequence).to.have.property('prototype')
  })
})
