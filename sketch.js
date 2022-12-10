//GLOBAL VARIABLES
let margin = 10;



let numbers;
let tiles;

function setup() {
  createCanvas(400, 400);
  generateArray();
  for(let i = 0; i < 2; i++) {
    spawn(0.1);
  }
}

function draw() {
  background(205, 193, 180);
  drawLines(margin, color(187, 173, 160));
  updateTiles();
  move(handleControls());
}

function generateArray() {
  let array = []
  for(let i = 0; i < 4; i++) {
    array[i] = new Array(4);
    for (let j = 0; j < 4; j++) {
      array[i][j] = 0;
    }
  }
  numbers = array;
  tiles = new Array(16);
  for(let i = 0; i < 16; i++) {
    tiles[i] = new Tile(i);
  }
}

function drawLines(margin, lines) {
  stroke(lines);
  strokeWeight(margin);
  // border lines
  line(margin / 2, margin / 2, margin / 2, height - margin / 2);
  line(margin / 2, margin / 2, width - margin / 2, margin / 2);
  line(width - margin / 2, height - margin / 2, width - margin / 2, margin / 2);
  line(width - margin / 2, height - margin / 2, margin / 2, height - margin / 2);
  let origin = margin;
  //vertical
  line((width + origin) / 4, 0, (width + origin) / 4, height);
  line(width / 2, 0, width / 2, height);
  line((width - (origin / 3)) / 4 * 3, 0, (width - (origin / 3)) / 4 * 3, height);
  //horizontal
  line(0, (height + origin) / 4, width, (height + origin) / 4);
  line(0, height / 2, width, height / 2);
  line(0, (height - (origin / 3)) / 4 * 3, width, (height - (origin/ 3)) / 4 * 3);
}

function spawn(chance) {
  if(countEmpty() > 0) {
    let randomPosition = floor(random(0, getEmpty().length));
    let randomTile = 4;
    if(random() > chance) {
      randomTile = 2;
    }
    setValue(getEmpty()[randomPosition], randomTile);
  }
}

function countEmpty() {
  let count = 0;
  for(let i = 0; i < 16; i++) {
    if(isEmpty(i)) {
      count++;
    }
  }
  return count;
}

function getEmpty() {
  let output = [];
  for(let i = 0; i < 16; i++) {
    if(isEmpty(i)) {
      output.push(i);
    }
  }
  return output;
}

function isEmpty(index) {
  if(getValue(index) == 0) {
    return true;
  }
  return false;
}

function getValue(index) {
  return numbers[getIndexCoord(index)[0]][getIndexCoord(index)[1]];
}

function setValue(index, value) {
  numbers[(getIndexCoord(index)[0])][getIndexCoord(index)[1]] = value;
}

function getIndexCoord(index) {
  let x = floor(index / 4);
  let y = index % 4;
  return [x, y];
}

function getIndexScreenCoord(index) {
  let x = margin + getIndexCoord(index)[0] * (margin + getSquareSize());
  let y = margin + getIndexCoord(index)[1] * (margin + getSquareSize());
  return [x, y];
}

function getCoordIndex(x, y) {
  return x * 4 + y;
}

function getSquareSize() {
  return(width - (5 * margin)) / 4;
}

function colorTable(value) {
  switch(value) {
    case 2:
      return color(238, 228, 218);
    case 4:
      return color(237, 224, 200);
    case 8:
      return color(242, 177, 121);
    case 16:
      return color(245, 149, 99);
    case 32:
      return color(246, 124, 95);
    case 64:
      return color(246, 94, 59);
    case 128:
      return color(237, 207, 114);
    case 256:
      return color(237, 204, 97);
    case 512:
      return color(237, 200, 80);
    case 1024:
      return color(237, 197, 63);
    case 2048:
      return color(237, 194, 46);
  }
  return 0;
}

function textSizeTable(value) {
  if(value >= 128) {
    return 45 - margin + 10;
  } else if(value >= 1024) {
    return 35 - margin + 10;
  }
  return 55 - margin + 10;
}

function updateTiles() {
  for(let i = 0; i < 16; i++) {
    tiles[i].update();
  }
}

function move(direction) {
  let numbersCheck = new Array(16);
  for(let i = 0; i < 16; i++) {
    numbersCheck[i] = getValue(i);
  }

  let list = [];
  if(direction == 1) {
    for(let i = 0; i < 4; i++) {
      list[i] = new CombineList(getValue(i), getValue(i + 4), getValue(i + 8), getValue(i + 12));
      list[i].combine();
      setValue(i, list[i].getValue(0));
      setValue(i + 4, list[i].getValue(1));
      setValue(i + 8, list[i].getValue(2));
      setValue(i + 12, list[i].getValue(3));
    }
  } else if(direction == 2) {
        for(let i = 0; i < 4; i++) {
      list[i] = new CombineList(getValue(i + 12), getValue(i + 8), getValue(i + 4), getValue(i));
      list[i].combine();
      setValue(i + 12, list[i].getValue(0));
      setValue(i + 8, list[i].getValue(1));
      setValue(i + 4, list[i].getValue(2));
      setValue(i, list[i].getValue(3));
    }
  } else if(direction == 3) {
    for(let i = 0; i < 16; i+= 4) {
      list[i] = new CombineList(getValue(i + 3), getValue(i + 2), getValue(i + 1), getValue(i));
      list[i].combine();
      setValue(i + 3, list[i].getValue(0));
      setValue(i + 2, list[i].getValue(1));
      setValue(i + 1, list[i].getValue(2));
      setValue(i, list[i].getValue(3));
    }
  } else if(direction == 4) {
    for(let i = 0; i < 16; i+= 4) {
      list[i] = new CombineList(getValue(i), getValue(i + 1), getValue(i + 2), getValue(i + 3));
      list[i].combine();
      setValue(i, list[i].getValue(0));
      setValue(i + 1, list[i].getValue(1));
      setValue(i + 2, list[i].getValue(2));
      setValue(i + 3, list[i].getValue(3));
    }
  }
  let numbersCheckBoolean = false;
  for(let i = 0; i < 16; i++) {
    if(getValue(i) != numbersCheck[i]) {
      numbersCheckBoolean = true;
      break
    }
  }
  if(numbersCheckBoolean) {
    spawn(0.1);
  }
}

let outputCheck = 0;
function handleControls() {
  output = control();
  if(output != outputCheck) {
    outputCheck = output;
    return output;
  }
}

function control() {
  if(keyIsDown(UP_ARROW)) {
    return 4;
  } else if(keyIsDown(DOWN_ARROW)) {
    return 3;
  } else if(keyIsDown(LEFT_ARROW)) {
    return 1;
  } else if(keyIsDown(RIGHT_ARROW)) {
    return 2;
  } else return 0;
}

class Tile {
  constructor(index) {
    this.index = index;
    this.color = 0;
    this.value = 0;
  }
  
  update() {
    this.getTileValue();
    this.getColor();
    if(this.value > 0) {
      noStroke();
      fill(this.color);
      square(getIndexScreenCoord(this.index)[0], getIndexScreenCoord(this.index)[1], getSquareSize(), margin);
      this.renderText();
    }
  }
  
  getColor() {
    this.color = colorTable(this.value);
  }
  
  getTileValue() {
    this.value = getValue(this.index);
  }
  
  renderText() {
      if(this.value > 4) {
        fill(249, 246, 242);
      } else {
        fill(119, 110, 101);
      }
    textSize(textSizeTable(this.value));
      text(this.value,getIndexScreenCoord(this.index)[0], getIndexScreenCoord(this.index)[1] + (getSquareSize() - (textSizeTable(this.value))/2));
  }
}

class CombineList {
  constructor(a, b, c, d) {
    this.array = [a, b, c, d];
  }
  
  getValue(index) {
    return this.array[index]
  }
  
  combine() {
    this.removeZeros();
    this.pair();
    this.removeZeros();
  }
  
  removeZeros() {
    for(let i = 0; i < 3; i++) {
      if(this.array[i] == 0) {
        for(let j = i; j < 3; j++) {
          this.array[j] = this.array[j + 1];
          this.array[j + 1] = 0;
        }
      }
    }
  }
   
  pair() {
    for(let i = 0; i < 3; i++) {
      if(this.array[i] == this.array[i + 1]) {
        this.array[i] += this.array[i + 1];
        this.array[i + 1] = 0;
      }
    }
  }
}