import { noop } from './utils'

interface Subscriber<E, V> {
  error: (error: E) => void
  value: (value: V) => void
}

export default class BaseObservable<E, V> {
  private _error: E | null= null
  private _value: V | null = null
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

  chain(f: (o: any, value: V) => void): any {
    const Ctor = this.constructor as any
    const o = new Ctor()

    this.subscribe(
      val => f(o, val),
      error => o.error(error)
    )

    return o
  }

  subscribe(fv: (value: V) => void, fe: (error: E) => void = noop): void {
    const s = {
      error: fe,
      value: fv
    }

    this._subscribers.push(s)

    if (this._error !== null) {
      fe(this._error)
    } else if (this._value !== null) {
      fv(this._value)
    }
  }

  static value<E, V>(value: V): any {
    const o = new this<E, V>() as any
    o._value = value
    return o
  }

  static error<E, V>(error: E): any {
    const o = new this<E, V>() as any
    o._error = error
    return o
  }
}
