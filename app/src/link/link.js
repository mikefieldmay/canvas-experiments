import LinkSprites from "../../assets/linksprites.png";

const DIRECTION = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

const directionValues = {
  up: {
    x: 0,
    y: -3,
    spriteRowOne: 0,
    spriteRowTwo: 4
  },
  down: {
    x: 0,
    y: 3,
    spriteRowOne: 2,
    spriteRowTwo: 6
  },
  left: {
    x: -3,
    y: 0,
    spriteRowOne: 3,
    spriteRowTwo: 7
  },
  right: {
    x: 3,
    y: 0,
    spriteRowOne: 1,
    spriteRowTwo: 5
  }
};

export class Link {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.img = new Image();
    this.hasImageLoaded = false;
    this.spriteWidth = 24;
    this.spriteHeight = 32;
    this.row = 0;
    this.column = 0;
    this.scale = 2;
    this.x = (canvas.width - this.spriteWidth * this.scale) / 2;
    this.y = canvas.height - this.spriteHeight * this.scale;
    this.vx = 0;
    this.vy = 0;
    this.currentDirection = null;
  }

  loadImage() {
    this.img.src = LinkSprites;
    this.img.onload = () => {
      this.hasImageLoaded = true;
    };
  }

  incrementXandY(x, y) {
    this.x = this.x + x;
    this.y = this.y + y;
  }

  checkBoundaries() {
    if (this.y <= 0) {
      this.y = 0;
    }
    if (this.y + this.spriteHeight * this.scale >= this.canvas.height) {
      this.y = this.canvas.height - this.spriteHeight * this.scale;
    }
    if (this.x + this.spriteWidth * this.scale >= this.canvas.width) {
      this.x = this.canvas.width - this.spriteWidth * this.scale;
    }
    if (this.x <= 0) {
      this.x = 0;
    }
  }

  move(direction) {
    const { x, y, spriteRowOne, spriteRowTwo } = directionValues[direction];
    this.incrementXandY(x, y);
    this.checkBoundaries();
    if (this.currentDirection !== direction) {
      this.row = spriteRowOne;
      this.currentDirection = direction;
    }
    console.log(this.column);
    this.column++;
    if (this.column === 12) {
      this.column = 0;
      this.row = this.row === spriteRowTwo ? spriteRowOne : spriteRowTwo;
    }
  }

  drawCell() {
    this.context.drawImage(
      this.img,
      this.spriteWidth * this.column,
      this.spriteHeight * this.row,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth * this.scale,
      this.spriteHeight * this.scale
    );
  }
}
