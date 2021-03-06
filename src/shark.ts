import { AbstractMesh, WaterMaterial } from "babylonjs";
import { SceneInstance } from './SceneInstance';
import { BehaviorSubject } from 'rxjs';
import { SharkMesh } from "./Meshes";

export class Shark {

  private _sharkMesh: AbstractMesh;
  private _waterMaterial: WaterMaterial;

  public swimming: BehaviorSubject<boolean>;
  public sharkAnimationTime = 0;
  public firstVertex: any;

  constructor (sceneInstance: SceneInstance, waterMaterial: WaterMaterial) {
    this.swimming = new BehaviorSubject(false);
    sceneInstance.scene.registerBeforeRender(() => {
        let deltaTime: number = (1 / sceneInstance.renderCanvas.engine.getFps());
        this.debugFirstMeshCoordinate(this._sharkMesh as BABYLON.Mesh);
        this.animateShark(deltaTime);
    });
    this._waterMaterial = waterMaterial;
    this.createTheShark(sceneInstance);
  }

  createTheShark (sceneInstance: SceneInstance) {
    // create a shark mesh from an obj file
    new SharkMesh(sceneInstance.scene).getObservableMesh()
        .subscribe(sharkMesh => {
            this._sharkMesh = sharkMesh;
            this._sharkMesh.getChildren().forEach(
                mesh => {
                    this._waterMaterial.addToRenderList(mesh);
                }
            );
        });
  }

  animateShark(deltaTime: number): void {
    // console.log(this.swimming.getValue());
      if (this._sharkMesh && this.swimming.getValue()) {
          this.sharkAnimationTime += 0.01;
          this._sharkMesh.getChildren().forEach(
              mesh => {
                  let realMesh = <BABYLON.Mesh> mesh;
                  let vertexData = BABYLON.VertexData.ExtractFromMesh(realMesh);
                  let positions = vertexData.positions;
                  let numberOfPoints = positions.length / 3;
                  for (let i = 0; i < numberOfPoints; i++) {
                      let vertex = new BABYLON.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                      vertex.x += (Math.sin(0.15 * vertex.z + this.sharkAnimationTime * 4 - 1.6) * 0.05);
                      positions[i * 3] = vertex.x;

                  }
                  vertexData.applyToMesh(mesh as BABYLON.Mesh);
              }
          );
      }
  }

  /**
   * Sets the coordinates of the first vertex of mesh
   */
  public debugFirstMeshCoordinate(mesh: BABYLON.Mesh) {
      if(!mesh || !mesh.getChildren()) {
          return;
      }
      let firstMesh = (mesh.getChildren()[0] as BABYLON.Mesh)
      let vertexData = BABYLON.VertexData.ExtractFromMesh(firstMesh);
      let positions = vertexData.positions;
      this.firstVertex = new BABYLON.Vector3(positions[0], positions[1], positions[3]);
  }

}
