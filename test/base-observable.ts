import * as assert from 'power-assert'
import * as sinon from 'sinon'
import BaseObservable from '../src/base-observable'

describe('BaseObservable', () => {
  it('subscribe', () => {
    const b = new BaseObservable()

    const value = sinon.spy()
    const error = sinon.spy()

    b.subscribe(value, error)

    b.value('value')
    assert(value.calledWith('value'))

    b.error(1)
    assert(error.calledWith(1))

    assert(value.calledOnce)
    assert(error.calledOnce)
  })

  it('subscribe default value or error', () => {
    const value = sinon.spy()
    const error = sinon.spy()

    let b = new BaseObservable()
    b.value('value')
    b.subscribe(value, error)

    assert(value.calledWith('value'))

    b = new BaseObservable()
    b.error(123)
    b.subscribe(value, error)

    assert(error.calledWith(123))
  })

  it('chain', () => {
    const spy = sinon.spy()
    const b = new BaseObservable()

    const c = b.chain(spy)

    assert(c instanceof BaseObservable)
    assert(c !== b)
    assert(!spy.called)

    b.error(1)
    assert(!spy.called)

    b.value(2)
    assert(spy.calledWith(c, 2))
  })

  it('gives constants', () => {
    let b = BaseObservable.value(123)
    assert(b instanceof BaseObservable)
    assert(b._value === 123)
    assert(b._error === null)

    b = BaseObservable.error('error')
    assert(b instanceof BaseObservable)
    assert(b._value === null)
    assert(b._error === 'error')
  })

  describe('compativility with sub classes', () => {
    class Sub<E, V> extends BaseObservable<E, V> {
      static value: <E, V>(value: V) => Sub<E, V>
      static error: <E, V>(error: E) => Sub<E, V>
    }

    it('gives sub class instance on chain', () => {
      const s = new Sub()
      assert(s instanceof Sub)
    })

    it('gives sub class constants', () => {
      let s: Sub<any, any> = Sub.value(1)
      assert(s instanceof Sub)

      s = Sub.error(2)
      assert(s instanceof Sub)
    })
  })
})
