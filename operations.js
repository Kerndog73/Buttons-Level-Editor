let fileOpener, fileSaver;

$(document).ready(function() {
  fileOpener = $("#operations #file_opener");
  fileSaver = $("#operations #file_saver");

  $("#open_op").click(function() {
    fileOpener.click();
  });
  $("#save_op").click(function() {
    const json = entitiesToJSON();
    if (json.length != 0) {
      const blob = new Blob([entitiesToJSON()], {type: "text/json"});
      fileSaver.attr("href", URL.createObjectURL(blob));
      fileSaver[0].click();
    }
  });
});

function entitiesToJSON() {
  const code = entitiesToJSONNET();

  const jsonnet_make = Module.cwrap('jsonnet_make', 'number', []);
  const jsonnet_realloc = Module.cwrap('jsonnet_realloc', 'number', ['number', 'number', 'number']);
  const jsonnet_evaluate_snippet = Module.cwrap('jsonnet_evaluate_snippet', 'number', ['number', 'string', 'string', 'number']);
  const jsonnet_destroy = Module.cwrap('jsonnet_destroy', 'number', ['number']);

  const vm = jsonnet_make();
  const error_ptr = Module._malloc(4);
  const output_ptr = jsonnet_evaluate_snippet(vm, "snippet", code, error_ptr);
  const error = Module.getValue(error_ptr, 'i32*');
  Module._free(error_ptr);
  const result = Module.Pointer_stringify(output_ptr);
  jsonnet_realloc(vm, output_ptr, 0);
  jsonnet_destroy(vm);
  if (error == 1) {
    alert("An error occured while converting JSONNET to JSON");
    console.log(result);
    return "";
  } else {
    return result;
  }
}

function entitiesToJSONNET() {
  return "[{id: i} for i in std.makeArray(4, function(x) x)]";
}