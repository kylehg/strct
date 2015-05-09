var assert = require('assert')
var strct = require('./index')



describe('strct.struct()', function () {
  it('should fail to be created with bad descriptors', function () {
    assert.throws(function () {
      strct.struct({
        num: Number,
        str: 'string',
        bool: false
      })
    })
  })
})

describe('Struct', function () {

  var TestObj = function () {
    this.val = 'foo'
  }

  var Record = strct.struct({
    arr: Array,
    bool: Boolean,
    date: Date,
    fun: Function,
    num: Number,
    num2: Number,
    obj: Object,
    str: String,
    test: TestObj,
  })

  it('should fail to be initialized with nonexistant fields', function () {
    assert.throws(function () {
      new Record({num: 10, bool2: false})
    })
  })

  it('should be enumerable', function () {
    var rec = new Record({bool: false, date: new Date(), num: 10, str: 'foo',})
    var keys = []
    for (key in rec) {
      keys.push(key)
    }
    keys.sort()
    var expectedKeys = ['arr', 'bool', 'date', 'fun', 'num', 'num2', 'obj', 'str', 'test',]
    assert.deepEqual(keys, expectedKeys)
    assert.deepEqual(Object.keys(rec), expectedKeys)
  })

  it('should set fields from its constructor', function () {
    var now = new Date()
    var rec = new Record({num: 10, bool: false, date: now})
    assert.ok(rec instanceof Record)
    assert.equal(rec.num, 10)
    assert.equal(rec.bool, false)
    assert.equal(rec.date.valueOf(), now.valueOf())
  })

  it('should allow setting after initialization', function () {
    var rec = new Record({num: 10})
    rec.num = 5
    assert.equal(rec.num, 5)

    rec.num2 = 10
    assert.equal(rec.num2, 10)

    rec.obj = {val: 'foo'}
    assert.equal(rec.obj.val, 'foo')

    rec.test = new TestObj()
    assert.equal(rec.test.val, 'foo')
  })

  it('should fail to set bad types', function () {
    var rec = new Record({num: 10, date: new Date()})
    assert.throws(function () { rec.num = 'foo' })
    assert.equal(rec.num, 10)

    assert.throws(function () { rec.test = {val: 'foo'} })
    assert.ok(!rec.test)

    assert.throws(function () { rec.date = 12345 })
    assert.notEqual(rec.date.valueOf(), 12345)
  })

  it('should fail to initialize bad types', function () {
    assert.throws(function () { new Record({num: 'foo'}) })
    assert.throws(function () { new Record({test: {val: 'foo'}}) })
    assert.throws(function () { new Record({date: 12345}) })
  })

  it('should not be extensible', function () {
    var rec = new Record({num: 10, date: new Date()})
    rec.val = 'foo'
    assert.ok(!rec.val)
    assert.equal(Object.keys(rec).indexOf('val'), -1)
  })

})
