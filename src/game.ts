import { RenderCanvas } from './RenderCanvas';
import { SceneInstance } from './SceneInstance';
import { Camera } from './camera';
import { World } from './World';

export class Game {

    private renderCanvas: RenderCanvas;
    private camera: Camera;

    public sceneInstance: SceneInstance;
    public world: World;

    constructor(canvasElement: string) {
        // Create canvas and engine
        this.renderCanvas = new RenderCanvas(canvasElement);
    }

    /**
     * Creates a BABYLONJS Scene, camera and world
     */
    createScene(): void {
        this.sceneInstance = new SceneInstance(this.renderCanvas);
        this.camera = new Camera(this.sceneInstance, 1);
        this.world = new World(this.sceneInstance, true, true);
    }

}
