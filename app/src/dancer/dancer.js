import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

export class Dancer {
  constructor(x, y, z, scene) {
    console.log("I HAVE BEEN CALLED");
    this.x = x;
    this.y = y;
    this.z = z;
    this.model = null;
    this.mixer = null;
    this.animationActions = [];
    this.activeAction = null;
    this.activeActionIndex = 0;
    this.lastAction = null;
    this.scene = scene;
    this.ready = false;
    this.status = undefined;

    this.loadModel();
  }

  async loadGltfModel(src) {
    return new Promise((resolve) => {
      gltfLoader.load(src, (gltf) => resolve(gltf));
    });
  }

  async loadModel() {
    const gltf = await this.loadGltfModel("public/girl.glb");
    gltf.scene.scale.set(1.5, 1.5, 1.5);
    this.model = gltf.scene;
    this.mixer = new THREE.AnimationMixer(this.model);
    const animationAction = this.mixer.clipAction(gltf.animations[0]);
    this.animationActions.push(animationAction);
    this.activeAction = this.animationActions[0];
    this.scene.add(gltf.scene);
    this.model.position.set(this.x, this.y, this.z);
    this.model.rotation.set(0, 0, 0);
    await this.loadDances();
  }

  async loadDances() {
    const run = await this.loadGltfModel("public/goofy-run.glb");
    console.log("one");
    run.animations[0].tracks.shift();
    const runAnimation = this.mixer.clipAction(run.animations[0]);
    this.animationActions.push(runAnimation);

    const dance = await this.loadGltfModel("public/dance.glb");
    const danceAnimation = this.mixer.clipAction(dance.animations[0]);
    this.animationActions.push(danceAnimation);
    console.log("two");

    const idle = await this.loadGltfModel("public/idle.glb");
    const idleAnimation = this.mixer.clipAction(idle.animations[0]);
    this.animationActions.push(idleAnimation);

    this.animationActions[3].play();
    this.setAction(this.animationActions[3]);
    this.ready = true;
  }

  setAction(toAction) {
    if (toAction != this.activeAction) {
      this.activeActionIndex = this.animationActions.indexOf(toAction);
      this.lastAction = this.activeAction;
      this.activeAction = toAction;
      this.lastAction.fadeOut(0.5);
      this.activeAction.reset();
      this.activeAction.fadeIn(0.5);
      this.activeAction.play();
    }
  }

  updatePosition(x, y, z) {
    console.log(x, y, z);
    this.model.position.set(x, y, z);
  }

  updateRotation(x, y, z) {
    this.model.rotation.set(x, y, z);
  }

  togglePauseAnimation(index, value) {
    this.animationActions[index].pause = value;
  }

  update(delta) {
    this.mixer.update(delta);
  }

  moveCharacter(direction) {
    const moveDistance = 0.05;
    switch (direction) {
      case "UP":
        this.updatePosition(
          this.model.position.x,
          this.model.position.y,
          (this.model.position.z += moveDistance)
        );
        this.updateRotation(0, 0, 0);
        this.togglePauseAnimation(1, false);
        this.setAction(this.animationActions[1]);
        break;
      case "DOWN":
        this.updatePosition(
          this.model.position.x,
          this.model.position.y,
          (this.model.position.z -= moveDistance)
        );
        this.updateRotation(0, THREE.Math.degToRad(180), 0);
        this.togglePauseAnimation(1, false);
        this.setAction(this.animationActions[1]);
        break;
      case "LEFT":
        this.updatePosition(
          (this.model.position.x += moveDistance),
          this.model.position.y,
          this.model.position.z
        );
        this.updateRotation(0, THREE.Math.degToRad(90), 0);
        this.togglePauseAnimation(1, false);
        this.setAction(this.animationActions[1]);
        break;
      case "RIGHT":
        this.updatePosition(
          (this.model.position.x -= moveDistance),
          this.model.position.y,
          this.model.position.z
        );
        this.updateRotation(0, THREE.Math.degToRad(270), 0);
        this.togglePauseAnimation(1, false);
        this.setAction(this.animationActions[1]);
        break;
      case "DANCE":
        this.updateRotation(0, THREE.Math.degToRad(180), 0);
        this.setAction(this.animationActions[2]);
        break;
      default:
        this.togglePauseAnimation(1, true);
        this.setAction(this.animationActions[3]);

        break;
    }
  }
}
