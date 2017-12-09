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
        const val = entity.props[key];
        let row = $(document.createElement("tr"));
        tbody.append(row);

        let keyCell = $(document.createElement("td"));
        row.append(keyCell);
        keyCell.addClass("key_cell");

        let valCell = $(document.createElement("td"));
        row.append(valCell);
        valCell.addClass("val_cell");

        let keyInput = $(document.createElement("input"));
        keyCell.append(keyInput);
        keyInput.addClass("key_input");
        keyInput.attr("type", "text");
        keyInput.val(key);

        let valInput = this.createValueInput(val, entity.getPropType(key));
        valCell.append(valInput);
      }
    }
  }

  createValueInput(value, type) {
    switch (type) {
      case PropType.NONE:
        console.assert(false);
        return null;
      case PropType.FLOAT:
        return this.createFloat(value);
      case PropType.UINT:
        return this.createUint(value);
      case PropType.VEC:
        return this.createVec(value);
      case PropType.ORIENT:
        return this.createOrient(value);
      case PropType.STRING:
        return this.createString(value);
      case PropType.ARRAY:
        return this.createArray(value);
      case PropType.BOOLEAN:
        return this.createBoolean(value);
    }
    return e;
  }

  createFloat(value) {
    let e = $(document.createElement("input"));
    e.addClass("val_float");
    e.attr("type", "number");
    e.val(value);
    return e;
  }
  createUint(value) {
    let e = $(document.createElement("input"));
    e.addClass("val_uint");
    e.attr("type", "number");
    e.attr("min", "0");
    e.attr("step", "1");
    e.val(value);
    return e;
  }
  createVec(value) {
    let e = $(document.createElement("div"));
    e.addClass("val_vec");
    e.append(this.createUint(value.x));
    e.append(this.createUint(value.y));
    return e;
  }
  createOrient(value) {
    let e = createEnum(Orient, value);
    e.addClass("val_orient");
    return e;
  }
  createString(value) {
    let e = $(document.createElement("input"));
    e.addClass("val_string");
    e.attr("type", "text");
    e.val(value);
    return e;
  }
  createArray(value) {
    let e = $(document.createElement("div"));
    e.addClass("val_array");
    for (let val of value) {
      e.append(createUint(val));
    }
    return e;
  }
  createBoolean(value) {
    createEnum(Boolean, value);
  }

  createEnum(enumObject, value) {
    let e = $(document.createElement("select"));
    if (enumObject.name == "Boolean") {
      e.append(this.createOption("FALSE", !value));
      e.append(this.createOption("TRUE", value));
    } else {
      for (let enumName in enumObject) {
        e.append(this.createOption(enumName, value === enumObject[enumName]));
      }
    }
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