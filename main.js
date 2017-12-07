$(document).ready(function() {
  console.log("Ready");

  $(window).resize(function () {
    console.log("Resize");

    let container = $("#editor");
    let canvas = container.children("canvas");
    let canvasRatio = canvas.attr("width") / canvas.attr("height");
    let containerRatio = container.width() / container.height();

    if (canvasRatio > containerRatio) {
      canvas.css("left", "0");
      canvas.css("top", (container.height() - canvas.height()) / 2 + "px");
      canvas.width(container.width());
      canvas.height("auto");
    } else {
      canvas.css("left", (container.width() - canvas.width()) / 2 + "px");
      canvas.css("top", "0");
      canvas.width("auto");
      canvas.height(container.height());
    }

  });

  $(window).resize();

});