import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";

import { Dancer } from "./dancer";
// import { GUI } from "three/examples/jsm/libs/dat.gui.module";

export const init = () => {
  console.log("HERE");
  const scene = new THREE.Scene();

  // scene.add(new THREE.AxesHelper(5))

  // w

  let light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(70, 800 / 600, 0.01, 100);

  camera.position.set(0, 4, -8);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  let mixer;
  let modelReady = false;
  const animationActions = [];
  let activeAction;
  let lastAction;
  const gltfLoader = new GLTFLoader();
  let dancer = new Dancer(0, 0, -4, scene);
  let dancerTwo = new Dancer(-3, 0, 0.9, scene);
  let pressed = {};
  var dir = new THREE.Vector3();

  const sceneMeshes = [];

  dancer.loadModel();
  dancerTwo.loadModel();

  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const texture = new THREE.TextureLoader().load("public/grid.png");
  const plane = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshPhongMaterial({ map: texture })
  );
  plane.rotateX(-Math.PI / 2);
  // plane.receiveShadow = truew
  // plane.position.set(0, 0, 4)
  scene.add(plane);
  sceneMeshes.push(plane);

  window.addEventListener("resize", onWindowResize, false);
  function onWindowResize() {
    camera.aspect = 800 / 600;
    camera.updateProjectionMatrix();
    renderer.setSize(800, 600);
    render();
  }

  window.addEventListener("keydown", function (e) {
    pressed[e.code] = true;
  });

  window.addEventListener("keyup", function (e) {
    pressed[e.code] = false;
  });

  const stats = Stats();
  document.body.appendChild(stats.dom);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    if (dancer.ready && dancerTwo.ready) {
      var delta = clock.getDelta();
      dancer.update(delta);
      dancerTwo.update(delta);
      // ;(model as any).position.x += 0.001
      // console.log(model)
      var moveDistance = 0.05; // n pixels per second
      // console.log(model.getWorldDirection())
      // console.log(model.rotation.y)

      // move forwards, backwards, left, or right
      switch (true) {
        case pressed["ArrowUp"]:
          dancer.updatePosition(
            dancer.model.position.x,
            dancer.model.position.y,
            (dancer.model.position.z += moveDistance)
          );
          dancer.updateRotation(0, 0, 0);
          dancer.togglePauseAnimation(1, false);
          dancer.setAction(dancer.animationActions[1]);
          break;
        case pressed["ArrowDown"]:
          dancer.updatePosition(
            dancer.model.position.x,
            dancer.model.position.y,
            (dancer.model.position.z -= moveDistance)
          );
          dancer.updateRotation(0, THREE.Math.degToRad(180), 0);
          dancer.togglePauseAnimation(1, false);
          dancer.setAction(dancer.animationActions[1]);
          break;
        case pressed["ArrowLeft"]:
          dancer.updatePosition(
            (dancer.model.position.x += moveDistance),
            dancer.model.position.y,
            dancer.model.position.z
          );
          dancer.updateRotation(0, THREE.Math.degToRad(90), 0);
          dancer.togglePauseAnimation(1, false);
          dancer.setAction(dancer.animationActions[1]);
          break;
        case pressed["ArrowRight"]:
          dancer.updatePosition(
            (dancer.model.position.x -= moveDistance),
            dancer.model.position.y,
            dancer.model.position.z
          );
          dancer.updateRotation(0, THREE.Math.degToRad(270), 0);
          dancer.togglePauseAnimation(1, false);
          dancer.setAction(dancer.animationActions[1]);
          break;
        case pressed["KeyE"]:
          dancer.updateRotation(0, THREE.Math.degToRad(180), 0);
          dancer.setAction(dancer.animationActions[2]);
          break;
        default:
          dancer.togglePauseAnimation(1, true);
          dancer.setAction(dancer.animationActions[3]);

          break;
      }
    }
    render();

    stats.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  animate();
};
