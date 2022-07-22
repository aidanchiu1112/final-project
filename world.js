"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

let clicks = {};
let types = {};
let inv = [];

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  types = {};
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 32;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let countClicks = 0;

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  console.log(i, j);
}

function p3_drawTile(i, j) {

  
  noStroke();
  let n = clicks[[i, j]] | 0;
  let type = [i, j];

  if (i%100 == 0 && j%100 == 0) {
    types[type] = "f"
    for (let x = i; x < i+20; x++) {
      for (let y = j; y < j+20; y++) {
        generateForest(x, y, 1);
      }
    }
  }

  if ((types[[i-1, j]] == "f" && types[[i+1, j]] == "f") || (types[[i, j - 1]] == "f" && types[[i, j + 1]] == "f")) {
    types[type] = "f"
  }

  if (types[type] != "f") {
    if (noise(i, j) > 0.6 && types[type] != "f") {
      types[type] = "d"
  
      let topleft = 10;
      let topright = 10;
      let bottomright = 10;
      let bottomleft = 10;
  
      if (types[[i, j-1]] == "d") {
        //up
        topleft = 0;
        topright = 0;
      }
      if (types[[i+1, j]] == "d") {
        //right
        topright = 0;
        bottomright = 0;
      }
      if (types[[i, j+1]] == "d") {
        //down
        bottomright = 0;
        bottomleft = 0;
      }
      if (types[[i-1, j]] == "d") {
        //left;
        topleft = 0;
        bottomleft = 0;
      }
      noStroke()
      fill("#557d30")
      rect(0, 0, tw, tw)
      fill("#936843")
      beginShape();
      square(0, 0, tw, topleft, topright, bottomright, bottomleft)
      endShape(CLOSE);
      pop();
      push();
    }
    else if (noise(i, j) > 0.599 && noise(i, j) < 0.6) {
      randomSeed(i*j)
      var r = Math.round(random()*255)
      var g = Math.round(random()*255)
      var b = Math.round(random()*255)
      fill("#557d30")

  
      noStroke()
      beginShape();
      vertex(0, 0);
      vertex(0, tw);
      vertex(th, tw);
      vertex(th, 0);
      endShape(CLOSE)
      
      noStroke()
      fill("#f7daa1")
      rect(0, -32+16+8, 32, 64)

      //chimney
      fill (r-40, g-40, b-40)
      rect(32/2+7, -32-32+8, 8, 40)

      //roof
      fill(r, g, b)
      triangle(32/2, -32-32, 0, -32+16+8, 32, -32+16+8)
      
      fill("#a43c08")
      rect(32/2-5, -32+16+16, 10, 42)
      fill("#b2beec")
      stroke("#ffffff")
      rect(32/2-5-5-5+1, -32+16+16, 8, 20)
      rect(32/2+5+1, -32+16+16, 8, 20)
      
    }
    else {
      fill("#557d30")
      push();
  
    noStroke()
    beginShape();
    vertex(0, 0);
    vertex(0, tw);
    vertex(th, tw);
    vertex(th, 0);
    endShape(CLOSE);
    
    pop();
    }
    if (noise(i, j) < 0.1) {
      if (noise(i, j)*10 > 0.93) {
        noStroke()
        fill("#FAD8B0")
        rect(8, 4-32, 18, 18)
        fill("#1ce240")
        rect(8, 22-32, 18, 22)
        fill("#1B56BD")
        rect(8, 44-32, 6, 16)
        rect(20, 44-32, 6, 16)
        fill("#000000")
        rect(8, 4-32, 18, 4)
        fill("#000000")
        rect(11, 10-32, 4, 4)
        rect(19, 10-32, 4, 4)
        types[type] = "npc_one"
      }
      else {
        noStroke()
        fill("#FAD8B0")
        rect(8, 4-32, 18, 18)
        fill("#dbe21c")
        rect(8, 22-32, 18, 22)
        fill("#1B56BD")
        rect(8, 44-32, 6, 16)
        rect(20, 44-32, 6, 16)
        fill("#000000")
        rect(8, 4-32, 18, 4)
        fill("#000000")
        rect(11, 10-32, 4, 4)
        rect(19, 10-32, 4, 4)
        types[type] = "npc_two"
      }
    }
  }
  else {
      
      let topleft = 10;
      let topright = 10;
      let bottomright = 10;
      let bottomleft = 10;
  
      if (types[[i, j-1]] == "f") {
        //up
        topleft = 0;
        topright = 0;
      }
      if (types[[i+1, j]] == "f") {
        //right
        topright = 0;
        bottomright = 0;
      }
      if (types[[i, j+1]] == "f") {
        //down
        bottomright = 0;
        bottomleft = 0;
      }
      if (types[[i-1, j]] == "f") {
        //left;
        topleft = 0;
        bottomleft = 0;
      }
    
      noStroke()
      fill("#557d30")
      rect(0, 0, tw, tw)
      fill("#496B2A")
      beginShape();
      square(0, 0, tw, topleft, topright, bottomright, bottomleft)
      endShape(CLOSE);
      if (noise(i, j) > 0.65) {
        noStroke()
      fill("#2A3D18")
      triangle(16, 4-32, 10, 8+16-32, 22, 8+16-32)
      triangle(16, 8+16-32, 8, 14+24-32, 24, 14+24-32)
      triangle(16, 14+24-32, 6, 20+32-32, 26, 20+32-32)
      fill("#643B2C")
      rect(14, 20+32-32, 4, 10+32-32)
      }
      if (noise(i, j) < 0.2 && n == 0) {
        if (noise(i, j) < 0.13) {
          noStroke()
         fill("#4C4644")
          rect(0, 32-10-10, 10, 14)
        fill("#837773")
  rect(10, 8, 32-4-4, 32-8-8)
  rect(8, 4, 32-8-8, 32-4-4)
  fill("#A79893")
  rect(8, 8, 32-8-8, 8)
          
        }
        else {
          noStroke()
          fill("#643b2c")
          rect(4, 8, 32-4-4, 32-8-8)
          rect(8, 4, 32-8-8, 32-4-4)
          fill("#966655")
          rect(8, 8, 32-8-8, 32-8-8)
          fill("#643b2c")
          rect(10, 10, 32-10-10, 32-10-10)
          fill("#966655")
          rect(12, 12, 32-12-12, 32-12-12)
        }
      }
      if (noise(i, j) < 0.2 && n == 1) {
        countClicks += 1;
        let key = [i, j];
        clicks[key] = 1 + (clicks[key] | 0);
        if (noise(i, j) < 0.13) {
          types[key] = "stone"
        }
        else {
          types[key] = "wood"
        }
      }
      pop();
      push();
  }
}

var one = ["wood", "wood", "stone"]
var two = ["gold", "gold", "wood", "wood"]

function npc(i, j) {
  fill("#ffffff")
  rect(0, 0-64-32, 32+32+32+32, 64)

  if (noise(i, j)*10 > 0.93) {
    fill("#000000")
    text("Hello good sir!", 4, 0-64-20)
    fill("#000000")
    text("I'll give you one gold", 4, 0-64-8+8)
    text("if you'd get me two", 4, 0-64-8+12+8)
    text("wood and one stone!", 4, 0-64-8+12+12+8)
    let woodCount = 0;
    let stoneCount = 0;
    for (var i = 0; i < inv.length; i++) {
      if (inv[i] == "wood") woodCount++;
      if (inv[i] == "stone") stoneCount++;
    }
    if (woodCount >= 2 && stoneCount >= 1) {
      woodCount = 2;
      stoneCount = 1;
      let newInv = [...inv]
      for (var i = 0; i < newInv.length; i++) {
        if (inv[i] == "wood" && woodCount != 0) {
          inv.splice(i, 1)
          woodCount--;
          i--;
        }
        if (inv[i] == "stone" && stoneCount != 0) {
          inv.splice(i, 1)
          stoneCount--;
          i--;
        }
      }
      inv.push("gold")
    }
  }
  else {
    fill("#000000")
    text("What is up yo?", 4, 0-64-20)
    fill("#000000")
    text("I want two gold and", 4, 0-64-8+8)
    text("two wood pieces.", 4, 0-64-8+12+8)
    text("One diamond in return.", 4, 0-64-8+12+12+8)
    let woodCount = 0;
    let goldCount = 0;
    for (var i = 0; i < inv.length; i++) {
      if (inv[i] == "wood") woodCount++;
      if (inv[i] == "gold") goldCount++;
    }
    if (woodCount >= 2 && goldCount >= 2) {
      woodCount = 2;
      goldCount = 2;
      let newInv = [...inv]
      for (var i = 0; i < newInv.length; i++) {
        if (inv[i] == "wood" && woodCount != 0) {
          inv.splice(i, 1)
          woodCount--;
          i--;
        }
        if (inv[i] == "gold" && goldCount != 0) {
          inv.splice(i, 1)
          goldCount--;
          i--;
        }
      }
      inv.push("diamond")
    }
  }
}

let animation = 0;

function drawTree(i, j) {
  
}

function generateForest(i, j, num) {
  if (num != 0){
    if (noise(i, j) > 0.75) {
      //up
      j++;
    }
    else if (noise(i, j) > 0.5) {
      //right
      i++;
    }
    else if (noise(i, j) > 0.25) {
      //down
      j--;
    }
    else {
      //left;
      i--;
    }
    types[[i, j]] = "f"
    generateForest(i, j, num-1)
  }
}

function countInventory() {
  var diamond = 0;
  var gold = 0;
  var wood = 0;
  var stone = 0;
  for (var i = 0; i < inv.length; i++) {
    if (inv[i] == "diamond") diamond++;
    if (inv[i] == "gold") gold++;
    if (inv[i] == "wood") wood++;
    if (inv[i] == "stone") stone++;
  }
  inventory.html("Diamond: " + diamond + "\tGold: " + gold + "\tWood: " + wood + "\tStone: " + stone);
}



function p3_drawSelectedTile(i, j) {
  countInventory()
  score.html(i + " " + j)
  let key = [i, j];
  if (types[key] == "wood") inv.push("wood")
  if (types[key] == "stone") inv.push("stone")
  if (types[key] == "npc_one") npc(i, j)
  if (types[key] == "npc_two") npc(i, j)
  if (clicks[key] != 0) clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawAfter() {}
