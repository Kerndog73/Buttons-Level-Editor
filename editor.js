let canvasContainer, canvas, ctx;
let entities = [];
let mouseTile = [-1, -1];
let canvasElementSize = [1, 1];

const LEVEL = new Vec(32, 18);
const TILE = new Vec(32, 32);
const PIXELS = Vec.mul(LEVEL, TILE);

$(document).ready(function() {
  setupCanvas();

  $(window).resize(onWindowResize);
  //The window resize event doesn't always fire when the window is resized
  setInterval(onWindowResize, 500);
  onWindowResize();

  canvas.mouseleave(onMouseLeave);
  canvas.mousemove(onMouseMove);
  canvas.mousedown(onMouseDown);
  canvas.mouseup(onMouseUp);

  let lastTime = performance.now();
  (function animate(time) {
    window.requestAnimationFrame(animate);
    const delta = time - lastTime;
    lastTime = time;
    ctx.clearRect(0, 0, PIXELS.x, PIXELS.y);

    renderEntities();
    renderGrid();
    renderMouseHover();
  })();
});

function onWindowResize() {
  const canvasRatio = PIXELS.x / PIXELS.y;
  let canvasContainerRatio = canvasContainer.width() / canvasContainer.height();

  if (canvasRatio > canvasContainerRatio) {
    canvas.css("left", "0");
    canvas.css("top", (canvasContainer.height() - canvas.height()) / 2 + "px");
    canvas.width(canvasContainer.width());
    canvas.height("auto");
  } else {
    canvas.css("left", (canvasContainer.width() - canvas.width()) / 2 + "px");
    canvas.css("top", "0");
    canvas.width("auto");
    canvas.height(canvasContainer.height());
  }

  canvasElementSize[0] = canvas.width();
  canvasElementSize[1] = canvas.height();
}

function onMouseLeave() {
  mouseTile[0] = -1;
  mouseTile[1] = -1;
}

function tilePosFromPixelOffsetX(offsetX) {
  return Math.floor(offsetX * PIXELS.x / canvasElementSize[0] / TILE.x);
}

function tilePosFromPixelOffsetY(offsetY) {
  return Math.floor((PIXELS.y - offsetY * PIXELS.y / canvasElementSize[1]) / TILE.y);
}

function onMouseMove(e) {
  mouseTile[0] = tilePosFromPixelOffsetX(e.offsetX);
  mouseTile[1] = tilePosFromPixelOffsetY(e.offsetY);
}

function onMouseDown() {
  enabledTool.onMouseDown(new Vec(mouseTile[0], mouseTile[1]));
}

function onMouseUp() {
  enabledTool.onMouseUp(new Vec(mouseTile[0], mouseTile[1]));
}

function setupCanvas() {
  canvasContainer = $("#editor");
  canvas = canvasContainer.children("canvas");
  canvas.attr("width", PIXELS.x);
  canvas.attr("height", PIXELS.y);
  ctx = canvas[0].getContext("2d");
  ctx.translate(0, PIXELS.y);
  ctx.scale(TILE.x, -TILE.y);
}

function renderMouseHover() {
  if (mouseTile[0] != -1 && mouseTile[1] != -1) {
    ctx.fillStyle = "rgba(127, 127, 127, 0.4)";
    ctx.fillRect(mouseTile[0], mouseTile[1], 1, 1);
  }
}

function renderGrid() {
  const transform = ctx.currentTransform;

  ctx.scale(1.0 / TILE.x, 1.0 / TILE.y);

  ctx.beginPath();

  ctx.strokeWidth = 2;
  ctx.strokeStyle = "#FFF";

  for (let x = TILE.x; x < PIXELS.x; x += TILE.x) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, PIXELS.y);
  }

  for (let y = TILE.y; y < PIXELS.y; y += TILE.y) {
    ctx.moveTo(0, y);
    ctx.lineTo(PIXELS.x, y);
  }

  ctx.stroke();

  ctx.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
}

function renderEntities() {
  for (let e in entities) {

  }
}