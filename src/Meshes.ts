import * as BABYLON from 'babylonjs';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MeshFromOBJ } from "./utils";
import { DefaultWaterMaterial } from "./Materials";
import { HWSize } from "./common.types";


export class Box {

  public mesh: BABYLON.Mesh;

  constructor (scene?: BABYLON.Scene, size: HWSize = { height: 1, width: 1, depth: 1 }) {
    this.mesh = BABYLON.MeshBuilder.CreateBox("box", {
      height: size.height,
      width: size.width,
      depth: size.depth,
      updatable: false
    }, scene);
  }
}


export class BoxGrid {

  constructor (scene: BABYLON.Scene, size: HWSize, spacing: number = 0) {
    let boxMesh = new Box(scene, {height: 0.9, width: 0.9, depth: 0.9});

    // Mat
    let mat = new BABYLON.StandardMaterial('mat', scene);
    mat.diffuseColor = new BABYLON.Color3(1 / 10, 0, 1 / 10);
    // mat.diffuseTexture.hasAlpha = true;
    mat.backFaceCulling = true;
    // mat.wireframe = true;
    boxMesh.mesh.material = mat;
    // boxMesh.mesh.checkCollisions = true;

    // Set dimensions
    let x = size.height;
    let y = size.width;

    for (let yit = 0; yit < y; yit++) {

      for (let xit = 0; xit < x; xit++) {
        // Position obj
        let obj = boxMesh.mesh.createInstance('boxInst'+xit+yit)

        // console.log((x/2)*-1+xit);
        // obj.position.x = (x/2)*-1+xit;
        // obj.position.z = (y/2)*-1+yit;

        let pos = new BABYLON.Vector3( (x/2)*-1+xit, 0,  (y/2)*-1+yit);
        obj.setPositionWithLocalVector(pos);
        obj.checkCollisions = true;


      }
    }

  }
}

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

/**
* Loads a shark model from .obj file and adds it scene.
* @param scene
*/
export class MarsMesh {

  mesh: Observable<BABYLON.AbstractMesh>;

  private rootMesh: BABYLON.Mesh;
  private sharkMesh: MeshFromOBJ;
  private material: BABYLON.StandardMaterial;

  constructor (scene: BABYLON.Scene) {
    this.rootMesh = BABYLON.MeshBuilder.CreateBox("rootMesh", {size: 1}, scene);
    this.rootMesh.isVisible = false;
    this.rootMesh.position = new BABYLON.Vector3(0, 0, 0);
    // this.rootMesh.rotation.y = -3 * Math.PI / 4;

    this.material = new BABYLON.StandardMaterial('mars', scene);
    this.material.diffuseTexture = new BABYLON.Texture("./assets/mesh/Mars/Diffuse.png", scene)
    this.material.diffuseTexture.coordinatesMode = BABYLON.Texture.EQUIRECTANGULAR_MODE;
    // this.material.diffuseTexture.hasAlpha = true;


    this.sharkMesh = new MeshFromOBJ("mesh/", "Mars.obj", scene, new BABYLON.Vector3(1, 1, 1));
  }

  getObservableMesh () {
    return this.sharkMesh.getObservableMesh().pipe(
     map(meshes => {
         meshes.forEach((mesh) => {
             mesh.parent = this.rootMesh;
             mesh.material = this.material;
         });
         return this.rootMesh;
     })
    );
  }
}
