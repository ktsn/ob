# ob

[![npm version](https://badge.fury.io/js/%40ktsn%2Fob.svg)](https://badge.fury.io/js/%40ktsn%2Fob)
[![Build Status](https://travis-ci.org/ktsn/ob.svg?branch=master)](https://travis-ci.org/ktsn/ob)

A tiny and extensible FRP library.

## Example

```js
import { Observable } from '@ktsn/ob'

function source() {
  const o = new Observable()

  window.addEventListener('keypress', event => {
    o.value(event.key)
  })

  return o
}

source()
  .filter(val => val.length === 1)
  .flatMap(val => {
    const num = parseInt(val, 10)
    if (isNan(num)) {
      return Observable.error('parse error')
    } else {
      return Observable.value(num)
    }
  })
  .map(val => val * 10)
  .subscribe(
    result => console.log(result),
    error => console.log(error)
  )
```

### Custom operators

You can extends `Observable` class for custom operators.
If you does not want any build in operators, you should extends `BaseObservable` class.

```js
import { Observable } from '@ktsn/ob'

class MyObservable extends Observable {

  tap(f) {
    return this.chain((observer, val) => {
      f(val)
      observer.value(val)
    })
  }

  buffer(ms) {
    let timer = null
    let buffer = []

    return this.chain((observer, val) => {
      clearTimeout(timer)
      buffer.push(val)

      timer = setTimeout(() => {
        observer.value(buffer)
        buffer = []
      }, ms)
    })
  }
}

const my = new MyObservable()

my.tap(val => console.log(val))
  .buffer(100)
  .subscribe(val => console.log(val))

my.value(1)
my.value(2)

setTimeout(() => {
  my.value(3)
  my.value(4)
  my.value(5)
}, 200)

// Output should be...
// 1
// 2
// [1, 2]
// 3
// 4
// 5
// [3, 4, 5]
```

## License

MIT
