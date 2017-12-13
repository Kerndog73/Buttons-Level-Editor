"use strict";

let fileOpener, fileSaver;

$(document).ready(function() {
  fileOpener = $("#operations #file_opener");
  fileSaver = $("#operations #file_saver");

  fileOpener.change(function(e) {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      JSONNETtoEntities(e.target.result);
    };
    reader.readAsText(file);
  });

  $("#open_op").click(function() {
    fileOpener[0].click();
  });
  $("#save_op").click(function() {
    const blob = new Blob([entitiesToJSONNET()], {type: "text/plain"});
    fileSaver.attr("href", URL.createObjectURL(blob));
    fileSaver[0].click();
  });
});

function entitiesToJSONNET() {
  let string = `local e = import "entities.jsonnet";\n\n[\n`;
  for (const entity of entities.entities) {
    string += `  e.make${entity.name}(${propertiesToString(entity)}),\n`;
  }
  // JSONNET doesn't mind the extra comma but I do!
  return string.slice(0, -2) + "\n]\n";
}

function propertiesToString(entity) {
  //without this check we'll return "{  }". Not acceptable.
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

function JSONNETtoEntities(jsonnet) {
  // Removing the import
  // We're assuming that the first line of the file is
  // local e = import "entities.jsonnet";
  // if I created the file or this editor created the file then this assumption
  // is OK.
  // THIS CODE WILL BREAK IF SOMEONE MOVES THE IMPORT OR RENAMES THE VARIABLE
  jsonnet = jsonnet.slice(jsonnet.indexOf("\n"));
  const entityNames = JSON.stringify(Object.keys(FACTORIES));
  jsonnet =
`local e = {
  ["make" + name]: function(params) [
    name,
    params
  ] for name in ${entityNames}
};` + jsonnet;

  const entityList = JSON.parse(JSONNETtoJSON(jsonnet));
  console.log(entityList);
}

function JSONNETtoJSON(jsonnet) {
  const jsonnet_make = Module.cwrap('jsonnet_make', 'number', []);
  const jsonnet_realloc = Module.cwrap('jsonnet_realloc', 'number', ['number', 'number', 'number']);
  const jsonnet_evaluate_snippet = Module.cwrap('jsonnet_evaluate_snippet', 'number', ['number', 'string', 'string', 'number']);
  const jsonnet_destroy = Module.cwrap('jsonnet_destroy', 'number', ['number']);
  const vm = jsonnet_make();
  const error_ptr = Module._malloc(4);
  const output_ptr = jsonnet_evaluate_snippet(vm, "snippet", jsonnet, error_ptr);
  const error = Module.getValue(error_ptr, 'i32*');
  Module._free(error_ptr);
  const result = Module.Pointer_stringify(output_ptr);
  jsonnet_realloc(vm, output_ptr, 0);
  jsonnet_destroy(vm);
  if (error == 1) {
    console.log(result);
    alert("An error occured while converting JSONNET to JSON");
    return "";
  } else {
    return result;
  }
}