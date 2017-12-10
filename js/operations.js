"use strict";

let fileOpener, fileSaver;

$(document).ready(function() {
  fileOpener = $("#operations #file_opener");
  fileSaver = $("#operations #file_saver");

  $("#open_op").click(function() {
    fileOpener.click();
  });
  $("#save_op").click(function() {
    const blob = new Blob([entitiesToJSONNET()], {type: "text/plain"});
    fileSaver.attr("href", URL.createObjectURL(blob));
    fileSaver[0].click();
  });
});

function entitiesToJSONNET() {
  return "[{id: i} for i in std.makeArray(4, function(x) x)]";
}