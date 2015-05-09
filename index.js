/**
 * Simple structs for JavaScript
 */
var assert = require('assert')

module.exports = {
  struct: makeStruct
}


/**
 * Create the Struct constructor
 * @param {Object} structDef
 * @return {function(new:strct.Struct)}
 */
function makeStruct(structDef) {
  for (var propName in structDef) {
    assert.equal(typeof structDef[propName], 'function',
        'Property descriptors must be constructors')
  }


  return function Struct(obj) {
    assert(obj && typeof obj == 'object', 'Cannot instantiate a Struct with a non-object')

    // Set up core data proxy
    Object.defineProperty(this, '__data', {value: {}})

    for (var propName in structDef) {
      addProperty(this, propName, structDef[propName])
    }

    // Instantiate fields
    for (var key in obj) {
      // Only check for the field existing here, type checking happens in the setter
      assert(structDef.hasOwnProperty(key), 'Struct does not have field "' + key + '"')
      this[key] = obj[key]
    }

    // TODO Consider instantiating defaults in structDef?

    // Prevent monkey-patching other properties
    Object.seal(this)
  }
}


/**
 * Add a getter/setter pair to the Struct
 * @param {function(new:strct.Struct)} Ctor
 * @param {string} propName
 * @param {Function} Descriptor
 */
function addProperty(obj, propName, Descriptor) {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get: function getter() {
      // Getters just proxy to the underlying data
      return this.__data[propName]
    },
    set: getPropertySetter(propName, Descriptor)
  })
}


/**
 * @param {string} propName
 * @param {Function} Descriptor
 * @return {function(*)}
 */
function getPropertySetter(propName, Descriptor) {
  var expectedType = getExpectedType(Descriptor)

  return function setter(value) {
    var type = typeof value
    assert(type == expectedType, 'Expected type ' + expectedType + ' but was ' + type)

    assert(type != 'object' || value instanceof Descriptor,
        'Expected instance of ' + Descriptor.name + ' but was ' + value.constructor.name)

    this.__data[propName] = value
  }
}


/**
 * @param {Function} Descriptor
 * @return {string}
 */
function getExpectedType(Descriptor) {
  switch (Descriptor) {
    case Boolean:
    case String:
    case Number:
    case Function:
      return Descriptor.name.toLowerCase()
    default:
      return 'object'
  }
}
