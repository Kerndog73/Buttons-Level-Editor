"use strict";

class PropertyList {
  constructor(element) {
    this.element = element;
    this.list = [];
  }

  setList(entities) {
    this.list = entities;
    this.update();
  }

  update() {
    this.element.empty();
    for (const entity of this.list) {
      let div = $(document.createElement("div"));
      this.element.append(div);

      let span = $(document.createElement("span"));
      div.append(span);
      span.addClass("entity_name");
      span.html(entity.name);

      let table = $(document.createElement("table"));
      div.append(table);
      let tbody = $(document.createElement("tbody"));
      table.append(tbody);

      for (const key in entity.props) {
        let row = $(document.createElement("tr"));
        tbody.append(row);

        let keyCell = $(document.createElement("td"));
        row.append(keyCell);
        keyCell.addClass("key_cell");

        let valCell = $(document.createElement("td"));
        row.append(valCell);
        valCell.addClass("val_cell");

        let keyInput = this.createKeyInput(key);
        keyCell.append(keyInput);

        let valInput = this.createValueInput(entity.props, key, entity.getPropType(key));
        valCell.append(valInput);
      }
    }
  }

  createKeyInput(value) {
    let e = $(document.createElement("input"));
    e.addClass("key_input");
    e.attr("type", "text");
    e.attr("readonly", "");
    e.val(value);
    return e;
  }

  createValueInput(props, key, type) {
    switch (type) {
      case PropType.FLOAT:
        return this.createFloat(props, key);
      case PropType.UINT:
        return this.createUint(props, key);
      case PropType.VEC:
        return this.createVec(props, key);
      case PropType.ORIENT:
        return this.createOrient(props, key);
      case PropType.STRING:
        return this.createString(props, key);
      case PropType.ARRAY:
        return this.createArray(props, key);
      case PropType.BOOLEAN:
        return this.createBoolean(props, key);
      default:
        console.error("Invalid property type passes to PropertyList::createValueInput", type);
        return null;
    }
  }

  createFloat(props, key) {
    let e = $(document.createElement("input"));
    e.addClass("val_float");
    e.attr("type", "number");
    e.val(props[key]);
    e.change(function() {
      props[key] = e.val() * 1.0;
    });
    return e;
  }
  createUint(props, key) {
    let e = $(document.createElement("input"));
    e.addClass("val_uint");
    e.attr("type", "number");
    e.attr("min", "0");
    e.attr("step", "1");
    e.val(props[key]);
    e.change(function(event) {
      props[key] = e.val() | 0;
    });
    return e;
  }
  createVec(props, key) {
    let e = $(document.createElement("div"));
    e.addClass("val_vec");
    e.append(this.createUint(props[key], "x"));
    e.append(this.createUint(props[key], "y"));
    return e;
  }
  createOrient(props, key) {
    let e = this.createEnum(Orient, props, key);
    e.addClass("val_orient");
    return e;
  }
  createString(props, key) {
    let e = $(document.createElement("input"));
    e.addClass("val_string");
    e.attr("type", "text");
    e.val(props[key]);
    e.change(function() {
      props[key] = e.val();
    });
    return e;
  }
  createArray(props, key) {
    let e = $(document.createElement("div"));
    e.addClass("val_array");
    for (let i in props[key]) {
      e.append(this.createUint(props[key], i));
    }
    return e;
  }
  createBoolean(props, key) {
    let e = this.createEnum(Boolean, props, key);
    e.addClass("val_boolean");
    return e;
  }

  createEnum(enumObject, props, key) {
    let e = $(document.createElement("select"));
    const value = props[key];
    if (enumObject.name === "Boolean") {
      e.append(this.createOption("FALSE", !value));
      e.append(this.createOption("TRUE", value));
    } else {
      for (let enumName in enumObject) {
        e.append(this.createOption(enumName, value === enumObject[enumName]));
      }
    }
    e.change(function() {
      if (enumObject.name === "Boolean") {
        props[key] = (e.val() === "TRUE");
      } else {
        props[key] = enumObject[e.val()];
      }
    });
    return e;
  }

  createOption(enumValue, selected) {
    let e = $(document.createElement("option"));
    if (selected) {
      e.attr("selected", "");
    }
    e.attr("value", enumValue);
    enumValue = enumValue.toLowerCase();
    enumValue = enumValue[0].toUpperCase() + enumValue.substr(1);
    e.html(enumValue);
    return e;
  }
};