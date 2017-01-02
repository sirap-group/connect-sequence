'use strict'

var CustomError = require('./CustomError')

module.exports = PrivateMethodError

PrivateMethodError.DEFAULT_ERROR_MESSAGE = 'This is a private method'

PrivateMethodError.prototype = Object.create(CustomError.prototype)
PrivateMethodError.prototype.constructor = PrivateMethodError

/**
 * PrivateMethodError
 * @class
 * @property {String} message The error message
 * @property {String} stack The error stack trace
 *
 * @constructor
 * @param {String} msg A custom error message
 */
function PrivateMethodError (msg) {
  CustomError.call(this, msg)
}
