"use strict";

function makeConstProp(obj, name, val) {
  Object.defineProperty(obj, name, {
    configurable: false,
    enumerable: true,
    value: val,
    writable: false
  });
}