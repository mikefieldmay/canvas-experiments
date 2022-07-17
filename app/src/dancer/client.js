import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { io } from "socket.io-client";

import "../../css/disco.css";

import { Dancer } from "./dancer";
// import { GUI } from "three/examples/jsm/libs/dat.gui.module";

export const init = () => {
  console.log("HERE");
  const scene = new THREE.Scene();

  // scene.add(new THREE.AxesHelper(5))

  // w

  let light = new THREE.DirectionalLight(0xffffff, 1);
  console.log(light.rotation);
  // light.position.set(0, 400, 0);

  const spotlight = new THREE.SpotLight(0xffffff, 1);
  spotlight.position.set(0, 4, 0);
  spotlight.rotation.set((2 * Math.PI) / 180, 0, 0);
  spotlight.castShadow = true;
  spotlight.shadowCameraVisible = true;

  scene.add(spotlight);
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(70, 800 / 600, 0.01, 100);

  camera.position.set(0, 4, -8);

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
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
  let pressed = {};
  var dir = new THREE.Vector3();
  let myId = "";
  let timestamp = 0;
  const clientDancers = {};
  const socket = io();

  console.log(dancer);

  const sceneMeshes = [];

  socket.on("connect", function () {
    console.log("connect");
  });
  socket.on("disconnect", function (message) {
    console.log("disconnect " + message);
  });
  socket.on("id", (id) => {
    clientDancers[id] = dancer;
    clientDancers[id].name = id;
    myId = id;
    setInterval(() => {
      socket.emit("update", {
        t: Date.now(),
        p: dancer.ready ? dancer.model.position : undefined,
        r: dancer.ready ? dancer.model.rotation : undefined,
        i: dancer.activeActionIndex
      });
    }, 1);
  });
  socket.on("clients", (clients) => {
    let pingStatsHtml = "Socket Ping Stats<br/><br/>";
    Object.keys(clients).forEach((p) => {
      timestamp = Date.now();
      pingStatsHtml += p + " " + (timestamp - clients[p].t) + "ms<br/>";
      if (!clientDancers[p]) {
        clientDancers[p] = new Dancer(0, 0, 0.5, scene);
        clientDancers[p].name = p;
      }
      if (clientDancers[p].name !== myId && clientDancers[p].ready) {
        console.log(
          "this is from the other client",
          clientDancers[p].model.position,
          clients[p]
        );
      }

      const readyToMove =
        clientDancers[p].name !== myId &&
        clientDancers[p].ready &&
        clients[p].position &&
        clients[p].rotation;

      if (readyToMove) {
        var delta = clock.getDelta();
        clientDancers[p].update(delta);

        clientDancers[p].updatePosition(
          clients[p].position.x,
          clients[p].position.y,
          clients[p].position.z
        );
        clientDancers[p].updateRotation(
          clients[p].rotation._x,
          clients[p].rotation._y,
          clients[p].rotation._z
        );
        clientDancers[p].setAction(
          clientDancers[p].animationActions[clients[p].animationIndex]
        );
        // render();
      }
      // renderer.render(scene, camera);
    });
    document.getElementById("pingStats").innerHTML = pingStatsHtml;
  });
  socket.on("removeClient", (id) => {
    scene.remove(scene.getObjectByName(id));
  });

  gltfLoader.load("public/disco_rematerial.glb", (gltf) => {
    console.log(gltf);
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        // node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
    // const planeGeometry = new THREE.PlaneGeometry(10, 10);
    // const texture = new THREE.TextureLoader().load("public/grid.png");
    // const material = new THREE.MeshPhongMaterial({ map: texture });

    // const plane = new THREE.Mesh(planeGeometry, material);
    // plane.receiveShadow = true;
    // plane.castShadow = true;

    // plane.rotateX(-Math.PI / 2);
    // plane.receiveShadow = true
    // plane.position.set(0, 0, 4)
    // scene.add(plane);
    // sceneMeshes.push(plane);
  });

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

    if (dancer.ready) {
      var delta = clock.getDelta();
      Object.keys(clientDancers).forEach((key) => {
        clientDancers[key].update(delta);
      });
      // clientDancers.forEach((dancer) => {
      //   console.log(dancer);
      // });
      // ;(model as any).position.x += 0.001
      var moveDistance = 0.05; // n pixels per second
      // console.log(model.getWorldDirection())

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
      console.log("target", controls.target);
      controls.target = dancer.model.position;
      controls.update();
      // socket.emit("update", {
      //   t: Date.now(),
      //   p: dancer.ready ? dancer.model.position : undefined,
      //   r: dancer.ready ? dancer.model.rotation : undefined,
      //   i: dancer.activeActionIndex
      // });
    }
    render();

    stats.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  animate();
};
