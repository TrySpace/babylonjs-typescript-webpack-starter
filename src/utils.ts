import * as BABYLON from 'babylonjs';
import { Observable } from 'rxjs';
import { SimpleSphere } from './Meshes';


export class Light {

  public light: BABYLON.HemisphericLight;
  private mesh: BABYLON.Mesh;

  constructor (scene: BABYLON.Scene, position: BABYLON.Vector3, show?: boolean) {
    this.light = new BABYLON.HemisphericLight('light', position, scene);
    this.mesh = new SimpleSphere(scene, 1, 1).mesh;
    this.mesh.setPositionWithLocalVector(position);
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
          console.log(this.mesh);
          observer.next(meshes);
          observer.complete();
        });
    });

    return this.mesh;
  }

}
