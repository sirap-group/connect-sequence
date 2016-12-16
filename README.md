# connect-sequence

[![GitHub tag](https://img.shields.io/github/tag/sirap-group/connect-sequence.svg?maxAge=2592000?style=plastic)](git@github.com:sirap-group/connect-sequence.git)
[![npm](https://img.shields.io/npm/v/connect-sequence.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/connect-sequence)

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Semver 2.0](https://img.shields.io/badge/Versioning-Semver%202.0-brightgreen.svg)](http://semver.org/)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000?style=plastic)](https://github.com/sirap-group/connect-sequence)


![NPM](https://david-dm.org/sirap-group/connect-sequence.svg)

[![NPM](https://nodei.co/npm/connect-sequence.png?compact=true)](https://nodei.co/npm/connect-sequence/)

A node.js module to run connect-like middlewares in sequence

## What is `connect-sequence`

This module is intended to be used in a [`connect`](https://github.com/senchalabs/connect) or [`express`](http://expressjs.com) application.

In an `express` application, you manipulate **middlewares**. The request walkthru the middlewares you registred in the same order you registred it.

This is super cool but sometimes, we would want to register the middleware sequence dynamically, i.e. at runtime.

`connect-sequence` aims to make a such thing super-easy!


## Usage

```js
/**
 * Product API
 * @module
 */

var conSeq = require('connect-sequence')
var productsController = require('./products.controller')

module.exports = productRouter

function productRouter (app) {
  app.route('/api/products/:productId').get(function (req, res, next) {

  })
}



```

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

## Credits

- Rémi Becheras (https://github.com/rbecheras)

## Copyright

Copyright © 2016 SIRAP Group, All Rights Reserved

## License

This project is licensed under the [MIT license](LICENSE)
