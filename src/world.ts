import * as BABYLON from 'babylonjs';
import { GameUtils, DefaultGround, DefaultWater, DrawLine } from './game-utils';
import { SceneInstance } from './SceneInstance';

export class World {
  private _light: BABYLON.Light;

  public sceneInstance: SceneInstance;
  public waterMaterial: DefaultWater;


  constructor(sceneInstance: SceneInstance, groundTransparent: boolean, sky: boolean) {
      this.sceneInstance = sceneInstance;

      // create a basic light, aiming 0,1,0 - meaning, to the sky
      this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.sceneInstance.scene);

      // creates the sandy ground
      let ground = new DefaultGround(this.sceneInstance.scene, {
        height: 16,
        width: 32
      });

      // creates the watermaterial and adds the relevant nodes to the renderlist
      this.waterMaterial = new DefaultWater(this.sceneInstance.scene, {
        height: 32,
        width: 16
      });

      // create the skybox
      if (sky) {
        let skybox = GameUtils.createSkybox("skybox", "./assets/texture/skybox/TropicalSunnyDay", this.sceneInstance.scene);
        this.waterMaterial.material.addToRenderList(skybox);
      }

      if (groundTransparent) {
        this.waterMaterial.material.addToRenderList(ground.mesh)
      }

      // Physics engine also works
      let gravity = new BABYLON.Vector3(0, -0.9, 0);
      this.sceneInstance.scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());

      // Line
      new DrawLine(this.sceneInstance.scene, new BABYLON.Vector2(0, 0), 2, -1);

  }

}
