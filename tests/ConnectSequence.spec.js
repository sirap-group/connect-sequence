'use strict'

var path = require('path')
var chai = require('chai')
var ConnectSequence = require(path.resolve('./lib/ConnectSequence'))
var MissingArgumentError = require(path.resolve('./lib/errors/MissingArgumentError'))

var describe = global.describe
var beforeEach = global.beforeEach
var it = global.it
var expect = chai.expect

var EXPECTED_MIDDLEWARE_ERROR_MESSAGE = 'expected middleware error'

describe('ConnectSequence', function () {
  var seq, req, res, next, mid

  beforeEach(function () {
    req = { foo: 'bar' }
    res = {}
    next = function (req, res) { res.foo = req.foo }
    mid = function (req, res, next) { req.foo = 'baz'; next() }
    seq = new ConnectSequence(req, res, next)
  })

  it('should be a function', function () {
    expect(ConnectSequence).to.be.a('function')
  })

  it('should have a prototype', function () {
    expect(ConnectSequence).to.have.property('prototype')
  })

  describe('.prototype', function () {
    it('should be an object', function () {
      expect(ConnectSequence.prototype).to.be.a('object')
    })

    it('should have a "append" method', function () {
      expect(ConnectSequence.prototype).to.have.property('append')
      expect(ConnectSequence.prototype.append).to.be.a('function')
    })

    it('should have a "appendList" method', function () {
      expect(ConnectSequence.prototype).to.have.property('appendList')
      expect(ConnectSequence.prototype.appendList).to.be.a('function')
    })

    it('should have a "appendIf" method', function () {
      expect(ConnectSequence.prototype).to.have.property('appendIf')
      expect(ConnectSequence.prototype.appendIf).to.be.a('function')
    })

    it('should have a "run" method', function () {
      expect(ConnectSequence.prototype).to.have.property('run')
      expect(ConnectSequence.prototype.appendList).to.be.a('function')
    })

    describe('.constructor()', function () {
      it('should be an object of type `ConnectSequence`', function () {
        seq = new ConnectSequence(req, res, next)
        expect(seq).to.be.a('object')
        expect(seq).to.be.an.instanceof(ConnectSequence)
      })

      it('should init the `middlewares` instance property as an empty Array', function () {
        seq = new ConnectSequence(req, res, next)
        expect(seq).to.has.a.property('middlewares')
        expect(seq.middlewares).to.be.a('array')
        expect(seq.middlewares.length).to.be.equal(0)
      })

      it('should throw `MissingArgumentError` if called with lower than 3 arguments', function () {
        expect(function () {
          seq = new ConnectSequence({})
        }).to.throw(MissingArgumentError)

        expect(function () {
          seq = new ConnectSequence({}, {})
        }).to.throw(MissingArgumentError)
      })

      it('should throw `TypeError` if the first argument is not an object', function () {
        expect(function () {
          seq = new ConnectSequence('not an object', {}, function (req, res) { return true })
        }).to.throw(TypeError)
      })

      it('should throw `TypeError` if the second argument is not an object', function () {
        expect(function () {
          seq = new ConnectSequence({}, 'not an object', function (req, res) { return true })
        }).to.throw(TypeError)
      })

      it('should throw `TypeError` if the third argument is not a function', function () {
        expect(function () {
          seq = new ConnectSequence({}, {}, 'not a function')
        }).to.throw(TypeError)
      })

      it('should init the `req` object', function () {
        seq = new ConnectSequence(req, res, next)
        expect(seq.req).to.equal(req)
      })

      it('should init the `res` object', function () {
        seq = new ConnectSequence(req, res, next)
        expect(seq.res).to.equal(res)
      })

      it('should init the `next` function', function () {
        seq = new ConnectSequence(req, res, next)
        expect(seq.next).to.equal(next)
      })
    })
  })

  describe('#append()', function () {
    it('should be chainable', function () {
      seq = new ConnectSequence(req, res, next)
      expect(seq.append(mid)).to.equal(seq)
    })

    it('should augments the length of the middlewares array by the number of given middlewares', function () {
      seq = new ConnectSequence(req, res, next)
      var mid = function (req, res, next) { next() }
      seq.append(mid)
      expect(seq.middlewares.length).to.equal(1)
      seq.append(mid)
      expect(seq.middlewares.length).to.equal(2)
      seq.append(mid, mid)
      expect(seq.middlewares.length).to.equal(4)
      seq.append()
      expect(seq.middlewares.length).to.equal(4)
      seq.append(mid, mid, mid)
      expect(seq.middlewares.length).to.equal(7)
    })

    it('should keep the same order of the given middlewares', function () {
      seq = new ConnectSequence(req, res, next)
      var mid0 = function (req, res, next) { next() }
      var mid1 = function (req, res, next) { next() }
      var mid2 = function (req, res, next) { next() }
      var mid3 = function (req, res, next) { next() }
      var mid4 = function (req, res, next) { next() }
      var mid5 = function (req, res, next) { next() }
      var mid6 = function (req, res, next) { next() }
      seq.append(mid0)
      seq.append(mid1, mid2)
      seq.append()
      seq.append(mid3, mid4, mid5)
      seq.append(mid6)
      var mids = [mid0, mid1, mid2, mid3, mid4, mid5, mid6]
      for (var i = 0; i < mids.length; i++) {
        var mid = mids[i]
        expect(seq.middlewares[i]).to.equal(mid)
      }
    })

    it('should throw a TypeError and reject all middlewares if one is not a function', function () {
      seq = new ConnectSequence(req, res, next)
      var mid1 = function (req, res, next) { next() }
      var mid2 = 'not a function'
      var mid3 = function (req, res, next) { next() }
      var cantAppend = function () {
        seq.append(mid1, mid2, mid3)
      }
      var shouldAppend = function () {
        seq.append(mid1, mid3)
      }
      expect(cantAppend).to.throw(TypeError)
      expect(seq.middlewares.length).to.be.equal(0)
      expect(shouldAppend).to.not.throw(Error)
      expect(seq.middlewares.length).to.be.equal(2)
    })
  })

  describe('#appendList()', function () {
    it('should be chainable', function () {
      seq = new ConnectSequence(req, res, next)
      expect(seq.appendList([mid])).to.equal(seq)
    })

    it('should throw TypeError if the first argument is not an array', function () {
      var funcs = [
        function () {
          seq = new ConnectSequence(req, res, next)
          seq.appendList('not an array')
        },
        function () {
          seq = new ConnectSequence(req, res, next)
          seq.appendList({foo: 'not an array'})
        },
        function () {
          seq = new ConnectSequence(req, res, next)
          seq.appendList(function () { return 'not an array' })
        }
      ]
      for (var i = 0; i < funcs.length; i++) {
        expect(funcs[i]).to.throw(TypeError)
      }
    })

    it('should augments the length of the middlewares array by the number of given middlewares', function () {
      seq = new ConnectSequence(req, res, next)
      var mid = function (req, res, next) { next() }
      seq.appendList([mid])
      expect(seq.middlewares.length).to.equal(1)
      seq.appendList([mid])
      expect(seq.middlewares.length).to.equal(2)
      seq.appendList([mid, mid])
      expect(seq.middlewares.length).to.equal(4)
      seq.appendList([])
      expect(seq.middlewares.length).to.equal(4)
      seq.appendList([mid, mid, mid])
      expect(seq.middlewares.length).to.equal(7)
    })

    it('should keep the same order of the given middlewares', function () {
      seq = new ConnectSequence(req, res, next)
      var mid0 = function (req, res, next) { next() }
      var mid1 = function (req, res, next) { next() }
      var mid2 = function (req, res, next) { next() }
      var mid3 = function (req, res, next) { next() }
      var mid4 = function (req, res, next) { next() }
      var mid5 = function (req, res, next) { next() }
      var mid6 = function (req, res, next) { next() }
      seq.appendList([mid0])
      seq.appendList([mid1, mid2])
      seq.appendList([])
      seq.appendList([mid3, mid4, mid5])
      seq.appendList([mid6])
      var mids = [mid0, mid1, mid2, mid3, mid4, mid5, mid6]
      for (var i = 0; i < mids.length; i++) {
        var mid = mids[i]
        expect(seq.middlewares[i]).to.equal(mid)
      }
    })

    it('should throw a TypeError and reject all middlewares if one is not a function', function () {
      seq = new ConnectSequence(req, res, next)
      var mid1 = function (req, res, next) { next() }
      var mid2 = 'not a function'
      var mid3 = function (req, res, next) { next() }
      var cantAppend = function () {
        seq.appendList([mid1, mid2, mid3])
      }
      var shouldAppend = function () {
        seq.appendList([mid1, mid3])
      }
      expect(cantAppend).to.throw(TypeError)
      expect(seq.middlewares.length).to.be.equal(0)
      expect(shouldAppend).to.not.throw(Error)
      expect(seq.middlewares.length).to.be.equal(2)
    })
  })

  describe('#appendIf()', function () {
    var filter

    beforeEach(function () {
      filter = function (req) { return !!req.foo }
    })

    it('should be chainable', function () {
      seq = new ConnectSequence(req, res, next)
      expect(seq.appendIf(filter, mid)).to.equal(seq)
    })

    it('should throw `MissingArgumentError` if called with lower than 2 arguments', function () {
      expect(function () {
        seq.appendIf()
      }).to.throw(MissingArgumentError)

      expect(function () {
        seq.appendIf(filter)
      }).to.throw(MissingArgumentError)

      expect(function () {
        seq.appendIf(filter, mid)
      }).to.not.throw(MissingArgumentError)
    })

    it('should throw `TypeError` if the first argument is not a function', function () {
      expect(function () {
        seq.appendIf('not a function', mid)
      }).to.throw(TypeError)

      expect(function () {
        seq.appendIf(filter, mid)
      }).to.not.throw(Error)
    })

    it('should throw `TypeError` if any of the folowing arguments is not a function', function () {
      expect(function () {
        seq.appendIf(filter, 'not a function')
      }).to.throw(TypeError)

      expect(function () {
        seq.appendIf(filter, mid, 'not a function')
      }).to.throw(TypeError)

      expect(function () {
        seq.appendIf(filter, mid, 'not a function', mid)
      }).to.throw(TypeError)

      expect(function () {
        seq.appendIf(filter, mid, mid, mid)
      }).to.not.throw(Error)
    })

    describe('when the previous condition on `req` is `true`', function () {
      describe('when passing a normal middleware', function () {
        it('should run the given middlewares', function (done) {
          var mid0, mid1, mid2, mid3, mid4
          next = function () {
            expect(req.mid0).to.equal('mid0')
            expect(req.mid1).to.equal('mid1')
            expect(req.mid2).to.equal('mid2')
            expect(req.mid3).to.equal('mid3')
            expect(req.mid4).to.equal('mid4')
            done()
          }
          mid0 = function (req, res, next) {
            console.log('mid0')
            req.mid0 = 'mid0'
            next()
          }
          mid1 = function (req, res, next) {
            console.log('mid1')
            req.mid1 = 'mid1'
            next()
          }
          mid2 = function (req, res, next) {
            console.log('mid2')
            req.mid2 = 'mid2'
            next()
          }
          mid3 = function (req, res, next) {
            console.log('mid3')
            req.mid3 = 'mid3'
            next()
          }
          mid4 = function (req, res, next) {
            console.log('mid4')
            req.mid4 = 'mid4'
            next()
          }
          filter = function (req) {
            return true
          }
          seq = new ConnectSequence(req, res, next)
          seq.appendIf(filter, mid0, mid1, mid2, mid3, mid4)
          seq.run()
        })
      })

      describe('when passing a error handler middleware', function () {
        it('should run the given error handler', function (done) {
          next = function () {
            expect(res.foo).to.equal('bar')
            done()
          }
          seq = new ConnectSequence(req, res, next)
          seq.append(function (req, res, next) {
            next('middleware in error')
          })
          seq.appendIf(function (req) {
            return req.foo === 'bar'
          }, function (err, req, res, next) {
            if (err) {
              res.foo = req.foo // 'bar'
            }
            next()
          })
          seq.run()
        })
      })
    })

    describe('when the previous condition on `req` is `false`', function () {
      describe('when passing a normal middleware', function () {
        it('should not run the given middlewares', function (done) {
          var mid0, mid1, mid2, mid3, mid4
          next = function () {
            expect(req.mid0).to.be.undefined
            expect(req.mid1).to.be.undefined
            expect(req.mid2).to.be.undefined
            expect(req.mid3).to.be.undefined
            expect(req.mid4).to.be.undefined
            done()
          }
          mid0 = function (req, res, next) {
            req.mid0 = 'mid0'
            next()
          }
          mid1 = function (req, res, next) {
            req.mid1 = 'mid1'
            next()
          }
          mid2 = function (req, res, next) {
            req.mid2 = 'mid2'
            next()
          }
          mid3 = function (req, res, next) {
            req.mid3 = 'mid3'
            next()
          }
          mid4 = function (req, res, next) {
            req.mid4 = 'mid4'
            next()
          }
          filter = function (req) {
            return false
          }
          seq = new ConnectSequence(req, res, next)
          seq.appendIf(filter, mid0, mid1, mid2, mid3, mid4)
          seq.run()
        })
      })

      describe('when passing a error handler middleware', function () {
        it('should not run the given error handler', function (done) {
          next = function () {
            expect(res.foo).to.not.equal('bar')
            done()
          }
          seq = new ConnectSequence(req, res, next)
          seq.append(function (req, res, next) {
            next('middleware in error')
          })
          seq.appendIf(function (req) {
            return !req.foo // 'bar'
          }, function (err, req, res, next) {
            if (err) {
              res.foo = req.foo // 'bar'
            }
            next()
          })
          seq.run()
        })
      })
    })
  })

  describe('#run()', function () {
    var mid0, mid1, mid2, mid3

    beforeEach(function () {
      seq = new ConnectSequence(req, res, next)
      mid0 = function mid0 (req, res, next) {
        ensureReqIdsDefined(req)
        req.ids.push('mid0')
        next()
      }
      mid1 = function mid1 (req, res, next) {
        ensureReqIdsDefined(req)
        req.ids.push('mid1')
        next()
      }
      mid2 = function mid2 (req, res, next) {
        ensureReqIdsDefined(req)
        req.ids.push('mid2')
        next()
      }
      mid3 = function mid3 (req, res, next) {
        ensureReqIdsDefined(req)
        req.ids.push('mid3')
        next()
      }
    })

    it('should be a function', function () {
      expect(seq.run).to.be.a('function')
    })

    it('should run the initial next middleware at last', function (done) {
      next = function () {
        req.ids = 'initialNext'
        done()
      }
      seq = new ConnectSequence(req, res, next)
      seq.append(mid0, mid0, mid0, mid0)
      seq.run()
      expect(req.ids).to.be.a(String)
      expect(req.ids).to.equal('initialNext')
    })

    it('should run all the middlewares in the passed array of middlewares', function (done) {
      next = function () {
        req.ids.push('initial')
        expect(req.ids).to.contain('initial')
        expect(req.ids).to.contain('mid0')
        expect(req.ids).to.contain('mid1')
        expect(req.ids).to.contain('mid2')
        expect(req.ids).to.contain('mid3')
        setTimeout(done, 20)
      }
      seq = new ConnectSequence(req, res, next)
      seq.append(mid0, mid1, mid2, mid3)
      seq.run()
    })

    it('should run all the middlewares in the same order than the given array', function (done) {
      next = function () {
        req.ids.push('initial')
        expect(req.ids.join()).to.equal('mid0,mid1,mid2,mid3,initial')
        setTimeout(done, 20)
      }
      seq = new ConnectSequence(req, res, next)
      seq.append(mid0, mid1, mid2, mid3)
      seq.run()
    })

    it('should run each middleware as a callback of the previous', function (done) {
      this.slow(500)
      next = function () {
        if (req && req.ids) {
          req.ids.push('initial')
          expect(req.ids.join()).to.equal('mid0,mid1,mid2,mid3,initial')
          done()
        }
      }
      var _mid0 = function (req, res, next) {
        setTimeout(mid0.bind(null, req, res, next), 150)
      }
      var _mid1 = function (req, res, next) {
        setTimeout(mid1.bind(null, req, res, next), 50)
      }
      var _mid2 = function (req, res, next) {
        setTimeout(mid2.bind(null, req, res, next), 100)
      }
      var _mid3 = function (req, res, next) {
        setTimeout(mid3.bind(null, req, res, next), 150)
      }
      seq = new ConnectSequence(req, res, next)
      seq.append(_mid0, _mid1, _mid2, _mid3)
      seq.run(req, res, next)
    })

    describe('When a middleware throw an error in the next callback', function () {
      var midErr, nextErr, errorHandler
      var midBefore0, midBefore1
      var midAfter0
      var runSeq

      beforeEach(function () {
        midBefore0 = mid0
        midBefore1 = mid1
        midErr = new Error(EXPECTED_MIDDLEWARE_ERROR_MESSAGE)
        nextErr = function nextErr (req, res, next) { next(midErr) }
      })

      describe(', the error handler middleware f(err, req, res, next)', function () {
        it('should handle any error passed in the fourth argument', function (done) {
          next = function () {
            if (!req.isDone) {
              req.isDone = true
              done()
            }
          }
          errorHandler = function errorHandler (err, req, res, next) {
            expect(err.message).to.equal(EXPECTED_MIDDLEWARE_ERROR_MESSAGE)
            next()
            if (!req.isDone) {
              req.isDone = true
              done()
            }
          }
          midAfter0 = function midAfter0 (req, res, next) {
            ensureReqIdsDefined(req)
            req.ids.push('midAfter0')
            next()
          }
          seq = new ConnectSequence(req, res, next)
          seq.append(midBefore0, nextErr, midBefore1, errorHandler, midAfter0)
          seq.run()
        })

        it('should skip the initial next middleware', function (done) {
          next = function () {
            throw new Error('Forbidden middleware')
          }
          errorHandler = function errorHandler (err, req, res, next) {
            if (err) {
              // the error is handled ...
            }
            // do not call next, it is forbidden
            done()
          }
          midAfter0 = function midAfter0 (req, res, next) {
            ensureReqIdsDefined(req)
            req.ids.push('midAfter0')
            next()
          }
          seq = new ConnectSequence(req, res, next)
          seq.append(midBefore0, nextErr, midBefore1, errorHandler, midAfter0)
          runSeq = function () { seq.run() }
          expect(runSeq).to.not.throw(Error)
        })

        describe('when a middleware pass an error in its next middleware', function () {
          it('should skip all middlewares after the middleware throwing and error', function (done) {
            var midBetween = function (req, res, next) {
              req.midBetween = true
            }
            errorHandler = function errorHandler (err, req, res, next) {
              if (err) {
                // the error is handled ...
              }
              next()
            }
            next = function next () {
              expect(req.midBetween).to.be.undefined
              done()
            }
            seq = new ConnectSequence(req, res, next)
            seq.append(midBefore0, nextErr, midBetween, errorHandler)
            seq.run()
          })
        })

        describe('when any middleware pass any error in its next middleware', function () {
          it('should skip an error handler middleware if no error is passed', function (done) {
            errorHandler = function errorHandler (err, req, res, next) {
              if (err) {
                // the error is handled ...
              }
              req.errorHandler = true
              next()
            }
            midAfter0 = function midAfter0 (req, res, next) {
              req.midAfter0 = true
              next()
            }
            next = function next () {
              expect(req.errorHandler).to.be.undefined
              expect(req.midAfter0).to.equal(true)
              done()
            }
            seq = new ConnectSequence(req, res, next)
            seq.append(midBefore0, errorHandler, midAfter0)
            seq.run()
          })
        })
      })
    })
  })
})

function ensureReqIdsDefined (req) {
  if (!req.ids) {
    req.ids = []
  }
}
