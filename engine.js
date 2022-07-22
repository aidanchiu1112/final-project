"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

let tile_height;
let tile_width;
let tile_columns;
let tile_rows;
let camera_velocity;
let camera_offset;
let inventory;
let label;
let score;

function setup() {
  camera_offset = new p5.Vector(0, 0);
  camera_velocity = new p5.Vector(0, 0);

  let canvas = createCanvas(800, 400);
  canvas.parent("container");

  if (window.p3_setup) {
    window.p3_setup();
  }
  
  inventory = createP();
  label = createP();
  score = createP();
  inventory.parent("container");
  label.parent("container");
  score.parent("container");

  rebuildWorld("cm147");
}

function rebuildWorld(key) {
  if (window.p3_worldKeyChanged) {
    window.p3_worldKeyChanged(key);
  }

  tile_width = window.p3_tileWidth ? window.p3_tileWidth() : 32;
  tile_height = window.p3_tileHeight ? window.p3_tileHeight() : 32;
  tile_columns = Math.ceil(width / tile_width);
  tile_rows = Math.ceil(height / tile_height);
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width);
  let world_y = camera_y / (tile_height);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function draw() {
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity.x -= 0.7;
    orientation = "l"
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity.x += 0.7;
    orientation = "r"
  }
  if (keyIsDown(DOWN_ARROW)) {
    camera_velocity.y += 0.7;
    orientation = "d"
  }
  if (keyIsDown(UP_ARROW)) {
    camera_velocity.y -= 0.7;
    orientation = "u"
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.85); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }

  let world_pos = screenToWorld(
    [391, 184],
    [camera_offset.x, camera_offset.y]
  );
  let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

  background(0);

  if (window.p3_drawBefore) {
    window.p3_drawBefore();
  }

  for (let y = 0; y < tile_rows; y++) {
    for (let x = 0; x < tile_columns; x++) {
      drawTile([x + world_offset.x, y + world_offset.y], [
        camera_offset.x,
        camera_offset.y
      ]);
    }
  }

  describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

  if (window.p3_drawAfter) {
    window.p3_drawAfter();
  }

  let i = 391
  let j = 184

  if (orientation == "u") {
    noStroke()
    fill("#FAD8B0")
    rect(8+i, 4+j, 18, 18)
    fill("#e2281c")
    rect(8+i, 22+j, 18, 22)
    fill("#1B56BD")
    rect(8+i, 44+j, 6, 16)
    rect(20+i, 44+j, 6, 16)
    fill("#000000")
    rect(8+i, 4+j, 18, 8)
  }
  else if (orientation == "l") {
    noStroke()
    fill("#FAD8B0")
    rect(8+i, 4+j, 18, 18)
    fill("#e2281c")
    rect(8+i, 22+j, 18, 22)
    fill("#1B56BD")
    rect(8+i, 44+j, 6, 16)
    rect(20+i, 44+j, 6, 16)
    fill("#000000")
    rect(8+i, 4+j, 18, 4)
    fill("#000000")
    rect(8+i, 10+j, 4, 4)
  }
  else if ((orientation == "r")) {
    noStroke()
    fill("#FAD8B0")
    rect(8+i, 4+j, 18, 18)
    fill("#e2281c")
    rect(8+i, 22+j, 18, 22)
    fill("#1B56BD")
    rect(8+i, 44+j, 6, 16)
    rect(20+i, 44+j, 6, 16)
    fill("#000000")
    rect(8+i, 4+j, 18, 4)
    fill("#000000")
    rect(22+i, 10+j, 4, 4)
  }
  else {
    noStroke()
    fill("#FAD8B0")
    rect(8+i, 4+j, 18, 18)
    fill("#e2281c")
    rect(8+i, 22+j, 18, 22)
    fill("#1B56BD")
    rect(8+i, 44+j, 6, 16)
    rect(20+i, 44+j, 6, 16)
    fill("#000000")
    rect(8+i, 4+j, 18, 4)
    fill("#000000")
    rect(11+i, 10+j, 4, 4)
    rect(19+i, 10+j, 4, 4)
  }
}

let orientation = "d"

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x += camera_x;
  screen_y += camera_y;
  screen_x /= tile_width;
  screen_y /= tile_height;
  return [Math.round(screen_x), Math.round(screen_y)];
}

// Display a discription of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
  if (window.p3_drawSelectedTile) {
    push()
    translate(world_x * tile_width - camera_x, world_y * tile_height - camera_y);
    window.p3_drawSelectedTile(world_x, world_y, camera_x, camera_y);
    pop()
  }
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  push();
  translate(screen_x, screen_y);
  if (window.p3_drawSelectedTile) {
    window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  push();
  translate(world_x * tile_width - camera_x, world_y * tile_height - camera_y);
  if (window.p3_drawTile) {
    window.p3_drawTile(world_x, world_y);
  }
  pop();
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  if (window.p3_tileClicked) {
    window.p3_tileClicked(world_pos[0], world_pos[1]);
  }
  return false;
}