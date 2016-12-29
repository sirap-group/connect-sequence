# connect-sequence [![GitHub tag](https://img.shields.io/github/tag/sirap-group/connect-sequence.svg?maxAge=2592000?style=plastic)](git@github.com:sirap-group/connect-sequence.git) [![npm](https://img.shields.io/npm/v/connect-sequence.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/connect-sequence)

[![NPM](https://nodei.co/npm/connect-sequence.png?compact=true)](https://nodei.co/npm/connect-sequence/)

[![Build Status](https://travis-ci.org/sirap-group/connect-sequence.png)](https://travis-ci.org/sirap-group/connect-sequence)
[![Coverage Status](https://coveralls.io/repos/github/sirap-group/connect-sequence/badge.svg?branch=master)](https://coveralls.io/github/sirap-group/connect-sequence?branch=master)
![NPM](https://david-dm.org/sirap-group/connect-sequence.svg)



[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Semver 2.0](https://img.shields.io/badge/Versioning-Semver%202.0-brightgreen.svg)](http://semver.org/)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000?style=plastic)](https://github.com/sirap-group/connect-sequence)



A node.js module to run connect-like middlewares in sequence

## What is `connect-sequence`

This module is intended to be used in a [`connect`](https://github.com/senchalabs/connect) or [`express`](http://expressjs.com) application.

In an `express` application, you manipulate **middlewares**. The request walkthru the middlewares you registred in the same order you registred it.

This is super cool but **sometimes, we would want to register the middleware sequence dynamically, i.e. at runtime.**

`connect-sequence` aims to make a such thing super-easy!

You'll find connect-sequence on these platforms:

- Github.io: [https://sirap-group.github.io/connect-sequence](https://sirap-group.github.io/connect-sequence)
- Github.com: [https://github.com/sirap-group/connect-sequence](https://github.com/sirap-group/connect-sequence)
- npmjs.com: [https://www.npmjs.com/package/connect-sequence](https://www.npmjs.com/package/connect-sequence)
- Libraries.io: [https://libraries.io/npm/connect-sequence](https://libraries.io/npm/connect-sequence)
- Travic CI: [https://travis-ci.org/sirap-group/connect-sequence](https://travis-ci.org/sirap-group/connect-sequence)
- Coveralls.io: [https://coveralls.io/github/sirap-group/connect-sequence](https://coveralls.io/github/sirap-group/connect-sequence)

> [Suscribe to new releases on libraries.io!](https://libraries.io/subscribe/2033386)

## Installation

### With node package manager (recommanded)

    npm install --save connect-sequence

### Or manually

Download:

    wget https://github.com/sirap-group/connect-sequence/archive/v1.0.0.zip

Extract:

    unzip v1.0.0.zip

Move in the `node_modules` directory:

    mv connect-sequence ./node_modules/connect-sequence

## Usage

> **Important Note:**
>
> The following example is simple, stupid simple, too simple. **I know it.**
>
> In the usage exampe the conditions tested before pushing the products middlewares in the middlewares array coud/should simply be tested in each middleware that need to test a conditions on the `req` object before doing its stuff.
>
> But the key point is to show HOW it could be used, so simplicity is ok.
> You know the real cases when you need to use the "connect-sequence patern", as I know when I needed it before deciding to write this module.
>
>The truth is **in general, we need this patern when the conditions are complexes and for some good reasons, in these complexes case, the conditions to use or not this or that one middleware shouldn't be tested into it; often because it would be too complex or even impossible.**
>
> In my cases, I often use this patern when I written some usefull tiny middlewares highly reusable in differents contexts, and these contexts shoud be tested out of these middlewares to keep it clean and real reusable. In particular when I want to reuse a middleware for different API versions of the same resource.

```js
/**
 * Product API
 * @module
 */

var connectSequence = require('connect-sequence')
var productsController = require('./products.controller')

module.exports = productRouter

function productRouter (app) {
  app.route('/api/products/:productId').get(function (req, res, next) {
    var middlewares = []

    // build the middlewares sequence
    if (req.query.filter) {
      middlewares.push(productsController.filter)
    }
    if (req.query.format) {
      middlewares.push(productsController.validateFormat)
      middlewares.push(productsController.beforeFormat)
      middlewares.push(productsController.format)
      middlewares.push(productsController.afterFormat)
    }
    if (req.query.filter && req.query.format) {
      middlewares.push(productsController.prepareResponse)
    }
    middlewares.push(productsController.sendResponse)

    // run each middleware in sequence
    connectSequence.run(req, res, next, middlewares)
  })

  app.param('productId', function (req, res, next, id) {
    // ... yield the product by ID and bind it to the req object
  })
}
```

## Contribute

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

The javascript source files are located in the `lib` folder and the unit test files are located in the `tests` folder.

We use the [Standard Javascript Code Style](http://standardjs.com/) to keep the code clean and nice.

We use [Gulp](http://gulpjs.com/) some gulp plugins and some other node modules as `devDependendies` to automate the developement tasks:

- [gulp-standard-bundle](https://github.com/ggarciao/gulp-standard-bundle) to lint all the javascript source files against the javascript syntax and the StandardJS code style,
- [grunt-mocha](https://github.com/sindresorhus/gulp-mocha) and [chaijs](https://github.com/chaijs/chai) to make and run the unit tests,
- [gulp-coverage](https://github.com/dylanb/gulp-coverage) and [gulp-coveralls](https://github.com/markdalgleish/gulp-coveralls) to compute and publish the testing coverage of the code,
- [gulp-bump](https://github.com/stevelacy/gulp-bump) and [gulp-git](https://github.com/stevelacy/gulp-git) to tag the patch, minor and major releases.

Finally, we use the [Semver 2.0](http://semver.org/) (Semantic Versioning) to standardize the release version numbers (major/minor/path/pre-release).

> Your contributions posting issues and pull requests are welcome!

### Development

Ensure you are not in `production` environement to install the `devDependencies`

    $ NODE_ENV=development npm install

Then you can start coding in a Test Driven Development environement with `gulp`, `mocha` and `chai`

    $ npm run TDD

The script will lint the lib and test files (but not break on error), run all the unit tests and then it will restart the tests on file change.


## Credits

- Rémi Becheras (https://github.com/rbecheras)
- Groupe SIRAP (https://github.com/sirap-group)

## Copyright

Copyright © 2016 SIRAP Group, All Rights Reserved

## License

This project is licensed under the [MIT license](LICENSE)
