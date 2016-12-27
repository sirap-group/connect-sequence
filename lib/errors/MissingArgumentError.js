'use strict'

var PrivateMethodError = require('./PrivateMethodError')

module.exports = MissingArgumentError

/**
 * MissingArgumentError
 * @class
 * @property {String} message The error message
 * @property {String} stack The error stack trace
 *
 * @constructor
 * @param {String} [msg] The error message
 */
function MissingArgumentError (msg) {
  // Error.call(this, msg)
  if (msg && typeof msg === 'string') {
    this.message = msg
  } else {
    this.message = MissingArgumentError.DEFAULT_ERROR_MESSAGE
  }
  this.createStackTrace()
}

MissingArgumentError.DEFAULT_ERROR_MESSAGE = 'One or more argument are missing'

MissingArgumentError.prototype = Object.create(Error.prototype)
MissingArgumentError.prototype.constructor = MissingArgumentError
MissingArgumentError.prototype.createStackTrace = createStackTrace

/**
 * Set the the correct stack trace for this error
 * @method
 * @private
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
 * Throws a PrivateMethodError if the third level of a new stack trace differs of the first
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