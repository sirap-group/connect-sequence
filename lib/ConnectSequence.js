'use strict'

var MissingArgumentError = require('./errors/MissingArgumentError')

module.exports = ConnectSequence

/**
 * @class
 * @param {Array<Function>} [middlewareList] A list of middlewares to run
 * @param {object} req The request object
 * @param {object} res The response object
 * @param {function} next The next middleware
 * @returns {undefined}
 */
function ConnectSequence (req, res, next) {
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

  this.req = req
  this.res = res
  this.next = next
  this.middlewares = []
}

ConnectSequence.run = deprecatedRun

ConnectSequence.prototype = {
  append: append,
  appendList: appendList,
  appendIf: appendIf,
  run: run
}

/**
 * Run sequencially each appended middleware, using the next argument as the final callback.
 * @method
 * @returns {undefined}
 */
function run () {
  var midSequence = this.middlewares.reverse()
  var initialNext = this.next.bind()
  var req = this.req
  var res = this.res
  var nestedCallSequence

  // create the call sequence
  nestedCallSequence = midSequence.reduce(middlewareReducer, initialNext)
  // call it
  nestedCallSequence.call()

  /**
   * Reduce the middleware sequence to a nested middleware handler sequence
   * @function
   * @param {Function} callSequence intermediate resulting call sequence
   * @param {Function} middleware the current middleware
   * @returns {Function} the new intermediate resulting call sequence
   */
  function middlewareReducer (callSequence, middleware) {
    return function nextHandler (err) {
      // if the previous middleware passed an error argument
      if (err !== undefined) {
        if (isErrorHandler(middleware)) {
          // call the current middleware if it is an error handler middleware
          middleware(err, req, res, callSequence)
        } else {
          // else skip the current middleware and call the intermediate sequence
          callSequence(err)
        }
      } else {
        // if no error argument is passed
        if (isErrorHandler(middleware)) {
          // skip the current middleware if it is an errorHandler
          callSequence()
        } else {
          // else call it
          middleware(req, res, callSequence)
        }
      }
    }
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
  if (process.emitWarning) process.emitWarning(deprecatedMessage)
  else console.log(deprecatedMessage)
  middlewares.reverse().reduce(middlewareReducer, initialNext.bind(null, req, res, initialNext)).call()

  function middlewareReducer (prev, current) {
    return current.bind(null, req, res, prev)
  }
}

/**
 * Append an arbitrary number of middlewares as argument list or as an array
 * @method
 * @param {...Function} middlewares a list of middlewares
 * @throws TypeError if one of the given middlewares is not a function. All the given middlewares would be rejected.
 */
function append (/* mid_0, ..., mid_n */) {
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
 * @param {Array<Function>} middlewares
 */
function appendList (middlewares) {
  if (!Array.isArray(middlewares)) {
    var errorMsg = 'First argument must be an array of middlewares. '
    errorMsg += typeof middlewares + ' given.'
    throw new TypeError(errorMsg)
  }
  return this.append.apply(this, middlewares)
}

/**
 * Append a middleware if a given filter on the req object is validated
 * @method
 * @param {Function} filter A filter function (returning a Boolean)
 * @param {Function} middleware A middleware function (calling its third argument as callback)
 * @returns {undefined}
 */
function appendIf (filter, middleware) {
  var errorMsg
  if (arguments.length < 2) {
    errorMsg = 'ConnectSequence#appendIf() takes 2 arguments. '
    errorMsg += arguments.length + ' given.'
    throw new MissingArgumentError(errorMsg)
  }
  if (typeof filter !== 'function') {
    errorMsg = 'The first argument must be a filter function. '
    errorMsg += typeof filter + ' given.'
    throw new TypeError(errorMsg)
  }
  if (typeof middleware !== 'function') {
    errorMsg = 'The second argument must be a middleware function. '
    errorMsg += typeof middleware + ' given.'
    throw new TypeError(errorMsg)
  }

  if (isErrorHandler(middleware)) {
    this.append(function (err, req, res, next) {
      if (filter(req)) {
        middleware(err, req, res, next)
        return
      } else {
        next()
        return
      }
    })
  } else {
    this.append(function (req, res, next) {
      if (filter(req)) {
        middleware(req, res, next)
        return
      } else {
        next()
        return
      }
    })
  }
}

function isErrorHandler (cb) {
  var str = cb.toString()
  var args = str.split('(')[1].split(')')[0].split(',')
  return args.length === 4
}
