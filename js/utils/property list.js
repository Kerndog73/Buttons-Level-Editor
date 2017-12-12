"use strict";

function isUpper(char) {
  console.assert(char.length === 1);
  const code = char.charCodeAt(0);
  return 65 <= code && code <= 90;
}

function spaceBeforeCaps(string) {
  let newString = "";
  if (string.length !== 0) {
    newString += string[0];
    for (let i = 1; i != string.length; ++i) {
      const char = string[i];
      if (isUpper(char)) {
        newString += " ";
      }
      newString += char;
    }
  }
  return newString;
}

function createOption(name) {
  return $(`<option value="${name}">${name}</option>`)
}

class EntityElement {
  constructor(entity) {
    this.entity = entity;
    this.element = this.createElement();
    this.properties = new PropertiesElement(entity, this);
    this.inserter = new InserterElement(entity, this);

    this.element.append(this.properties.element);
    this.element.append(this.inserter.element);
  }

  createElement() {
    return $(String.raw`<div class="entity">
      <div class="entity_name">
        <span>${spaceBeforeCaps(this.entity.name)}</span>
      </div>
    </div>`);
  }

  update() {
    this.properties.update();
    this.inserter.update();
  }

  appendProperty(key, type) {
    this.properties.appendProperty(key, type);
  }
  removeProperty(key) {
    this.inserter.removeProperty(key);
  }
}

class PropertiesElement {
  constructor(entity, entityElement) {
    this.entity = entity;
    this.entityElement = entityElement;
    this.element = $(`<div class="properties"></div>`);
  }

  update() {
    this.element.empty();
    let entityProps = this.entity.props;
    for (const key in entityProps) {
      this.appendProperty(key, this.entity.getPropType(key));
    }
  }

  appendProperty(key, type) {
    this.element.append(this.createProperty(key, type));
  }

  createProperty(key, type) {
    return $(`<div class="property"></div>`)
      .append($(`<div class="key_cell"></div>`)
        .append(this.createKey(key))
      )
      .append($(`<div class="val_cell"></div>`)
        .append(this.createVal(key, type))
      )
      .append($(`<div class="rem_cell"></div>`)
        .append(this.createRem(key))
      )
    ;
  }

  createKey(key) {
    return $(`<span>${key}</span>`);
  }
  createVal(key, type) {
    const props = this.entity.props;
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
      case PropType.BOOL:
        return this.createBool(props, key);
      case PropType.BOOL_OP:
        return this.createBoolOp(props, key);
      default:
        console.error("Invalid property type passed to PropertiesElement::createVal", type);
        return null;
    }
  }
  createRem(key) {
    let button = $(`<div class="rem_button">
      <span>X</span>
    </div>`);
    let that = this;
    button.click(function() {
      that.entity.remProp(key);
      $(this).closest(".property").remove();
      that.entityElement.removeProperty(key);
    });
    return button;
  }

  createFloat(props, key) {
    let e = $(String.raw`<input class="val_float" type="number" value="${props[key]}"/>`);
    e.change(function() {
      props[key] = e.val() * 1.0;
    });
    return e;
  }
  createUint(props, key) {
    let e = $(String.raw`<input class="val_uint" type="number" min="0" step="1" value="${props[key]}" />`);
    e.change(function() {
      props[key] = Math.max(0, e.val()) | 0;
    });
    return e;
  }
  createVec(props, key) {
    let e = $(String.raw`<div class="val_vec"></div>`);
    e.append(this.createUint(props[key], "x"));
    e.append(this.createUint(props[key], "y"));
    return e;
  }
  createOrient(props, key) {
    return this.createEnum(Orient, props, key).addClass("val_orient");
  }
  createString(props, key) {
    let e = $(String.raw`<input class="val_string" type="text" value="${props[key]}" />`);
    e.change(function() {
      props[key] = e.val();
    });
    return e;
  }
  createArray(props, key) {
    let e = $(String.raw`<div class="val_array"></div>`);
    let array = props[key];
    e.append(this.createArrayItems(array));
    let button = $(String.raw`<div class="array_insert button">
      <span>Insert</span>
    </div>`);
    e.append(button);
    let that = this;
    button.click(function() {
      array.push(0);
      let item = $(`<div class="item"></div>`);
      item.append(that.createUint(array, array.length - 1));
      item.append(that.createArrayRemButton(array, array.length - 1));
      $(this).parent().children(".items").append(item);
    });
    return e;
  }
  createArrayItems(array) {
    let items = $(`<div class="items"></div>`);
    for (let i in array) {
      let item = $(`<div class="item"></div>`);
      item.append(this.createUint(array, i));
      item.append(this.createArrayRemButton(array, i));
      items.append(item);
    }
    return items;
  }
  createArrayRemButton(array, i) {
    let e = $(String.raw`<div class="rem_button">
      <span>X</span>
    </div>`);
    let that = this;
    e.click(function() {
      array.splice(i, 1);
      let valArray = $(this).closest(".val_array");
      valArray.children(".items").remove();
      valArray.children(".array_insert").before(that.createArrayItems(array));
    });
    return e;
  }
  createBool(props, key) {
    let e = $(`<select></select>`);
    e.append(createOption("FALSE"));
    e.append(createOption("TRUE"));
    e.val(props[key].toString().toUpperCase());
    e.change(function() {
      props[key] = (e.val() === "TRUE");
    });
    e.addClass("val_bool");
    return e;
  }
  createBoolOp(props, key) {
    return this.createEnum(BoolOp, props, key).addClass("val_bool_op");
  }

  createEnum(enumObject, props, key) {
    let e = $(`<select></select>`);
    const value = props[key];
    for (let enumName in enumObject) {
      e.append(createOption(enumName));
      if (value === enumObject[enumName]) {
        e.val(enumName);
      }
    }
    e.change(function() {
      props[key] = enumObject[e.val()];
    });
    return e;
  }
}

class InserterElement {
  constructor(entity, entityElement) {
    this.entity = entity;
    this.entityElement = entityElement;
    this.element = $(`<div class="insert_prop"></div>`);
  }

  update() {
    this.element.empty();
    this.element.append(this.createInsertButton());
    this.element.append(this.createInsertSelect());
    if (this.needInserter()) {
      this.element.show();
    } else {
      this.element.hide();
    }
  }

  needInserter() {
    return Object.keys(this.entity.props).length !== this.entity.defs.size;
  }

  createInsertButton() {
    let button = $(`<div class="button">
      <span>Insert</span>
    </div>`);
    let that = this;
    button.click(function() {
      let inserter = $(this).parent();
      let select = inserter.children("select");
      const propName = select.val();
      select.children(`option[value=${propName}]`).remove();
      if (select.children().length === 0) {
        inserter.hide();
      }
      that.entity.createProp(propName);
      const type = that.entity.getPropType(propName);
      that.entityElement.appendProperty(propName, type);
    });
    return button;
  }

  createInsertSelect() {
    let select = $(`<select></select>`);
    const entityProps = this.entity.props;
    const entityDefs = this.entity.defs;
    for (let [propName] of entityDefs) {
      if (!entityProps.hasOwnProperty(propName)) {
        createOption(propName).appendTo(select);
      }
    }
    return select;
  }

  removeProperty(key) {
    this.element.show();
    let select = this.element.children("select");
    select.append(createOption(key));
  }
}

class PropertyList {
  constructor(element) {
    this.element = element;
    this.entities = [];
  }

  setList(entities) {
    this.element.empty();
    this.entities = entities.map(entity => new EntityElement(entity));
    for (const entity of this.entities) {
      this.element.append(entity.element);
    }
    this.update();
  }

  update() {
    for (const entity of this.entities) {
      entity.update();
    }
  }
};