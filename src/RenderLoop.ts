import { SceneInstance } from './SceneInstance';

export class RenderLoop {

  public sceneInstance: SceneInstance;
  public renderCallback: () => any;

  constructor(sceneInstance: SceneInstance, renderCallback?: () => any) {
    this.sceneInstance = sceneInstance;
    this.renderCallback = renderCallback;
    this.animate();
  }

  /**
   * Starts the animation loop.
   */
  animate(): void {
      // run the render loop
      this.sceneInstance.renderCanvas.engine.runRenderLoop(() => {
          this.sceneInstance.scene.render();
          if (this.renderCallback) {
            this.renderCallback();
          }
      });

      // the canvas/window resize event handler
      window.addEventListener('resize', () => {
          this.sceneInstance.renderCanvas.engine.resize();
      });
  }
}
