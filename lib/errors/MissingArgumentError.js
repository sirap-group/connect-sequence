'use strict'

var CustomError = require('./CustomError')

module.exports = MissingArgumentError

MissingArgumentError.DEFAULT_ERROR_MESSAGE = 'One or more argument are missing'

MissingArgumentError.prototype = Object.create(CustomError.prototype)
MissingArgumentError.prototype.constructor = MissingArgumentError

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
  CustomError.call(this, msg)
}
