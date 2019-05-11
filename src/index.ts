import { Game } from './game';
import 'babylonjs-materials';
import 'babylonjs-loaders';
import CANNON = require('cannon');
import { RenderCanvas } from './RenderCanvas';
import { SceneInstance } from './SceneInstance';
import { Camera } from './camera';
import { World } from './world';
import { RenderLoop } from './RenderLoop';
import { Shark } from './shark';
import { Gui } from './gui';

window.addEventListener('DOMContentLoaded', () => {
  // Set global variable for cannonjs physics engine
  window.CANNON = CANNON;

  // Top
  let game = new Game('renderCanvas');
  game.createScene();

  let game2 = new Game('renderCanvas2');
  game2.createScene();

  // Add Objects
  let object1 = new Shark(game.sceneInstance, game.world.waterMaterial);
  let object2 = new Shark(game2.sceneInstance, game2.world.waterMaterial);

  // Gui
  let gui = new Gui(object1, game.sceneInstance);
  let gui2 = new Gui(object2, game2.sceneInstance);


  // Render top
  let renderLoop1 = new RenderLoop(game.sceneInstance, () => {
    gui.updateCoordinateTexture(object1.firstVertex);
  });
  let renderLoop2 = new RenderLoop(game2.sceneInstance, () => {
    gui2.updateCoordinateTexture(object2.firstVertex);
  });



  // Bottom
  let renderCanvas3 = new RenderCanvas('renderCanvas3');
  let renderCanvas4 = new RenderCanvas('renderCanvas4');

  let renderScene3 = new SceneInstance(renderCanvas3);
  let renderScene4 = new SceneInstance(renderCanvas4);

  let camera3 = new Camera(renderScene3, 3);
  let camera4 = new Camera(renderScene4, 3);

  // Fill world
  let world3 = new World(renderScene3, true, false);
  let world4 = new World(renderScene4, false, true);


  // Add Objects
  let object3 = new Shark(renderScene3, world3.waterMaterial);
  let object4 = new Shark(renderScene4, world4.waterMaterial);

  // Gui
  let gui3 = new Gui(object3, renderScene3);
  let gui4 = new Gui(object4, renderScene4);

  // Render bottom
  let renderLoop3 = new RenderLoop(renderScene3, () => {
    gui3.updateCoordinateTexture(object3.firstVertex);
  });
  let renderLoop4 = new RenderLoop(renderScene4, () => {
    gui4.updateCoordinateTexture(object4.firstVertex);
  });


});
