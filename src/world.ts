import * as BABYLON from 'babylonjs';
import { GameUtils } from './game-utils';
import { RenderScene } from './RenderScene';
import { WaterMaterial } from 'babylonjs';

export class World {
  private _light: BABYLON.Light;

  public renderScene: RenderScene;
  public waterMaterial: WaterMaterial;


  constructor(renderScene: RenderScene, groundOrNot: boolean, sky: boolean) {
      this.renderScene = renderScene;

      // create a basic light, aiming 0,1,0 - meaning, to the sky
      this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.renderScene.scene);

      // creates the sandy ground
      let ground = GameUtils.createGround(this.renderScene.scene);
      // creates the watermaterial and adds the relevant nodes to the renderlist
      this.waterMaterial = GameUtils.createWater(this.renderScene.scene);

      // create the skybox
      if (sky) {
        let skybox = GameUtils.createSkybox("skybox", "./assets/texture/skybox/TropicalSunnyDay", this.renderScene.scene);
        this.waterMaterial.addToRenderList(skybox);
      }

      if (groundOrNot) {
        this.waterMaterial.addToRenderList(ground)
     }

      // Physics engine also works
      let gravity = new BABYLON.Vector3(0, -0.9, 0);
      this.renderScene.scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());

  }

}
