let canvasContainer, canvas, ctx;
let entities = [];
let mouseTile = [-1, -1];
let canvasElementSize = [1, 1];

const LEVEL = [32, 18];
const TILE = [32, 32];
const PIXELS = [LEVEL[0] * TILE[0], LEVEL[1] * TILE[1]];

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
    ctx.clearRect(0, 0, PIXELS[0], PIXELS[1]);

    renderEntities();
    renderGrid();
    renderMouseHover();
  })();
});

function onWindowResize() {
  const canvasRatio = PIXELS[0] / PIXELS[1];
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
  return Math.floor(offsetX * PIXELS[0] / canvasElementSize[0] / TILE[0]);
}

function tilePosFromPixelOffsetY(offsetY) {
  return Math.floor((PIXELS[1] - offsetY * PIXELS[1] / canvasElementSize[1]) / TILE[1]);
}

function onMouseMove(e) {
  mouseTile[0] = tilePosFromPixelOffsetX(e.offsetX);
  mouseTile[1] = tilePosFromPixelOffsetY(e.offsetY);
}

function onMouseDown() {
  enabledTool.onMouseDown(mouseTile);
}

function onMouseUp() {
  enabledTool.onMouseUp(mouseTile);
}

function setupCanvas() {
  canvasContainer = $("#editor");
  canvas = canvasContainer.children("canvas");
  canvas.attr("width", PIXELS[0]);
  canvas.attr("height", PIXELS[1]);
  ctx = canvas[0].getContext("2d");
  ctx.translate(0, PIXELS[1]);
  ctx.scale(TILE[0], -TILE[1]);
}

function renderMouseHover() {
  if (mouseTile[0] != -1 && mouseTile[1] != -1) {
    ctx.fillStyle = "rgba(127, 127, 127, 0.4)";
    ctx.fillRect(mouseTile[0], mouseTile[1], 1, 1);
  }
}

function renderGrid() {
  const transform = ctx.currentTransform;

  ctx.scale(1.0 / TILE[0], 1.0 / TILE[1]);

  ctx.beginPath();

  ctx.strokeWidth = 2;
  ctx.strokeStyle = "#FFF";

  for (let x = TILE[0]; x < PIXELS[0]; x += TILE[0]) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, PIXELS[1]);
  }

  for (let y = TILE[1]; y < PIXELS[1]; y += TILE[1]) {
    ctx.moveTo(0, y);
    ctx.lineTo(PIXELS[0], y);
  }

  ctx.stroke();

  ctx.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
}

function renderEntities() {
  for (let e in entities) {

  }
}