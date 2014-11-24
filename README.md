# label-filter

> Filtering DSL to match a set of labels.

[![NPM](http://img.shields.io/npm/v/label-filter.svg?style=flat)](https://npmjs.org/package/label-filter)
[![License](http://img.shields.io/npm/l/label-filter.svg?style=flat)](https://github.com/TabDigital/label-filter)

[![Build Status](http://img.shields.io/travis/TabDigital/label-filter.svg?style=flat)](http://travis-ci.org/TabDigital/label-filter)
[![Dependencies](http://img.shields.io/david/TabDigital/label-filter.svg?style=flat)](https://david-dm.org/TabDigital/label-filter)
[![Dev dependencies](http://img.shields.io/david/dev/TabDigital/label-filter.svg?style=flat)](https://david-dm.org/TabDigital/label-filter)

## Usage

```js
var Filter = require('label-filter');
var filter = new Filter('is:integration not:ie8');

filter.match(['unit']) //false
filter.match(['integration', 'regression']) // true
filter.match(['integration', 'browser', 'ie8']) // false
```

## The DSL

The two basic keywords are `is` and `not`.

- `is:X` matches items with the `X` label
- `is:X+Y` matches items with both the `X` and `Y` labels
- `not:X` excludes items with the `X` label
- `not:X+Y` excludes items with both the `X` and `Y` labels

You can combine multiple keywords to make a filter.

- An item will match the filter if **any** of the `is` statement matches.
- An item will be excluded if **any** of the `not` statement matches.
- The order of appearance in the string doesn't matter
- Exclusions are always stronger than inclusions

This means:

- `is:X is:Y` matches items with `X` or `Y`
- `is:X+Y is:Z` matches items with both `X` and `Y`, or `Z`
- `not:X not:Y` excludes items with `X` or `Y`
- `not:X+Y not:Z` excludes items with both `X` and `Y`, or `Z`
- `is:X not:Y` matches items with `X`, and excludes those with `Y` (even if they have `X`)

*Note that an empty filter matches everything.*

## Methods

The examples below are based on a filter of `is:integration not:ie8`.

### `match`

Checks if a set of labels matches the entire filter.

```js
filter.match([]) // false
filter.match(['unit']) // false
filter.match(['integration', 'browser']) // true
filter.match(['integration', 'browser', 'ie8']) // false
```

### `include`

Checks if a set of labels was explicitly included.

```js
filter.include([]) // false
filter.include(['unit']) // false
filter.include(['integration', 'browser']) // true
filter.include(['integration', 'browser', 'ie8']) // true
```

### `exclude`

Checks if a set of labels was explicitly excluded.

```js
filter.exclude([]) // false
filter.exclude(['unit']) // false
filter.exclude(['integration', 'browser']) // false
filter.exclude(['integration', 'browser', 'ie8']) // true
```

### `add`

Sometimes you need to update a filter after its creation:

```js
var filter = new Filter('is:integration');

if (moment().hours() < 8 || moment().hours() > 18) {
  filter.add('not:backend not:network');
}
```
