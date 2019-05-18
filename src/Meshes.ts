import * as BABYLON from 'babylonjs';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MeshFromOBJ } from "./utils";
import { DefaultWaterMaterial } from "./Materials";
import { HWSize } from "./common.types";

export class SimpleSphere {

  public mesh: BABYLON.Mesh;

  constructor (scene: BABYLON.Scene, diameter: number, diameterX: number) {
    // Mesh
    this.mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter, diameterX}, scene);
  }
}


/**
 * Creates a basic ground
 * @param scene
 * @param size
 */
export class DefaultPlane {

  public mesh: BABYLON.Mesh;

  constructor (scene: BABYLON.Scene, size: HWSize, doubleside: boolean) {
    // Mesh
    this.mesh = BABYLON.MeshBuilder.CreatePlane("plane", {
      width: size.width,
      height: size.height,
      sideOrientation: doubleside ? BABYLON.Mesh.DOUBLESIDE : 0,
      updatable: false
    }, scene);

    this.mesh.position.y = -1;
  }
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
 * Creates a new default skybox
 * @param scene
 */
export class DefaultSkybox {

  public mesh: BABYLON.Mesh;

  constructor (scene: BABYLON.Scene) {
    this.mesh = new CreateSkybox(scene, "skybox", "./assets/texture/skybox/TropicalSunnyDay").mesh;
  }
}

/**
 * Creates a new skybox with the picttures under fileName.
 * @param scene
 * @param name
 * @param fileName
 */
export class CreateSkybox {

  public mesh: BABYLON.Mesh;
  private material: BABYLON.StandardMaterial;

  constructor (scene: BABYLON.Scene, name: string, fileName: string) {
    if (!scene) {
        console.error("DefaultSkybox: scene is not defined");
        return;
    }
    if (!name) {
        console.error("DefaultSkybox: name is not defined");
        return;
    }
    if (!fileName) {
        console.error("DefaultSkybox: fileName is not defined");
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
* Loads a shark model from .obj file and adds it scene.
* @param scene
*/
export class SharkMesh {

  mesh: Observable<BABYLON.AbstractMesh>;

  private rootMesh: BABYLON.Mesh;
  private sharkMesh: MeshFromOBJ;

  constructor (scene: BABYLON.Scene) {
    this.rootMesh = BABYLON.MeshBuilder.CreateBox("rootMesh", {size: 1}, scene);
    this.rootMesh.isVisible = false;
    this.rootMesh.position = new BABYLON.Vector3(0, 0.4, 0);
    this.rootMesh.rotation.y = -3 * Math.PI / 4;

    this.sharkMesh = new MeshFromOBJ("mesh/", "mesh.obj", scene, new BABYLON.Vector3(1, 1, 1));
  }

  getObservableMesh () {
    return this.sharkMesh.getObservableMesh().pipe(
     map(meshes => {
         meshes.forEach((mesh) => {
             mesh.parent = this.rootMesh;
         });
         return this.rootMesh;
     })
    );
  }
}
