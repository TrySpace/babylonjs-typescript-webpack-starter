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
  public material: BABYLON.WaterMaterial;

  constructor (scene: BABYLON.Scene, size: HWSize) {

    // Material
    this.material = GameUtils.createWaterMaterial("water", "./assets/texture/waterbump.png", scene);

    // Mesh
    this.mesh = BABYLON.MeshBuilder.CreateGround("defaultWater", {
      width: size.width,
      height: size.height,
      subdivisions: 32,
      updatable: false,
    }, scene);

    this.mesh.material = this.material;
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
 * @function btnClicked
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


export class GameUtils {



    public static createVerticalLine(scene: BABYLON.Scene, position: BABYLON.Vector2) {
        //Array of points to construct lines
        var myPoints = [
            new BABYLON.Vector3(position.x, 0, position.y),
            new BABYLON.Vector3(position.x, 100, position.y),
        ];
        //Create lines
        var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);
    }

    /**
     *
     * @param guiTexture
     */
    public static createCoordinatesText(guiTexture: GUI.AdvancedDynamicTexture): { txtX: GUI.TextBlock, txtY: GUI.TextBlock, txtZ: GUI.TextBlock } {
        let txtX = new GUI.TextBlock();
        txtX.height = "20px";
        txtX.width = "500px";
        txtX.fontSize = 20;
        txtX.text = "X: ";
        txtX.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        txtX.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        txtX.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        txtX.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        txtX.left = 20;
        txtX.top = 60;

        let txtY = new GUI.TextBlock();
        txtY.height = "20px";
        txtY.width = "500px";
        txtY.fontSize = 20;
        txtY.text = "Y: ";
        txtY.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        txtY.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        txtY.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        txtY.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        txtY.left = 20;
        txtY.top = 90;

        let txtZ = new GUI.TextBlock();
        txtZ.height = "20px";
        txtZ.width = "500px";
        txtZ.fontSize = 20;
        txtZ.text = "Z: ";
        txtZ.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        txtZ.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        txtZ.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        txtZ.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        txtZ.left = 20;
        txtZ.top = 120;

        guiTexture.addControl(txtX);
        guiTexture.addControl(txtY);
        guiTexture.addControl(txtZ);

        return {
            txtX: txtX,
            txtY: txtY,
            txtZ: txtZ
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
    public static createMeshFromObjFile(folderName: string, fileName: string, scene: BABYLON.Scene,
                                        scaling?: BABYLON.Vector3, position?: BABYLON.Vector3, rotationQuaternion?: BABYLON.Quaternion): Observable<BABYLON.AbstractMesh[]> {

        if (!fileName) {
            return Observable.throw("GameUtils.createMeshFromObjFile: parameter fileName is empty");
        }
        if (!scene) {
            return Observable.throw("GameUtils.createMeshFromObjFile: parameter scene is empty");
        }

        if (!folderName) folderName = "";
        if (!scaling) scaling = BABYLON.Vector3.One();
        if (!position) position = BABYLON.Vector3.Zero();
        if (!rotationQuaternion) rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);

        let assetsFolder = './assets/' + folderName;

        return Observable.create(observer => {
            BABYLON.SceneLoader.ImportMesh(null, assetsFolder, fileName, scene,
                (meshes: BABYLON.AbstractMesh[],
                 particleSystems: BABYLON.ParticleSystem[],
                 skeletons: BABYLON.Skeleton[]) => {
                    meshes.forEach((mesh) => {
                        mesh.position = position;
                        mesh.rotationQuaternion = rotationQuaternion;
                        mesh.scaling = scaling;
                    });
                    console.log("Imported Mesh: " + fileName);
                    observer.next(meshes);
                    observer.complete();
                });
        });
    }

    /**
     * Creates a new skybox with the picttures under fileName.
     * @param name
     * @param fileName
     * @param scene
     */
    public static createSkybox(name: string, fileName: string, scene: BABYLON.Scene): BABYLON.Mesh {
        if (!name) {
            console.error("GameUtils.createSkyBox: name is not defined");
            return;
        }
        if (!fileName) {
            console.error("GameUtils.createSkyBox: fileName is not defined");
            return;
        }
        if (!scene) {
            console.error("GameUtils.createSkyBox: scene is not defined");
            return;
        }

        // Skybox
        let skybox = BABYLON.Mesh.CreateBox(name, 1000.0, scene);
        let skyboxMaterial = new BABYLON.StandardMaterial(name, scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/texture/skybox/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        return skybox;
    }

    /**
     * Creates a new WaterMaterial Object with a given name. The noiseFile descrips the noise in the water,
     * @param name
     * @param noiseFile
     * @param scene
     */
    public static createWaterMaterial(name: string, noiseFile: string, scene: BABYLON.Scene): BABYLON.WaterMaterial {
        if (!name) {
            console.error("GameUtils.createWaterMaterial: name is not defined");
            return;
        }
        if (!noiseFile) {
            console.error("GameUtils.createWaterMaterial: noiseFile is not defined");
            return;
        }
        if (!scene) {
            console.error("GameUtils.createWaterMaterial: scene is not defined");
            return;
        }
        // Water material
        let water = new BABYLON.WaterMaterial(name, scene);
        water.bumpTexture = new BABYLON.Texture(noiseFile, scene);
        // Water properties
        water.windForce = -5;
        water.waveHeight = 0;
        water.windDirection = new BABYLON.Vector2(1, 1);
        water.waterColor = new BABYLON.Color3(0.25, 0.88, 0.82);
        water.colorBlendFactor = 0.3;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;

        return water
    }

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

        return GameUtils.createMeshFromObjFile("mesh/", "mesh.obj", scene, new BABYLON.Vector3(1, 1, 1))
                .pipe(
                    map(meshes => {
                        meshes.forEach((mesh) => {
                            mesh.parent = rootMesh;
                        });
                        return rootMesh;
                    })
                );
    }

}
