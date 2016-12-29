'use strict'

var MissingArgumentError = require('./errors/MissingArgumentError')

module.exports = ConnectSequence

/**
 * @class
 * @param {Array<Function>} [middlewareList] A list of middlewares to run
 */
function ConnectSequence () {
  this.middlewares = []
}

ConnectSequence.run = deprecatedRun

ConnectSequence.prototype = {
  append: append,
  appendList: appendList,
  run: run
}

/**
 * Run sequencially each appended middleware, using the next argument as the final callback.
 * @method
 * @param {object} req The request object
 * @param {object} res The response object
 * @param {function} next The next middleware
 * @returns {undefined}
 */
function run (req, res, next) {
  var errorMsg
  if (arguments.length < 3) {
    errorMsg = 'ConnectSequence#run() takes 3 arguments. '
    errorMsg += arguments.length + ' given.'
    throw new MissingArgumentError(errorMsg)
  }
  if (typeof req !== 'object') {
    errorMsg = 'The first argument must be a request object. '
    errorMsg += typeof req + ' given.'
    throw new TypeError(errorMsg)
  }
  if (typeof res !== 'object') {
    errorMsg = 'The second argument must be a request object. '
    errorMsg += typeof req + ' given.'
    throw new TypeError(errorMsg)
  }
  if (typeof next !== 'function') {
    errorMsg = 'The third argument must be a middleware function. '
    errorMsg += typeof req + ' given.'
    throw new TypeError(errorMsg)
  }

  var midSequence = this.middlewares.reverse()
  var initialNext = next.bind(null, req, res, next)
  var nestedCallSequence = midSequence.reduce(middlewareReducer, initialNext)
  nestedCallSequence.call()

  function middlewareReducer (prev, current) {
    return current.bind(null, req, res, prev)
  }
}

/**
 * Run sequentially each middleware in the given array, in the array order, throwing req and res object into.
 * @function
 * @static
 * @deprecated
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} initialNext The initial next middleware given at start, which should be run at last
 * @param {Array<Function>} middlewares The given array of middlewares
 * @example
 ```js
 var connectSequence = require('connect-sequence')
 var mids = []
 mids.push(function (req, res, next) { ...  })
 ...
 mids.push(function (req, res, next) { ...  })
 connectSequence.run(req, res, next, mids)
 ```
 */
function deprecatedRun (req, res, initialNext, middlewares) {
  var deprecatedMessage = 'Deprecated: The static method ConnectSequence.run() is deprecated.'
  process.emitWarning(deprecatedMessage)
  middlewares.reverse().reduce(middlewareReducer, initialNext.bind(null, req, res, initialNext)).call()

  function middlewareReducer (prev, current) {
    return current.bind(null, req, res, prev)
  }
}

/**
 * Append an arbitrary number of middlewares as argument list or as an array
 * @method
 * @throws TypeError if one of the given middlewares is not a function. All the given middlewares would be rejected.
 */
function append () {
  var i
  for (i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] !== 'function') {
      var type = typeof arguments[i]
      var errMsg = 'Given middlewares must be functions. "' + type + '" given.'
      throw new TypeError(errMsg)
    }
  }
  for (i = 0; i < arguments.length; i++) {
    this.middlewares.push(arguments[i])
  }
}

/**
 * Append many middlewares in an array
 * @method
 * @param {array}
 */
function appendList (middlewares) {
  if (!Array.isArray(middlewares)) {
    var errorMsg = 'First argument must be an array of middlewares. '
    errorMsg += typeof middlewares + ' given.'
    throw new TypeError(errorMsg)
  }
  return this.append.apply(this, middlewares)
}
