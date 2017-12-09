"use strict";

function colorF(r, g, b, a = 1.0) {
  let mul = x => Math.round(x * 255);
  return `rgba(${mul(r)}, ${mul(g)}, ${mul(b)}, ${a})`;
}

function renderCircle(ctx, x, y, r) {
  ctx.ellipse(x, y, r, r, 0.0, 0.0, 2 * Math.PI, false);
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

function orientTransform(ctx, orient) {
  const table = {
    [Orient.UP]: new Vec(0, 0),
    [Orient.RIGHT]: new Vec(0, 1),
    [Orient.DOWN]: new Vec(1, 1),
    [Orient.LEFT]: new Vec(1, 0)
  };
  ctx.translate(table[orient].x, table[orient].y);
  ctx.rotate(-Math.PI / 2.0 * orient);
}

function getOr(props, name, alternative) {
  if (props.hasOwnProperty(name)) {
    return props[name];
  } else {
    return alternative;
  }
}

function renderPlayer(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(255, 255, 255)";
  renderCircle(ctx, 0.5, 0.5, 0.5);
  ctx.fill();
}

function renderExit(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 255)";
  ctx.fillRect(0, 0, 1, 1);

  ctx.beginPath();
  ctx.fillStyle = "rgb(127, 127, 255)";
  ctx.fillRect(0.25, 0.25, 0.5, 0.5);
}

function renderPlatform(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(63, 63, 63)";
  ctx.fillRect(0, 0, 1, 1);
}

function renderBox(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(193, 154, 107)";
  ctx.fillRect(0, 0, 1, 1);
}

function renderKey(ctx, props) {
  const sides = getOr(props, "index", 0) + 3;
  ctx.translate(0.5, 0.5);
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 255, 0)";
  renderPolygon(ctx, sides, 0.4, Math.PI / 2.0);
  ctx.fill();
}

function renderLock(ctx, props) {
  const sides = getOr(props, "index", 0) + 3;
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
  orientTransform(ctx, getOr(props, "orient", Orient.UP));

  ctx.beginPath();
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillRect(0.125, 0.0, 0.75, 0.25);

  ctx.beginPath();
  ctx.fillStyle = colorF(0.6, 0.6, 0.6);
  ctx.fillRect(0.0, 0.0, 1.0, -0.15);
}

function renderSwitch(ctx, props) {
  orientTransform(ctx, getOr(props, "orient", Orient.UP));

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

function renderDoor(ctx, props) {
  orientTransform(ctx, getOr(props, "orient", Orient.UP));
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 255)";
  ctx.fillRect(0.25, 0.0, 0.5, getOr(props, "height", 1));
}

function renderMovingPlatform(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(127, 127, 127)";
  ctx.fillRect(0, 0, 1, 1);
}

function renderLaserEmitter(ctx, props) {
  const orient = getOr(props, "orient", Orient.UP);

  if (props.hasOwnProperty("end")) {
    const startTable = {
      [Orient.UP]: new Vec(0.5, 0.0),
      [Orient.RIGHT]: new Vec(0.0, 0.5),
      [Orient.DOWN]: new Vec(0.5, 1.0),
      [Orient.LEFT]: new Vec(1.0, 0.5)
    };

    const endTable = {
      [Orient.UP]: new Vec(0.5, 1.0),
      [Orient.RIGHT]: new Vec(1.0, 0.5),
      [Orient.DOWN]: new Vec(0.5, 0.0),
      [Orient.LEFT]: new Vec(0.0, 0.5)
    };

    const scale = new Vec(32, 32);
    let start = getOr(props, "start", Vec.ZERO);
    start.add(startTable[orient]);
    start.mul(scale);
    let end = props.end;
    end.add(endTable[orient]);
    end.mul(scale);
    
    ctx.scale(1.0 / scale.x, 1.0 / scale.y);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.stroke();
    ctx.scale(scale.x, scale.y);
  }

  orientTransform(ctx, orient);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(1, 0);
  ctx.lineTo(0.5, 1);
  ctx.closePath();
  ctx.fillStyle = "rgb(63, 63, 63)";
  ctx.fill();
}

function renderLaserDetector(ctx, props) {
  orientTransform(ctx, getOr(props, "orient", Orient.UP));
  ctx.beginPath();
  ctx.fillStyle = "rgb(63, 63, 63)";
  ctx.fillRect(0, 0, 1, 0.25);
}

function renderText(ctx, props) {
  ctx.beginPath();
  ctx.font = getOr(props, "font size", 32) + "px Arial";
  ctx.textAlign = "center";
  ctx.textBaseLine = "middle";
  ctx.direction = "ltr";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.scale(0.03, -0.03);
  ctx.fillText(getOr(props, "text", ""), 0, 0);
}