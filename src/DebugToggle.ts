import { GameUtils } from './game-utils';
import * as GUI from 'babylonjs-gui';
import { SceneInstance } from './SceneInstance';
import { BehaviorSubject } from 'rxjs';

export class DebugToggle {

  // private _shark: Shark;
  private _txtCoordinates: { txtX: GUI.TextBlock, txtY: GUI.TextBlock, txtZ: GUI.TextBlock } = null;
  private _guiTexture: GUI.AdvancedDynamicTexture;
  private bool: BehaviorSubject<boolean>;

  constructor (sceneInstance: SceneInstance, bool: BehaviorSubject<boolean>, boolAction: () => void) {
    this.bool = bool;

    // create new gui
    this._guiTexture = GameUtils.createGUI(sceneInstance);

    // Button to start shark animation
    GameUtils.createButtonSwim(this._guiTexture, "Start Swimming",
        (btn) => {
            let textControl = btn.children[0] as GUI.TextBlock;
            boolAction();
            if (this.bool.getValue()) {
                textControl.text = "Stop Swimming";
            }
            else {
                // this._shark.sharkAnimationTime = 0;
                textControl.text = "Start Swimming";
            }
        });

      // Debug Text for Shark coordinates
    this._txtCoordinates = GameUtils.createCoordinatesText(this._guiTexture);
  }

  /**
   * Prints the given Vector3
   * @param coordinates
   */
  public updateCoordinateTexture(coordinates: BABYLON.Vector3) {
      if(!coordinates) {
          return;
      }
      this._txtCoordinates.txtX.text = "X: " + coordinates.x;
      this._txtCoordinates.txtY.text = "Y: " + coordinates.y;
      this._txtCoordinates.txtZ.text = "Z: " + coordinates.z;
  }
}
