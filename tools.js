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

class Tool {
  onMouseDown(tile) {
    console.trace("Tool::onMouseDown not implemented");
  }

  onMouseUp(tile) {
    console.trace("Tool::onMouseUp up not implemented");
  }
};

window.SelectTool = class SelectTool extends Tool {
  constructor() {
    super();
    this.startingTile = [-1, -1];
  }

  onMouseDown(tile) {
    this.startingTile[0] = tile[0];
    this.startingTile[1] = tile[1];
  }

  onMouseUp(tile) {
    const minX = Math.min(tile[0], this.startingTile[0]);
    const minY = Math.min(tile[1], this.startingTile[1]);
    const maxX = Math.max(tile[0], this.startingTile[0]);
    const maxY = Math.max(tile[1], this.startingTile[1]);
  }
};

enabledTool = new SelectTool();