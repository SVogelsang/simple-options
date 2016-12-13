# Simple Options

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
* required options are specified by mention them in the defaults as **undefined**.

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
{name: 'a'}
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
{name: 'a', items: ['a', 'b', 'z']}
```

```js
var options = require('../lib/simple-options');
var usedOptions = options({name: 'a', items: ['a', 'b', 'c']}, {name: undefined, items: ['x', 'y']});
```

Result:
```js
{name: 'a', items: ['a', 'b', 'c']}
```


For more examples see [tests](./test/simple-options.spec.js).

### License

MIT
