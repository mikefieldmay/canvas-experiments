import { Link } from "./link";
import field from "../../assets/field.png";

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const STATIONARY = 4;

const fieldImg = new Image();
let hasImageLoaded = false;
fieldImg.src = field;

fieldImg.onload = () => {
  hasImageLoaded = true;
};

export const init = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 704;
  canvas.height = 640;
  // canvas.style.height = "640px";
  // canvas.style.width = "704px";
  canvas.style.margin = "0 auto";
  canvas.style.display = "block";
  canvas.style.border = "1px solid black";
  const wrapper = document.getElementById("canvas-wrapper");
  wrapper.appendChild(canvas);

  console.log(canvas.width);

  const context = canvas.getContext("2d");
  const link = new Link(canvas);
  link.loadImage();
  let keysPressed = [];

  const loopAnimations = () => {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowUp") {
        if (keysPressed.includes(UP)) {
          return;
        }
        keysPressed.unshift(UP);
      }
      if (event.code === "ArrowDown") {
        if (keysPressed.includes(DOWN)) {
          return;
        }
        keysPressed.unshift(DOWN);
      }
      if (event.code === "ArrowLeft") {
        if (keysPressed.includes(LEFT)) {
          return;
        }
        keysPressed.unshift(LEFT);
      }
      if (event.code === "ArrowRight") {
        if (keysPressed.includes(RIGHT)) {
          return;
        }
        keysPressed.unshift(RIGHT);
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.code === "ArrowUp") {
        keysPressed = keysPressed.filter((key) => key !== UP);
      }
      if (event.code === "ArrowDown") {
        keysPressed = keysPressed.filter((key) => key !== DOWN);
      }
      if (event.code === "ArrowLeft") {
        keysPressed = keysPressed.filter((key) => key !== LEFT);
      }
      if (event.code === "ArrowRight") {
        keysPressed = keysPressed.filter((key) => key !== RIGHT);
      }
    });
    // Clear
    context.clearRect(0, 0, canvas.width, canvas.height);

    const key = keysPressed[0];
    switch (key) {
      case UP:
        link.move("up");
        break;
      case DOWN:
        link.move("down");
        break;
      case LEFT:
        link.move("left");
        break;
      case RIGHT:
        link.move("right");
        break;
    }
    if (hasImageLoaded) {
      context.drawImage(fieldImg, 0, 0);
      context.drawImage(fieldImg, 0, 320);
    }
    link.drawCell();

    // Draw

    window.requestAnimationFrame(loopAnimations);
  };

  window.requestAnimationFrame(loopAnimations);
};
