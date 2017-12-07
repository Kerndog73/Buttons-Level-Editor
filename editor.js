let canvas, ctx, entities = [];
const LEVEL = [32, 18];
const TILE = [32, 32];
const PIXELS = [LEVEL[0] * TILE[0], LEVEL[1] * TILE[1]];

$(document).ready(function() {
  console.log("Ready");

  setupCanvas();

  $(window).resize(onWindowResize);
  //The window resize event doesn't always fire when the window is resized
  setInterval(
    onWindowResize,
    500
  );
  onWindowResize();

  let lastTime = performance.now();
  (function animate(time) {
    window.requestAnimationFrame(animate);
    let delta = time - lastTime;
    lastTime = time;
    renderEntities(delta);
    renderGrid();
  })();
});

function onWindowResize() {
  let container = $("#editor");
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
}

function setupCanvas() {
  canvas = $("#editor canvas");
  canvas.attr("width", PIXELS[0]);
  canvas.attr("height", PIXELS[1]);
  ctx = canvas[0].getContext("2d");
  ctx.translate(0, PIXELS[1]);
  ctx.scale(1, -1);
}

function renderGrid() {
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
}

function renderEntities(delta) {
  for (let e in entities) {

  }
}