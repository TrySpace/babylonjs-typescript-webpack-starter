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
