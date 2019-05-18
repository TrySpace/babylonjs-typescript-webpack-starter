import 'babylonjs-materials';
import 'babylonjs-loaders';
import CANNON = require('cannon');
import { RenderCanvas } from './RenderCanvas';
import { SceneInstance } from './SceneInstance';
import { Camera } from './Camera';
import { Game } from './Game';
import { World } from './World';
import { RenderLoop } from './RenderLoop';
import { Shark } from './Shark';
import { DebugToggle } from './DebugToggle';
import { DefaultPlane, SimpleSphere } from './Meshes';
import { Light } from './utils';

window.addEventListener('DOMContentLoaded', () => {
  // Set global variable for cannonjs physics engine
  window.CANNON = CANNON;

  // Top
  new classOne('renderCanvas');
  new classOne('renderCanvas2');


  // Bottom
  new classTwo('renderCanvas3');
  new classThree('renderCanvas4');
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
  constructor (canvasId, groundTransparent = true, sky = true) {
    let renderCanvas = new RenderCanvas(canvasId);
    let renderScene = new SceneInstance(renderCanvas);
    new Camera(renderScene, 3);

    // Fill world
    let world = new World(renderScene, groundTransparent, sky);

    // Add Objects
    let object = new Shark(renderScene, world.waterMaterial.defaultWaterMaterial.material);

    // Gui
    let gui = new DebugToggle(renderScene, object.swimming, () => {
      object.swimming.next(!object.swimming.getValue());
    });

    // Render bottom
    new RenderLoop(renderScene, () => {
      gui.updateCoordinateTexture(object.firstVertex);
    });
  }
}


class classThree {
  constructor (canvasId, groundTransparent = true, sky = true) {
    let renderCanvas = new RenderCanvas(canvasId);
    let renderScene = new SceneInstance(renderCanvas);

    new Camera(renderScene, 3);

    let plane = new DefaultPlane(renderScene.scene, {
      height: 10,
      width: 10
    }, true);

    let lightPosition = new BABYLON.Vector3(0, 5, -5);
    let light = new Light(renderScene.scene, lightPosition);

    // Fill world
    // let world = new World(renderScene, groundTransparent, sky);

    // Add Objects
    // let object = new Shark(renderScene, world.waterMaterial.defaultWaterMaterial.material);
    //
    // // Gui
    // let gui = new DebugToggle(renderScene, object.swimming, () => {
    //   object.swimming.next(!object.swimming.getValue());
    // });

    // Render bottom
    new RenderLoop(renderScene, () => {
      // gui.updateCoordinateTexture(object.firstVertex);
    });
  }
}
