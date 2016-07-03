import BaseObservable from './base-observable'

export default class Observable<E, V> extends BaseObservable<E, V> {

  map<U>(f: (val: V) => U): Observable<E, U> {
    return this.chain<Observable<E, U>, U>((o, val) => {
      o.value(f(val))
    })
  }

  flatMap<U>(f: (val: V) => Observable<E, U>): Observable<E, U> {
    return this.chain<Observable<E, U>, U>((o, val) => {
      f(val).subscribe(
        nextVal => o.value(nextVal),
        error => o.error(error)
      )
    })
  }

  filter(f: (val: V) => boolean): Observable<E, V> {
    return this.chain<Observable<E, V>, V>((o, val) => {
      if (f(val)) {
        o.value(val)
      }
    })
  }
}
