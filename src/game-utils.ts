import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdvancedDynamicTexture } from 'babylonjs-gui';


interface HWSize {
  height: number;
  width: number;
}

/**
 * Creates a basic ground
 * @param scene
 * @param size
 */
export class DefaultGround {

  private material: BABYLON.StandardMaterial;
  public mesh: BABYLON.Mesh;

  constructor (scene: BABYLON.Scene, size: HWSize) {
    // Material
    this.material = new BABYLON.StandardMaterial("defaultGround", scene);
    this.material.diffuseTexture = new BABYLON.Texture("./assets/texture/ground.jpg", scene);
    //material.diffuseTexture.uScale = material.diffuseTexture.vScale = 4;

    // Mesh
    this.mesh = BABYLON.MeshBuilder.CreateGround("ground", {
      width: size.width,
      height: size.height,
      subdivisions: 32,
      updatable: false
    }, scene);

    this.mesh.position.y = -1;
    this.mesh.material = this.material;
  }
}


/**
 * Creates a watermaterial
 * @param scene
 * @param size
 */
export class DefaultWater {

  private mesh: BABYLON.Mesh;
  public defaultWaterMaterial: DefaultWaterMaterial;

  constructor (scene: BABYLON.Scene, size: HWSize) {

    // Material
    this.defaultWaterMaterial = new DefaultWaterMaterial(scene, "water", "./assets/texture/waterbump.png");

    // Mesh
    this.mesh = BABYLON.MeshBuilder.CreateGround("defaultWater", {
      width: size.width,
      height: size.height,
      subdivisions: 32,
      updatable: false,
    }, scene);

    this.mesh.material = this.defaultWaterMaterial.material;
    this.mesh.position.y = 2;
  }
}


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
        return Observable.throw("GameUtils.createMeshFromObjFile: parameter fileName is empty");
    }
    if (!this.scene) {
        return Observable.throw("GameUtils.createMeshFromObjFile: parameter scene is empty");
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

/**
 * Creates a new skybox with the picttures under fileName.
 * @param scene
 * @param name
 * @param fileName
 */
export class Skybox {

  public mesh: BABYLON.Mesh;
  private material: BABYLON.StandardMaterial;

  constructor (scene: BABYLON.Scene, name: string, fileName: string) {
    if (!scene) {
        console.error("GameUtils.createSkyBox: scene is not defined");
        return;
    }
    if (!name) {
        console.error("GameUtils.createSkyBox: name is not defined");
        return;
    }
    if (!fileName) {
        console.error("GameUtils.createSkyBox: fileName is not defined");
        return;
    }

    this.mesh = BABYLON.Mesh.CreateBox(name, 1000.0, scene);
    this.material = new BABYLON.StandardMaterial(name, scene);
    this.material.backFaceCulling = false;
    this.material.reflectionTexture = new BABYLON.CubeTexture("./assets/texture/skybox/TropicalSunnyDay", scene);
    this.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    this.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.material.specularColor = new BABYLON.Color3(0, 0, 0);
    this.material.disableLighting = true;

    this.mesh.material = this.material;
  }
}


/**
 * Creates a new WaterMaterial Object with a given name. The noiseFile descrips the noise in the water,
 * @param scene
 * @param name
 * @param noiseFile
 */
 export class DefaultWaterMaterial {
   public material: BABYLON.WaterMaterial;

   constructor (scene: BABYLON.Scene, name: string, noiseFile: string) {
     if (!scene) {
         console.error("GameUtils.createWaterMaterial: scene is not defined");
         return;
     }
     if (!name) {
         console.error("GameUtils.createWaterMaterial: name is not defined");
         return;
     }
     if (!noiseFile) {
         console.error("GameUtils.createWaterMaterial: noiseFile is not defined");
         return;
     }

     this.material = new BABYLON.WaterMaterial(name, scene);

     this.material.bumpTexture = new BABYLON.Texture(noiseFile, scene);
     // Water properties
     this.material.windForce = -5;
     this.material.waveHeight = 0;
     this.material.windDirection = new BABYLON.Vector2(1, 1);
     this.material.waterColor = new BABYLON.Color3(0.25, 0.88, 0.82);
     this.material.colorBlendFactor = 0.3;
     this.material.bumpHeight = 0.1;
     this.material.waveLength = 0.1;
   }
 }

export class GameUtils {

    /**
     * Loads a shark model from .obj file and adds it scene.
     * @param scene
     */
    public static createShark(scene: BABYLON.Scene): Observable<BABYLON.AbstractMesh> {
        // create a mesh object with loaded from file
        let rootMesh = BABYLON.MeshBuilder.CreateBox("rootMesh", {size: 1}, scene);
        rootMesh.isVisible = false;
        rootMesh.position = new BABYLON.Vector3(0, 0.4, 0);
        rootMesh.rotation.y = -3 * Math.PI / 4;

        const sharkMesh = new MeshFromOBJ("mesh/", "mesh.obj", scene, new BABYLON.Vector3(1, 1, 1));

        return sharkMesh.getObservableMesh().pipe(
          map(meshes => {
              meshes.forEach((mesh) => {
                  mesh.parent = rootMesh;
              });
              return rootMesh;
          })
      );;
    }

}
