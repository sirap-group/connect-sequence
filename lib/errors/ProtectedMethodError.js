'use strict'

var CustomError = require('./CustomError')

module.exports = ProtectedMethodError

ProtectedMethodError.DEFAULT_ERROR_MESSAGE = 'This is a protected method'

ProtectedMethodError.prototype = Object.create(CustomError.prototype)
ProtectedMethodError.prototype.constructor = ProtectedMethodError

/**
 * ProtectedMethodError
 * @class
 * @property {String} message The error message
 * @property {String} stack The error stack trace
 *
 * @constructor
 * @param {String} msg A custom error message
 */
function ProtectedMethodError (msg) {
  CustomError.call(this, msg)
}
