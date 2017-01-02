'use strict'

// var PrivateMethodError = require('./PrivateMethodError')
// var ProtectedMethodError = require('./ProtectedMethodError')

module.exports = CustomError

CustomError.prototype = Object.create(Error.prototype)
CustomError.prototype.constructor = CustomError
CustomError.prototype.setMessage = setMessage
CustomError.prototype.createStackTrace = createStackTrace

/**
 * CustomError
 * @class
 * @mixin
 * @property {String} message The error message
 * @property {String} stack The error stack trace
 *
 * @constructor
 * @param {String} [msg] The error message
 */
function CustomError (msg) {
  // Error.call(this, msg)
  this.setMessage(msg)
  this.createStackTrace()
}

/**
 * Set the error message from the given argument or from the class property DEFAULT_ERROR_MESSAGE
 * @method
 */
function setMessage (msg) {
  if (msg && typeof msg === 'string') {
    this.message = msg
  } else if (this.constructor.name !== 'CustomError') {
    this.message = this.constructor.DEFAULT_ERROR_MESSAGE
  } else {
    this.message = undefined
  }
}

/**
 * Set the the correct stack trace for this error
 * @method
 * @returns {undefined}
 * @throws {PrivateMethodError}
 */
function createStackTrace () {
  var stack = new Error().stack
  var splited = stack.split('\n')
  var modifiedStack = splited[0].concat('\n', splited.splice(3).join('\n'))
  this.stack = modifiedStack
}
