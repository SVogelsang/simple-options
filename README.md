# Simple Options

[![Build Status](https://travis-ci.org/SVogelsang/simple-options.svg?branch=master)](https://travis-ci.org/SVogelsang/simple-options)

This component merges given options with default options. It raises an error if required options are missing.

### Installation

Get it via npm:

```` 
npm install --save simple-options
````

### Features

* deep merging of options with defaults.
* simple types are copied to the source; complex objects are merged.
* Merging of arrays. 
  * If an item does not exist in the source array it is filled with the value from the defaults.
  * If the source array contains more elements than the defaults the additional valus are kept without any error.
  * The elements of an array are merged as well (recursivly).
* required options are specified by mention them in the defaults as **undefined** or **null**.

### Restrictions

* no type checks on properties. No error is raised if the property type of source and defaults differs.

### Examples

##### Define required options:

```js
var options = require('../lib/simple-options');
var usedOptions = options({name: 'a'}, {name: undefined});
```

Result:
```js
var usedOptions = {name: 'a'}
```

##### Raise error if required options are missing:

```js
var options = require('../lib/simple-options');
var usedOptions = options({name: 'a'}, {name: undefined, index: undefined});
```

##### Merging arrays:

```js
var options = require('../lib/simple-options');
var usedOptions = options({name: 'a', items: ['a', 'b']}, {name: undefined, items: ['x', 'y', 'z']});
```

Result:
```js
var usedOptions = {name: 'a', items: ['a', 'b', 'z']}
```

```js
var options = require('../lib/simple-options');
var usedOptions = options({name: 'a', items: ['a', 'b', 'c']}, {name: undefined, items: ['x', 'y']});
```

Result:
```js
var usedOptions = {name: 'a', items: ['a', 'b', 'c']}
```

```js
var options = require('../lib/simple-options');
var usedOptions = options([{item: {name: 'A'}}, {item: {name: 'B'}}], [{item: {name: 'C', number: 2}}, {item: {name: 'D', number: 2}}]);
```

Result:
```js
var usedOptions = [{item: {name: 'A', number: 2}}, {item: {name: 'B', number: 2}}]
```


For more examples see [tests](./test/simple-options.spec.js).

### Use with Express

Simple options can be used with [Express](expressjs.com) where options are passed either as body or query parameters. In case of an error (e.g. a required parameter is missing) a 400 HTTP status is send.

#### Examples

```js
var options = require('../lib/simple-options');
var controller = function(req, res) {
  options.fromBody(req, res, {name: null}, function(err, options){
    
    if(err){
      return console.log(err);
    }
    
    // do something with the options
  });  
}
```

```js
var options = require('../lib/simple-options');
var controller = function(req, res) {
  options.fromQuery(req, res, {name: 'default name'}, function(err, options){
    
    if(err){
      return console.log(err);
    }
    
    // do something with the options
  });  
}
```


### License

[MIT](./LICENSE)
