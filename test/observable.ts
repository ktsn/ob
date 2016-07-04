import * as assert from 'power-assert'
import * as sinon from 'sinon'
import Observable from '../src/observable'

describe('Observable', () => {

  it('map', () => {
    const value = sinon.spy()
    const error = sinon.spy()

    Observable.value(1)
      .map(val => val + 1)
      .map(val => val.toString())
      .subscribe(value, error)

    assert(value.calledWith('2'))
    assert(!error.called)
  })

  it('flatMap', () => {
    const value = sinon.spy()
    const error = sinon.spy()

    const ob = new Observable<string, number>()

    ob
      .flatMap(val => {
        if (val > 3) {
          return Observable.value<string, number>(10)
        } else {
          return Observable.error<string, number>('failure')
        }
      })
      .subscribe(value, error)

    ob.value(5)
    assert(value.calledWith(10))

    ob.value(3)
    assert(error.calledWith('failure'))
  })

  it('filter', () => {
    const value = sinon.spy()
    const error = sinon.spy()

    const ob = new Observable()

    ob.filter(val => val > 5)
      .subscribe(value, error)

    ob.value(1)
    ob.value(3)
    ob.value(5)
    ob.value(7)
    ob.value(9)

    assert.deepEqual(value.args.map(args => args[0]), [7, 9])
    assert(!error.called)
  })

  it('reduce', () => {
    const value = sinon.spy()
    const error = sinon.spy()

    const ob = new Observable<void, number>()

    ob.reduce((acc, value) => acc + value, 0)
      .subscribe(value, error);

    [1, 1, 2, 3, 5, 8, 13].forEach(n => ob.value(n))

    assert(value.lastCall.calledWith(33))
    assert(!error.called)
  })

})
