const MOUSE_OUT = new Vec(-1, -1);
const LEVEL = new Vec(32, 18);
const TILE = new Vec(32, 32);
const PIXELS = Vec.mul(LEVEL, TILE);

let canvasContainer, canvas, ctx;
let entities = new Entities();
let mouseTile = MOUSE_OUT.clone();
let canvasElementSize = new Vec(1, 1);

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

    entities.render(ctx);
    renderGrid();
    renderMouseHover();
  })();
});

function onWindowResize() {
  const canvasRatio = PIXELS.x / PIXELS.y;
  let canvasContainerRatio = canvasContainer.width() / canvasContainer.height();
  canvasElementSize.x = canvas.width();
  canvasElementSize.y = canvas.height();

  if (canvasRatio > canvasContainerRatio) {
    canvas.css("left", "0");
    canvas.css("top", (canvasContainer.height() - canvasElementSize.y) / 2 + "px");
    canvas.width(canvasContainer.width());
    canvas.height("auto");
  } else {
    canvas.css("left", (canvasContainer.width() - canvasElementSize.x) / 2 + "px");
    canvas.css("top", "0");
    canvas.width("auto");
    canvas.height(canvasContainer.height());
  }
}

function onMouseLeave() {
  mouseTile.copy(MOUSE_OUT);
}

function onMouseMove(e) {
  mouseTile.x = e.offsetX;
  mouseTile.y = e.offsetY;
  mouseTile.mul(PIXELS);
  mouseTile.div(canvasElementSize);
  mouseTile.y = PIXELS.y - mouseTile.y;
  mouseTile.div(TILE);
  mouseTile.call(Math.floor);
}

function onMouseDown() {
  enabledTool.onMouseDown(mouseTile.clone());
}

function onMouseUp() {
  enabledTool.onMouseUp(mouseTile.clone());
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
  if (!mouseTile.eq(MOUSE_OUT)) {
    ctx.fillStyle = "rgba(127, 127, 127, 0.4)";
    ctx.fillRect(mouseTile.x, mouseTile.y, 1, 1);
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