let enabledTool;

$(document).ready(function() {
  $(".tool").click(function(e) {
    $(".tool").removeClass("enabled");
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

enabledTool = new SelectTool();
window.SelectTool = SelectTool;