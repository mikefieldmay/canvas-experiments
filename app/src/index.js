import { init as linkInit } from "./link/canvas";
import { init as threeDInit } from "./dancer/client";
import "../css/style.css";

window.onload = async () => {
  linkInit();
  const linkButton = document.getElementById("link");
  linkButton.onclick = () => {
    removeCanvas();
    linkInit();
  };
  const threeDButton = document.getElementById("3d");
  threeDButton.onclick = () => {
    removeCanvas();
    threeDInit();
  };
};

const removeCanvas = () => {
  var canvasses = document.getElementsByTagName("CANVAS");
  console.log(canvasses);
  [...canvasses].forEach((canvas) => {
    console.log(canvas);
    canvas.parentNode.removeChild(canvas);
  });
};
