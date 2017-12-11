"use strict";

function makeConstProp(obj, name, val) {
  Object.defineProperty(obj, name, {
    configurable: false,
    enumerable: true,
    value: val,
    writable: false
  });
}

function makeEnum(values) {
  let enumObj = {};
  for (let i in values) {
    makeConstProp(enumObj, values[i], i | 0);
  }
  Object.defineProperty(enumObj, "length", {
    configurable: false,
    enumerable: false,
    value: values.length,
    writable: false
  });
  return enumObj;
}