function makeConstProp(obj, name, val) {
  Object.defineProperty(obj, name, {
    configurable: false,
    enumerable: false,
    value: val,
    writable: false
  });
}