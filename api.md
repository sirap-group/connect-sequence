<a name="ConnectSequence"></a>

## ConnectSequence
**Kind**: global class  

* [ConnectSequence](#ConnectSequence)
    * [new ConnectSequence(req, res, next)](#new_ConnectSequence_new)
    * [.run()](#ConnectSequence+run) ⇒ <code>undefined</code>
    * [.append(...middlewares)](#ConnectSequence+append) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>
    * [.appendList(middlewares)](#ConnectSequence+appendList) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>
    * [.appendIf(filter, ...middlewares)](#ConnectSequence+appendIf) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>
    * [.appendListIf(filter, middlewares)](#ConnectSequence+appendListIf) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>

<a name="new_ConnectSequence_new"></a>

### new ConnectSequence(req, res, next)

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | The request object |
| res | <code>object</code> | The response object |
| next | <code>function</code> | The next middleware |

<a name="ConnectSequence+run"></a>

### connectSequence.run() ⇒ <code>undefined</code>
Run sequencially each appended middleware, using the next argument as the final callback.

**Kind**: instance method of <code>[ConnectSequence](#ConnectSequence)</code>  
<a name="ConnectSequence+append"></a>

### connectSequence.append(...middlewares) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>
Append an arbitrary number of middlewares as argument list or as an array

**Kind**: instance method of <code>[ConnectSequence](#ConnectSequence)</code>  
**Returns**: <code>[ConnectSequence](#ConnectSequence)</code> - a reference to the instance to be chainable  
**Throws**:

- TypeError if one of the given middlewares is not a function. All the given middlewares would be rejected.


| Param | Type | Description |
| --- | --- | --- |
| ...middlewares | <code>function</code> | A list of middleware functions (or errorHandler middlewares) |

<a name="ConnectSequence+appendList"></a>

### connectSequence.appendList(middlewares) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>
Append many middlewares in an array

**Kind**: instance method of <code>[ConnectSequence](#ConnectSequence)</code>  
**Returns**: <code>[ConnectSequence](#ConnectSequence)</code> - a reference to the instance to be chainable  

| Param | Type | Description |
| --- | --- | --- |
| middlewares | <code>Array.&lt;function()&gt;</code> | An array of middleware functions (or errorHandler middlewares) |

<a name="ConnectSequence+appendIf"></a>

### connectSequence.appendIf(filter, ...middlewares) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>
Append a list of middlewares as argument list if the filter pass the first time

**Kind**: instance method of <code>[ConnectSequence](#ConnectSequence)</code>  
**Returns**: <code>[ConnectSequence](#ConnectSequence)</code> - a reference to the instance to be chainable  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>function</code> | A filter function (returning a Boolean) |
| ...middlewares | <code>function</code> | A list of middleware functions (or errorHandler middlewares) |

<a name="ConnectSequence+appendListIf"></a>

### connectSequence.appendListIf(filter, middlewares) ⇒ <code>[ConnectSequence](#ConnectSequence)</code>
Append many middlewares in an array if the filter pass the first time

**Kind**: instance method of <code>[ConnectSequence](#ConnectSequence)</code>  
**Returns**: <code>[ConnectSequence](#ConnectSequence)</code> - a reference to the instance to be chainable  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>function</code> | A filter function on the req object |
| middlewares | <code>Array.&lt;function()&gt;</code> | An array of middleware functions (or errorHandler middlewares) |

