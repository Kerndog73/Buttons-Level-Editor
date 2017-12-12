"use strict";

let fileOpener, fileSaver;

$(document).ready(function() {
  fileOpener = $("#operations #file_opener");
  fileSaver = $("#operations #file_saver");

  $("#open_op").click(function() {
    fileOpener.click();
  });
  $("#save_op").click(function() {
    console.log(entitiesToJSONNET());
    //const blob = new Blob([entitiesToJSONNET()], {type: "text/plain"});
    //fileSaver.attr("href", URL.createObjectURL(blob));
    //fileSaver[0].click();
  });
});

function entitiesToJSONNET() {
  let string = `local e = import "entities.jsonnet";\n\n\n[\n`;
  for (const entity of entities.entities) {
    string += `  e.make${entity.name}(${propertiesToString(entity)}),\n`;
  }
  // JSONNET doesn't mind the extra comma but I do!
  return string.slice(0, -2) + "\n]\n";
}

function propertiesToString(entity) {
  //without this check we'll return "{  }"
  if (Object.keys(entity).length === 0) {
    return "{}";
  }
  let string = "{\n";
  for (const key in entity.props) {
    const val = entity.props[key];
    const type = entity.getPropType(key);
    string += `    ${propNameToString(key)}: ${propToString(type, val)},\n`;
  }
  return string.slice(0, -2) + "\n  }";
}

function propNameToString(propName) {
  if (propName.includes(" ")) {
    return "\"" + propName + "\"";
  } else {
    return propName;
  }
}

function propToString(propType, prop) {
  switch (propType) {
    case PropType.NONE:
      return "";
    case PropType.FLOAT:
    case PropType.UINT:
    case PropType.BOOL:
      return prop.toString();
    case PropType.STRING:
      return "\"" + prop + "\"";
    case PropType.VEC:
      return `[${prop.x}, ${prop.y}]`;
    case PropType.ORIENT:
      return enumToString(Orient, prop);
    case PropType.ARRAY:
      return "[" + prop.map(x => x + ", ").join("").slice(0, -2) + "]";
    case PropType.BOOL_OP:
      return enumToString(BoolOp, prop);

    default:
      console.error("Invalid property type", propType);
      return false;
  }
}

function enumToString(enumObject, prop) {
  return "\"" + Object.keys(enumObject)[prop].toLowerCase() + "\"";
}