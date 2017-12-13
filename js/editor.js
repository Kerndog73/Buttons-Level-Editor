"use strict";

const MOUSE_OUT = new Vec(-1, -1);
const LEVEL = new Vec(32, 18);
const TILE = new Vec(64, 64);
const PIXELS = Vec.mul(LEVEL, TILE);

let canvasContainer, canvas, ctx;
let entities = new Entities();
let mouseTile = MOUSE_OUT.clone();
let mouseDown = false;
let canvasElementSize = new Vec(1, 1);

$(document).ready(function() {
  setupCanvas();

  $(window).resize(onWindowResize);
  onWindowResize();
  setInterval(onWindowResize, 500);

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
    if (!mouseTile.eq(MOUSE_OUT)) {
      if (mouseDown) {
        enabledTool.dragRender(ctx);
      } else {
        enabledTool.hoverRender(ctx, mouseTile);
      }
    }
  })();
});

function onWindowResize() {
  const canvasRatio = PIXELS.x / PIXELS.y;
  let canvasContainerRatio = canvasContainer.width() / canvasContainer.height();
  canvasElementSize.x = canvas.width();
  canvasElementSize.y = canvas.height();

  if (canvasRatio > canvasContainerRatio) {
    canvas.css("left", "0");//      accounting for the border of 4px     v
    canvas.css("top", (canvasContainer.height() - (canvasElementSize.y + 8)) / 2 + "px");
    canvas.css("width", "100%");
    canvas.css("height", "auto");
  } else {
    canvas.css("left", (canvasContainer.width() - (canvasElementSize.x + 8)) / 2 + "px");
    canvas.css("top", "0");
    canvas.css("width", "auto");
    canvas.css("height", "100%");
  }

  // setting the size to auto or 100% will sometimes change the size of the
  // canvas immediately
  canvasElementSize.x = canvas.width();
  canvasElementSize.y = canvas.height();
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

  enabledTool.onMouseMove(mouseTile.clone());
}

function onMouseDown() {
  mouseDown = true;
  enabledTool.onMouseDown(mouseTile.clone());
}

function onMouseUp() {
  mouseDown = false;
  enabledTool.onMouseUp(mouseTile.clone());
}

function setupCanvas() {
  canvasContainer = $("#editor");
  canvas = canvasContainer.children();
  canvas.attr("width", PIXELS.x);
  canvas.attr("height", PIXELS.y);
  ctx = canvas[0].getContext("2d");
  ctx.translate(0, PIXELS.y);
  ctx.scale(TILE.x, -TILE.y);
}

function renderGrid() {
  const transform = ctx.currentTransform;

  ctx.scale(1.0 / TILE.x, 1.0 / TILE.y);

  ctx.beginPath();

  ctx.lineWidth = 4;
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