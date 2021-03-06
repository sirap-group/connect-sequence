# connect-sequence [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sirap-group/connect-sequence/master/LICENSE) [![GitHub tag](https://img.shields.io/github/tag/sirap-group/connect-sequence.svg?maxAge=2592000?style=plastic)](git@github.com:sirap-group/connect-sequence.git)

[![NPM](https://nodei.co/npm/connect-sequence.png?downloads=true)](https://nodei.co/npm/connect-sequence/)

![node: LTS/argon](https://img.shields.io/badge/node-LTS%20%2F%20Argon-brightgreen.svg)
![node: LTS/argon](https://img.shields.io/badge/node-LTS%20%2F%20Boron-brightgreen.svg)
[![npm](https://img.shields.io/npm/v/connect-sequence.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/connect-sequence)

[![Build Status](https://travis-ci.org/sirap-group/connect-sequence.png)](https://travis-ci.org/sirap-group/connect-sequence)
[![Coverage Status](https://coveralls.io/repos/github/sirap-group/connect-sequence/badge.svg?branch=master)](https://coveralls.io/github/sirap-group/connect-sequence?branch=master)
![NPM](https://david-dm.org/sirap-group/connect-sequence.svg)

[![Code Climate](https://codeclimate.com/github/sirap-group/connect-sequence/badges/gpa.svg)](https://codeclimate.com/github/sirap-group/connect-sequence) [![Issue Count](https://codeclimate.com/github/sirap-group/connect-sequence/badges/issue_count.svg)](https://codeclimate.com/github/sirap-group/connect-sequence)

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Semver 2.0](https://img.shields.io/badge/Versioning-Semver%202.0-brightgreen.svg)](http://semver.org/)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000?style=plastic)](https://github.com/sirap-group/connect-sequence)

A node.js module to run connect-like middlewares in sequence

- [What is `connect-sequence`](#what-is-connect-sequence)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Usage](#usage)
- [Contribute](#contribute)
    - [Development](#development)
- [Credits](#credits)
- [Copyright](#copyright)
- [License](#license)

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

With node package manager (recommanded but not required)

    npm install --save connect-sequence

## API reference

[ConnectSequence API reference](api.md)

## Usage

> The following example is stupid simple.
>
> In the usage example the conditions tested before pushing the products middlewares in the middlewares array coud/should simply be tested in each middleware that need to test a conditions on the `req` object before doing its stuff.
>
> You know the real cases when you need to use the "connect-sequence patern". In this example I just show how to use it.
>
> I often use this patern when I write some usefull tiny middlewares highly reusable in differents contexts, and these contexts shoud be tested out of these middlewares to keep it clean and really reusable.

```js
/**
 * Product API
 * @module
 */

var ConnectSequence = require('connect-sequence')
var productsController = require('./products.controller')

module.exports = productRouter

function productRouter (app) {
  app.route('/api/products/:productId')
  .get(function (req, res, next) {
    // Create a ConnectSequence instance and setup it with the current `req`,
    // `res` objects and the `next` callback
    var seq = new ConnectSequence(req, res, next)

    // build the desired middlewares sequence thanks to:
    // - ConnectSequence#append(mid0, ..., mid1),
    // - ConnectSequence#appendList([mid0, ..., mid1])
    // - and ConnectSequence#appendIf(condition, mid)

    if (req.query.filter) {
      seq.append(productsController.filter)
    }

    if (req.query.format) {
      seq.append(
        productsController.validateFormat,
        productsController.beforeFormat,
        productsController.format,
        productsController.afterFormat
      )
    }

    // unless #run(), the other methods are chainable:

    // append the productsController.prepareResponse middleware to the sequence
    // only if the condition `req.query.format && req.formatedProduct` is true
    // at the moment where the middleware would be called.
    // So the condition is tested after the previous middleware is called and thus
    // if the previous modifies the `req` object, we can test it.
    seq.appendIf(isProductFormatted, productsController.prepareResponse)
    .append(productsController.sendResponse)
    // run the sequence
    .run()
  })

  app.param('productId', function (req, res, next, id) {
    // ... yield the product by ID and bind it to the req object
  })

  function isProductFormatted (req) {
    return Boolean(req.formatedProduct)
  }
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
