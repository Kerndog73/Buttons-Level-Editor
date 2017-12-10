"use strict";

let enabledTool = new SelectTool();

$(document).ready(function() {
  let tools = $("#tools .radio");
  tools.click(function(e) {
    tools.removeClass("enabled");
    let tool = $(e.currentTarget);
    tool.addClass("enabled");

    let toolName = tool.attr("id").split("_");
    toolName.forEach(function(str, i, names) {
      names[i] = str[0].toUpperCase() + str.substr(1)
    });
    toolName = toolName.join("");
    enabledTool = new window[toolName];  
  });
});