import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

export class Dancer {
  constructor(x, y, z, scene) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.model = null;
    this.mixer = null;
    this.animationActions = [];
    this.activeAction = null;
    this.lastAction = null;
    this.scene = scene;
    this.ready = false;
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
      console.log("THESE ACTIONS ARE DIFFERENT", toAction, this.activeAction);
      this.lastAction = this.activeAction;
      this.activeAction = toAction;
      this.lastAction.fadeOut(0.1);
      this.activeAction.reset();
      this.activeAction.fadeIn(0.1);
      this.activeAction.play();
    }
  }

  updatePosition(x, y, z) {
    this.model.position.x = x;
    this.model.position.y = y;
    this.model.position.z = z;
  }

  updateRotation(x, y, z) {
    this.model.rotation.x = x;
    this.model.rotation.y = y;
    this.model.rotation.z = z;
  }

  togglePauseAnimation(index, value) {
    this.animationActions[index].pause = value;
  }

  update(delta) {
    this.mixer.update(delta);
  }
}
