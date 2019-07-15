import * as BABYLON from 'babylonjs';
import { SceneInstance } from './SceneInstance';

export class Camera {
  private sceneInstance: SceneInstance;
  public camera: BABYLON.ArcRotateCamera;

  constructor(sceneInstance: SceneInstance, nr: number) {
    this.sceneInstance = sceneInstance;
    this.camera = new BABYLON.ArcRotateCamera(`Camera-${nr}`, 3 * Math.PI / 2, Math.PI / 2.5, 30, BABYLON.Vector3.Zero(), this.sceneInstance.scene);

    this.camera.attachControl(this.sceneInstance.renderCanvas.canvas, true);
  }
}

export class UniversalCamera {
  private sceneInstance: SceneInstance;
  public camera: BABYLON.UniversalCamera;

  constructor(sceneInstance: SceneInstance, canvas: HTMLCanvasElement) {
    this.sceneInstance = sceneInstance;

    this.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(1, 2, 1), this.sceneInstance.scene);
    this.camera.setTarget(new BABYLON.Vector3(2, 2, 2));

    this.camera.keysUp = [87];
    this.camera.keysDown = [83];
    this.camera.keysLeft = [65];
    this.camera.keysRight = [68];

    this.camera.attachControl(canvas)
  }
}
