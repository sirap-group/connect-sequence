'use strict'

exports.run = run

/**
 * Run sequentially each middleware in the given array, in the array order, throwing req and res object into.
 * @function
 * @static
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} initialNext The initial next middleware given at start, which should be run at last
 * @param {Array<Function>} middlewares The given array of middlewares
 */
function run (req, res, initialNext, middlewares) {
  // ..
}
