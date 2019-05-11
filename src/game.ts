import { RenderCanvas } from './RenderCanvas';
import { RenderScene } from './RenderScene';
import { Camera } from './camera';
import { World } from './world';

export class Game {

    private renderCanvas: RenderCanvas;
    private camera: Camera;

    public renderScene: RenderScene;
    public world: World;

    constructor(canvasElement: string) {
        // Create canvas and engine
        this.renderCanvas = new RenderCanvas(canvasElement);
    }

    /**
     * Creates a BABYLONJS Scene, camera and world
     */
    createScene(): void {
        this.renderScene = new RenderScene(this.renderCanvas);
        this.camera = new Camera(this.renderScene, 1);
        this.world = new World(this.renderScene, true, true);
    }

}
