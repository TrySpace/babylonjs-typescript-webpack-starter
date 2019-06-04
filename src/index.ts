import 'babylonjs-materials';
import 'babylonjs-loaders';
import CANNON = require('cannon');
import { RenderCanvas } from './RenderCanvas';
import { SceneInstance } from './SceneInstance';
import { Camera } from './Camera';
import { Game } from './Game';
import { World, World2 } from './World';
import { RenderLoop } from './RenderLoop';
import { Shark } from './Shark';
import { DebugToggle } from './DebugToggle';
import { DefaultPlane, Box, BoxGrid } from './Meshes';
import { Light } from './utils';
import { Mars } from './Mars';

window.addEventListener('DOMContentLoaded', () => {
  // Set global variable for cannonjs physics engine
  window.CANNON = CANNON;

  // Top
  new classOne('renderCanvas');
  new classTwo('renderCanvas2', false, true);


  // Bottom
  new classThree('renderCanvas3');
  new classFour('renderCanvas4');
});


class classOne {
  constructor (canvasId: string) {
    let game = new Game(canvasId);
    game.createScene();

    let object = new Shark(game.sceneInstance, game.world.waterMaterial.defaultWaterMaterial.material);

    let gui = new DebugToggle(game.sceneInstance, object.swimming, () => {
      object.swimming.next(!object.swimming.getValue());
      if (!object.swimming.getValue()) {
        object.sharkAnimationTime = 0;
      }
    });

    new RenderLoop(game.sceneInstance, () => {
      gui.updateCoordinateTexture(object.firstVertex);
    });
  }
}

class classTwo {
  constructor (canvasId: string, groundTransparent = true, sky = true) {
    let renderCanvas = new RenderCanvas(canvasId);
    let renderScene = new SceneInstance(renderCanvas);
    new Camera(renderScene, 3);

    // Fill world
    let world = new World2(renderScene, groundTransparent, sky);

    // Add Objects
    // let object = new Mars(renderScene);

    let obj = new BoxGrid(renderScene.scene, {height: 100, width: 100}, 0.1);


   // Render bottom
    new RenderLoop(renderScene, () => { });
  }
}


class classThree {
  constructor (canvasId: string) {
    let renderCanvas = new RenderCanvas(canvasId);
    let renderScene = new SceneInstance(renderCanvas);

    new Camera(renderScene, 3);

    let plane = new DefaultPlane(renderScene.scene, {
      height: 10,
      width: 10
    }, true);

    plane.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, (90 * Math.PI) / 180, 0);

    let lightPosition = new BABYLON.Vector3(0, 5, 0);
    new Light(renderScene.scene, lightPosition);

    // Render bottom
    new RenderLoop(renderScene);
  }
}

class classFour {
  constructor (canvasId: string) {
    let renderCanvas = new RenderCanvas(canvasId);
    let renderScene = new SceneInstance(renderCanvas);

    new Camera(renderScene, 3);

    let plane = new DefaultPlane(renderScene.scene, {
      height: 30,
      width: 30
    }, true);

    plane.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, (90 * Math.PI) / 180, 0);

    let lightPosition = new BABYLON.Vector3(15, 10, 15);
    new Light(renderScene.scene, lightPosition);

    // Render bottom
    new RenderLoop(renderScene);
  }
}
