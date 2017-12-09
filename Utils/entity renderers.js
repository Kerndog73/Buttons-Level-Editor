function colorF(r, g, b, a = 1.0) {
  let mul = x => Math.round(x * 255);
  return `rgba(${mul(r)}, ${mul(g)}, ${mul(b)}, ${a})`;
}

function renderCircle(ctx, x, y, r) {
  ctx.ellipse(x, y, r, r, 0.0, 0.0, 2 * Math.PI, false);
}

function renderPlayer(ctx, props) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(255, 255, 255)";
  renderCircle(ctx, 0.5, 0.5, 0.5);
  ctx.fill();
}

function renderExit(ctx, props) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 255)";
  ctx.fillRect(0, 0, 1, 1);

  ctx.beginPath();
  ctx.fillStyle = "rgb(127, 127, 255)";
  ctx.fillRect(0.25, 0.25, 0.5, 0.5);
}

function renderPlatform(ctx, props) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(63, 63, 63)";
  ctx.fillRect(0, 0, 1, 1);
}

function renderBox(ctx, props) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(193, 154, 107)";
  ctx.fillRect(0, 0, 1, 1);
}

function renderPolygon(ctx, sides, radius, rotation) {
  if (sides !== (sides | 0) || sides < 1) {
    console.error("Invalid number of sides", sides);
  }

  let angle = rotation;
  const sideAngle = 2.0 * Math.PI / sides;
  ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  for (let s = 1; s !== sides; ++s) {
    angle += sideAngle;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
}

function renderKey(ctx, props) {
  const sides = props.hasOwnProperty("index") ? (props.index + 1) : 3;
  ctx.translate(0.5, 0.5);
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 255, 0)";
  renderPolygon(ctx, sides, 0.4, Math.PI / 2.0);
  ctx.fill();
}

function renderLock(ctx, props) {
  const sides = props.hasOwnProperty("index") ? (props.index + 1) : 3;
  //clockwise
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 1);
  ctx.lineTo(1, 1);
  ctx.lineTo(1, 0);
  ctx.closePath();

  ctx.translate(0.5, 0.5);
  //anti-clockwise
  renderPolygon(ctx, sides, 0.4, Math.PI / 2);

  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fill();
}

function renderButton(ctx, props) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillRect(0.125, 0.0, 0.75, 0.25);

  ctx.beginPath();
  ctx.fillStyle = colorF(0.6, 0.6, 0.6);
  ctx.fillRect(0.0, 0.0, 1.0, -0.15);
}

function renderSwitch(ctx, props) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(80, 80, 80)";
  ctx.fillRect(0, 0, 1, 0.25);

  ctx.beginPath();
  ctx.fillStyle = "rgb(110, 110, 110)";
  ctx.fillRect(0.45, 0.25, 0.1, 0.75);

  ctx.beginPath();
  ctx.fillStyle = "rgb(255, 0, 0)";
  renderCircle(ctx, 0.5, 1.0, 0.2);
  ctx.fill();
}