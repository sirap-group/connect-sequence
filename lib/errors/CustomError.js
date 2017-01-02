'use strict'

var path = require('path')
var PrivateMethodError = require('./PrivateMethodError')

module.exports = CustomError

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
  if (msg && typeof msg === 'string') {
    this.message = msg
  } else if (this.constructor.name !== 'CustomError') {
    this.message = global[this.constructor.name].DEFAULT_ERROR_MESSAGE
  } else {
    this.message = undefined
  }
  this.createStackTrace()
}

CustomError.prototype = Object.create(Error.prototype)
CustomError.prototype.constructor = CustomError
CustomError.prototype.createStackTrace = createStackTrace
CustomError.prototype.protect = protect
CustomError.prototype.privatize = privatize

/**
 * Set the the correct stack trace for this error
 * @method
 * @returns {undefined}
 * @throws {PrivateMethodError}
 */
function createStackTrace () {
  privatize()
  var stack = new Error().stack
  var splited = stack.split('\n')
  var modifiedStack = splited[0].concat('\n', splited.splice(3).join('\n'))
  this.stack = modifiedStack
}

/**
 * Throws a PrivateMethodError if the caller is not CustomError
 * @function
 * @inner
 * @returns {undefined}
 * @throws {PrivateMethodError}
 */
function privatize () {
  var trace = new Error().stack
  var here = getFileCall(trace, 1)
  var caller = getFileCall(trace, 3)
  if (here !== caller) {
    throw new PrivateMethodError()
  }
}

/**
 * Throws a ProtectedMethodError if the caller is not a child class of CustomError
 * @method
 * @returns {undefined}
 * @throws {ProtectedMethodError}
 */
function protect (sourcePath) {
  var trace = new Error().stack
  var caller = getFileCall(trace, 3)
  if (sourcePath !== caller) {
    // throw new ProtectedMethodError()
    throw new Error()
  }
}

/**
 * Get the file path of the caller at a given stack level
 * @function
 * @inner
 * @param {String} trace A given stack trace
 * @param {Number} level A given stack level to get the file path at this level
 * @returns {String} The file path for this level
 */
function getFileCall (trace, level) {
  var firstLineOfStack = trace.split('\n')[level]
  var splitted = firstLineOfStack.split('(')
  firstLineOfStack = splitted.splice(1).join('')
  splitted = firstLineOfStack.split(')')
  firstLineOfStack = splitted.join('')
  splitted = firstLineOfStack.split(':')
  firstLineOfStack = splitted.slice(0, -2).join('')
  return firstLineOfStack
}
