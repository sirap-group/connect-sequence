'use strict'

var MissingArgumentError = require('./errors/MissingArgumentError')

module.exports = ConnectSequence

/**
 * @class
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

ConnectSequence.prototype = {
  append: append,
  appendList: appendList,
  appendIf: appendIf,
  appendListIf: appendListIf,
  run: run
}

/**
 * Run sequencially each appended middleware, using the next argument as the final callback.
 * @method
 * @memberof ConnectSequence.prototype
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
   * @inner
   * @private
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
 * Append an arbitrary number of middlewares as an argument list
 * @method
 * @memberof ConnectSequence.prototype
 * @param {...Function} middlewares A list of middleware functions (or errorHandler middlewares)
 * @returns {ConnectSequence} a reference to the instance to be chainable
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
  return this
}

/**
 * Append an arbitrary number of middlewares as an array
 * @method
 * @memberof ConnectSequence.prototype
 * @param {Array<Function>} middlewares An array of middleware functions (or errorHandler middlewares)
 * @returns {ConnectSequence} a reference to the instance to be chainable
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
 * Append an arbitrary number of middlewares as an argument list if the filter pass at runtime of the first middleware in the given list
 * @method
 * @memberof ConnectSequence.prototype
 * @param {Function} filter A filter function (returning a Boolean)
 * @param {...Function} middlewares A list of middleware functions (or errorHandler middlewares)
 * @returns {ConnectSequence} a reference to the instance to be chainable
 */
function appendIf (filter /*, middlewares */) {
  var errorMsg
  var middlewares = []

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

  var middleware, i
  for (i = 1; i < arguments.length; i++) {
    middleware = arguments[i]
    if (typeof middleware !== 'function') {
      errorMsg = 'The second argument must be a middleware function. '
      errorMsg += typeof middleware + ' given.'
      throw new TypeError(errorMsg)
    }
    middlewares.push(middleware)
  }

  var firstMiddleware = middlewares[0]
  if (isErrorHandler(firstMiddleware)) {
    this.append(function (err, req, res, next) {
      req.__connectSequenceFilterValue = filter(req)
      if (req.__connectSequenceFilterValue) {
        firstMiddleware(err, req, res, next)
      } else {
        next()
      }
    })
  } else {
    this.append(function (req, res, next) {
      req.__connectSequenceFilterValue = filter(req)
      if (req.__connectSequenceFilterValue) {
        firstMiddleware(req, res, next)
      } else {
        next()
      }
    })
  }

  for (i = 1; i < middlewares.length; i++) {
    middleware = middlewares[i]
    appendOnFilterValue.call(this, middleware)
  }

  return this
}

/**
 * Append an arbitrary number of middlewares as an array if the filter pass at runtime of the first middleware in the given list
 * @method
 * @memberof ConnectSequence.prototype
 * @param {Function} filter A filter function on the req object
 * @param {Array<Function>} middlewares An array of middleware functions (or errorHandler middlewares)
 * @returns {ConnectSequence} a reference to the instance to be chainable
 */
function appendListIf (filter, middlewares) {
  var args = [filter]
  for (var i = 0; i < middlewares.length; i++) {
    args.push(middlewares[i])
  }
  return this.appendIf.apply(this, args)
}

/**
 * Tells if a given middleware is a regular middleware or an error handler
 * @function
 * @inner
 * @private
 * @param {Function} middleware
 * @returns {Boolean}
 */
function isErrorHandler (cb) {
  var str = cb.toString()
  var args = str.split('(')[1].split(')')[0].split(',')
  return args.length === 4
}

/**
 * Append a middleware in function of its nature and the filter value stored in req.__connectSequenceFilterValue
 * @function
 * @inner
 * @private
 * @param {Function} middleware
 * @returns {undefined}
 */
function appendOnFilterValue (middleware) {
  if (isErrorHandler(middleware)) {
    this.append(function (err, req, res, next) {
      if (req.__connectSequenceFilterValue) {
        middleware(err, req, res, next)
      } else {
        next()
      }
    })
  } else {
    this.append(function (req, res, next) {
      if (req.__connectSequenceFilterValue) {
        middleware(req, res, next)
      } else {
        next()
      }
    })
  }
}
