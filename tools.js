let enabledTool = "select";

$(document).ready(function() {
  $(".tool").click(function(e) {
    $(".tool").removeClass("enabled");
    let tool = $(e.currentTarget);
    tool.addClass("enabled");
    //                             Trimming off "_tool"
    enabledTool = tool.attr("id").enabledTool.slice(0, -5);
  });
});