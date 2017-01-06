'use strict'

var path = require('path')
var chai = require('chai')
var ConnectSequence = require(path.resolve('./index'))

var describe = global.describe
var it = global.it
var expect = chai.expect

describe('The global exported module', function () {
  it('should export the ConnectSequence class', function () {
    expect(ConnectSequence).to.be.a('function')
    expect(ConnectSequence.prototype).to.be.an('object')
    expect(ConnectSequence.prototype.constructor).to.be.a('function')
    expect(ConnectSequence.name).to.equal('ConnectSequence')
  })
})
