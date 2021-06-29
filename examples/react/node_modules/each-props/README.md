# [each-props][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

Processes each properties of an object deeply.

## Install

To install from npm:

```sh
$ npm i each-props --save
```

## Load this module

For Node.js:

```js
const eachProps = require('each-props');
```

For Web browser:

```html
<script src="each-props.min.js"></script>
```

## Usage

Apply a function to all (non plain object) properties.

```js
var obj = { a: 1, b: { c: 'CCC', d: { e: 'EEE' } } };

eachProps(obj, function(value, keyChain, nodeInfo) {
  if (keyChain === 'a') {
    nodeInfo.parent['a'] = value * 2;
  } else if (keyChain === 'b.c') {
    nodeInfo.parent['c'] = value.toLowerCase();
  } else if (keyChain === 'b.d') {
    return true; // stop to dig
  } else if (keyChain === 'b.d.e') {
    nodeInfo.parent['e'] = value.toLowerCase();
  }
});

console.log(obj);
// => { a: 2, b: { c: 'ccc', d: { e: 'EEE' } } };
```

## API

### <u>eachProps(obj, fn [, opts]) : void</u>

Executes the *fn* function for all properties.

#### Parameters:

| Parameter   |  Type  | Description                                    |
|:------------|:------:|:-----------------------------------------------|
| *obj*       | object | A plain object to be treated.                  |
| *fn*        |function| A function to operate each properties.         |
| *opts*      | object | An object to pass any data to each properties. |

* **API of *fn* function**

    #### <u>fn(value, keyChain, nodeInfo) : boolean</u>

    This function is applied to all properties in an object.

    ##### Parameters:

    | Parameter   |  Type  | Description                                    |
    |:------------|:------:|:-----------------------------------------------|
    | *value*     | any    | A property value.                              |
    | *keyChain*  | string | A string concatenating the hierarchical keys with dots. |
    | *nodeInfo*  | object | An object which contains node informations (See [below](#nodeinfo)). |

    ##### Returns:

    True, if stops digging child properties.

    **Type:** boolean

<a name="nodeinfo"></a>

* **Properties of <i>nodeInfo</i>**

    | Properties   |  Type  | Description                              |
    |:-------------|:------:|:-----------------------------------------|
    | *name*       | string | The property name of this node.          |
    | *index*      | number | The index of the property among the sibling properties. |
    | *count*      | number | The count of the sibling properties.     |
    | *depth*      | number | The depth of the property.               |
    | *parent*     | object | The parent node of the property.         |
    | *sort*       |function| A sort function which orders the child properties. This function is inherited from *opts*, if be specified. |

    ... and any properties inherited from *opts*.

* **Properties of <i>opts</i>**

    | Properties   |  Type  | Description                              |
    |:-------------|:------:|:-----------------------------------------|
    | *sort*       |function| A sort function which orders the same level properties. (Optional) |

    ... and any properties you want to pass to each node.

## License

Copyright (C) 2016-2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/each-props/
[npm-img]: https://img.shields.io/badge/npm-v1.3.2-blue.svg
[npm-url]: https://www.npmjs.org/package/each-props/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses.MIT
[travis-img]: https://travis-ci.org/sttk/each-props.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/each-props
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/each-props?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/each-props
[coverage-img]: https://coveralls.io/repos/github/sttk/each-props/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/each-props?branch=master

