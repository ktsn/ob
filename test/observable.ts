import * as assert from 'power-assert'
import * as sinon from 'sinon'
import Observable from '../src/observable'

describe('Observable', () => {

  it('map', () => {
    const value = sinon.spy()
    const error = sinon.spy()

    Observable.value<Observable<any, number>, any, number>(1)
      .map(val => val + 1)
      .map(val => val.toString())
      .subscribe(value, error)

    assert(value.calledWith('2'))
    assert(!error.called)
  })

  it('flatMap', () => {
    const value = sinon.spy()
    const error = sinon.spy()

    type O = Observable<string, number>
    const ob = new Observable<string, number>()

    ob
      .flatMap(val => {
        if (val > 3) {
          return Observable.value<O, string, number>(10)
        } else {
          return Observable.error<O, string, number>('failure')
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

})
