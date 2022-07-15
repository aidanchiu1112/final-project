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
      if (noise(i, j) > 0.6) {
        noStroke()
      fill("#2A3D18")
      triangle(16, 4, 9, 8, 23, 8)
      triangle(16, 8, 8, 14, 24, 14)
      triangle(16, 14, 6, 20, 26, 20)
      fill("#643B2C")
      rect(14, 20, 4, 10)
      }
      if (noise(i, j) < 0.1 && n == 0) {
        noStroke()
        fill("#A77D00")
        rect(4, 8, 32-4-4, 32-8-8)
        rect(8, 4, 32-8-8, 32-4-4)
        fill("#FFC107")
        rect(8, 8, 32-8-8, 32-8-8)
      }
      if (noise(i, j) < 0.1 && n == 1) {
        countClicks += 1;
        let key = [i, j];
        clicks[key] = 1 + (clicks[key] | 0);
        label.html("High score: " + countClicks);
      }
      

      pop();
      push();
      

      
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





function p3_drawSelectedTile(i, j) {
  
}

function p3_drawAfter() {}
