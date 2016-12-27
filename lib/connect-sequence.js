'use strict'

module.exports = ConnectSequence

/**
 * @class
 * @param {Array<Function>} [middlewareList] A list of middlewares to run
 */
function ConnectSequence () {
  this.middlewares = []
}

ConnectSequence.run = run

ConnectSequence.prototype = {
  append: append
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
function run (req, res, initialNext, middlewares) {
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
      throw new TypeError('All given middleware must be a function')
    }
  }
  for (i = 0; i < arguments.length; i++) {
    this.middlewares.push(arguments[i])
  }
}
