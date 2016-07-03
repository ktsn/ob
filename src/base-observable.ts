import { noop } from './utils'

interface Subscriber<E, V> {
  error: (error: E) => void
  value: (value: V) => void
}

export default class BaseObservable<E, V> {
  private _error: E = null
  private _value: V = null
  private _subscribers: Subscriber<E, V>[] = []

  value(value: V): void {
    this._value = value
    this._error = null
    this._subscribers.forEach(s => s.value(value))
  }

  error(error: E): void {
    this._value = null
    this._error = error
    this._subscribers.forEach(s => s.error(error))
  }

  chain<O extends BaseObservable<E, U>, U>(f: (o: O, value: V) => void): O {
    const Ctor: any = this.constructor
    const o: O = new Ctor()

    this.subscribe(
      val => f(o, val),
      error => o.error(error)
    )

    return o
  }

  subscribe(fv: (value: V) => void, fe?: (error: E) => void): void {
    const s = {
      error: fe || noop,
      value: fv
    }

    this._subscribers.push(s)

    if (this._error !== null) {
      fe(this._error)
    } else if (this._value !== null) {
      fv(this._value)
    }
  }

  static value<O extends BaseObservable<E, V>, E, V>(value: V): O {
    const o: O = <any>new this<E, V>()
    o._value = value
    return o
  }

  static error<O extends BaseObservable<E, V>, E, V>(error: E): O {
    const o: O = <any>new this<E, V>()
    o._error = error
    return o
  }
}
