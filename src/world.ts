import * as BABYLON from 'babylonjs';
import { GameUtils, DefaultGround } from './game-utils';
import { SceneInstance } from './SceneInstance';
import { WaterMaterial } from 'babylonjs';

export class World {
  private _light: BABYLON.Light;

  public sceneInstance: SceneInstance;
  public waterMaterial: WaterMaterial;


  constructor(sceneInstance: SceneInstance, groundOrNot: boolean, sky: boolean) {
      this.sceneInstance = sceneInstance;

      // create a basic light, aiming 0,1,0 - meaning, to the sky
      this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.sceneInstance.scene);

      // creates the sandy ground
      let ground = new DefaultGround(this.sceneInstance.scene, {
        height: 32,
        width: 16
      });

      // creates the watermaterial and adds the relevant nodes to the renderlist
      this.waterMaterial = GameUtils.createWater(this.sceneInstance.scene);

      // create the skybox
      if (sky) {
        let skybox = GameUtils.createSkybox("skybox", "./assets/texture/skybox/TropicalSunnyDay", this.sceneInstance.scene);
        this.waterMaterial.addToRenderList(skybox);
      }

      if (groundOrNot) {
        this.waterMaterial.addToRenderList(ground.mesh)
      }

      // Physics engine also works
      let gravity = new BABYLON.Vector3(0, -0.9, 0);
      this.sceneInstance.scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());

  }

}
