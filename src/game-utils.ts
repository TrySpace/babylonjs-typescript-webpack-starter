import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { Observable } from 'rxjs';
import { AdvancedDynamicTexture } from 'babylonjs-gui';


/**
 * Creates a GUI Texture
 * @param scene
 */
export class GUITexture {
  public texture: AdvancedDynamicTexture;

  constructor (scene: BABYLON.Scene) {
    this.texture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI"+Math.random(), true, scene);
  }
}


/**
 * Creates a Button that tells the Shark to swim or not
 * @param guiTexture
 * @param btnText
 * @function onPointerUp
 */
export class OnOffButton {

  private button: GUI.Button;

  constructor(guiTexture: GUI.AdvancedDynamicTexture, btnText: string) {

    this.button = GUI.Button.CreateSimpleButton("OnOffButton", btnText);
    this.button.width = "150px";
    this.button.height = "40px";
    this.button.color = "white";
    this.button.background = "grey";
    this.button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.button.left = 12;
    this.button.top = 12;

    guiTexture.addControl(this.button);
  }

  public onPointerUp (btnClicked: (button: GUI.Button)  => void) {
    this.button.onPointerUpObservable.add(() => {
        if (btnClicked) {
            btnClicked(this.button);
        }
    });
  }
}

/**
 * Creates a Line
 * @param scene
 * @param position
 */
export class DrawLine {
  public lines: BABYLON.LinesMesh;

  constructor (scene: BABYLON.Scene, position: BABYLON.Vector2, length: number, start = 0) {
    // Array of points to construct lines
    let points = [
        new BABYLON.Vector3(position.x, start, position.y),
        new BABYLON.Vector3(position.x, length, position.y),
    ];
    // Create lines
    this.lines = BABYLON.MeshBuilder.CreateLines("lines", {
      points
    }, scene);
  }
}


export interface XYZText { x: GUI.TextBlock, y: GUI.TextBlock, z: GUI.TextBlock };

/**
 *
 * Apply XYZ Text to guiTexture
 * @param guiTexture
 */
export class XYZTextBlock {

  text: XYZText;

  constructor (guiTexture: GUI.AdvancedDynamicTexture) {
    this.text = {
      x: new GUI.TextBlock(),
      y: new GUI.TextBlock(),
      z: new GUI.TextBlock()
    };

    const textHeight = '20px';
    const textWidth = '500px';
    const textLeft = 20;
    const fontSize = 20;

    const horizontalAlignLeft = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    const verticalAlignLeft = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    this.text.x.height = textHeight;
    this.text.y.height = textHeight;
    this.text.z.height = textHeight;

    this.text.x.width = textWidth;
    this.text.y.width = textWidth;
    this.text.z.width = textWidth;

    this.text.x.left = textLeft;
    this.text.y.left = textLeft;
    this.text.z.left = textLeft;

    this.text.x.fontSize = fontSize;
    this.text.y.fontSize = fontSize;
    this.text.z.fontSize = fontSize;

    this.text.x.top = 60;
    this.text.y.top = 90;
    this.text.z.top = 120;

    this.text.x.text = 'X: ';
    this.text.y.text = 'Y: ';
    this.text.z.text = 'Z: ';

    this.text.x.textHorizontalAlignment = horizontalAlignLeft;
    this.text.y.textHorizontalAlignment = horizontalAlignLeft;
    this.text.z.textHorizontalAlignment = horizontalAlignLeft;

    this.text.x.textVerticalAlignment = verticalAlignLeft;
    this.text.y.textVerticalAlignment = verticalAlignLeft;
    this.text.z.textVerticalAlignment = verticalAlignLeft;

    this.text.x.horizontalAlignment = horizontalAlignLeft;
    this.text.y.horizontalAlignment = horizontalAlignLeft;
    this.text.z.horizontalAlignment = horizontalAlignLeft;

    this.text.x.verticalAlignment = verticalAlignLeft;
    this.text.y.verticalAlignment = verticalAlignLeft;
    this.text.z.verticalAlignment = verticalAlignLeft;

    guiTexture.addControl(this.text.x);
    guiTexture.addControl(this.text.y);
    guiTexture.addControl(this.text.z);
  }
}



/**
 * Returns Observable of mesh array, which are loaded from a file.
 * After mesh importing all meshes become given scaling, position and rotation.
 * @param fileName
 * @param scene
 * @param scaling
 * @param position
 * @param rotationQuaternion
 */
export class MeshFromOBJ {

  public mesh: Observable<BABYLON.AbstractMesh[]>
  private assetsFolder: string;
  private fileName: string;
  private scene: BABYLON.Scene;
  private scaling: BABYLON.Vector3;
  private position: BABYLON.Vector3;
  private rotationQuaternion: BABYLON.Quaternion;

  constructor (folderName: string = "", fileName: string, scene: BABYLON.Scene, scaling: BABYLON.Vector3 = BABYLON.Vector3.One(), position: BABYLON.Vector3 = BABYLON.Vector3.Zero(), rotationQuaternion: BABYLON.Quaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0)) {
    this.fileName = fileName;
    this.scene = scene;
    this.scaling = scaling;
    this.position = position;
    this.rotationQuaternion = rotationQuaternion;
    this.assetsFolder = './assets/' + folderName;
  }

  getObservableMesh (): Observable<BABYLON.AbstractMesh[]> {

    if (!this.fileName) {
        return Observable.throw("MeshFromOBJ: parameter fileName is empty");
    }
    if (!this.scene) {
        return Observable.throw("MeshFromOBJ: parameter scene is empty");
    }

    this.mesh = Observable.create(observer => {
      BABYLON.SceneLoader.ImportMesh(
        null,
        this.assetsFolder,
        this.fileName,
        this.scene,
        (
          meshes: BABYLON.AbstractMesh[],
          particleSystems: BABYLON.ParticleSystem[],
          skeletons: BABYLON.Skeleton[]
        ) => {
          meshes.forEach((mesh) => {
            mesh.position = this.position;
            mesh.rotationQuaternion = this.rotationQuaternion;
            mesh.scaling = this.scaling;
          });
          console.log("Imported Mesh: " + this.fileName);
          observer.next(meshes);
          observer.complete();
        });
    });

    return this.mesh;
  }

}
