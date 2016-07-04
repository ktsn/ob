import BaseObservable from './base-observable'

export default class Observable<E, V> extends BaseObservable<E, V> {

  map<U>(f: (val: V) => U): Observable<E, U> {
    return this.chain((o, val) => {
      o.value(f(val))
    })
  }

  flatMap<U>(f: (val: V) => Observable<E, U>): Observable<E, U> {
    return this.chain((o, val) => {
      f(val).subscribe(
        nextVal => o.value(nextVal),
        error => o.error(error)
      )
    })
  }

  filter(f: (val: V) => boolean): Observable<E, V> {
    return this.chain((o, val) => {
      if (f(val)) {
        o.value(val)
      }
    })
  }

  reduce<U>(f: (acc: U, val: V) => U, init: U): Observable<E, U> {
    let acc = init
    return this.chain((o, val) => {
      acc = f(acc, val)
      o.value(acc)
    })
  }

  static value: <E, V>(value: V) => Observable<E, V>
  static error: <E, V>(error: E) => Observable<E, V>
}
