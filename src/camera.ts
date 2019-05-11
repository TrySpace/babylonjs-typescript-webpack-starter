import * as BABYLON from 'babylonjs';
import { SceneInstance } from './SceneInstance';

export class Camera {
  private _camera: BABYLON.ArcRotateCamera;
  public sceneInstance: SceneInstance;

  constructor(sceneInstance: SceneInstance, nr: number) {
    this.sceneInstance = sceneInstance;
    this._camera = new BABYLON.ArcRotateCamera(`Camera-${nr}`, 3 * Math.PI / 2, Math.PI / 2.5, 30, BABYLON.Vector3.Zero(), this.sceneInstance.scene);
    this._camera.attachControl(this.sceneInstance.renderCanvas.canvas, true);
  }
}
