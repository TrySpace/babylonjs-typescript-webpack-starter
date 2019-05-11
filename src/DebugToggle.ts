import { GameUtils } from './game-utils';
import { Shark } from './Shark';
import * as GUI from 'babylonjs-gui';
import { SceneInstance } from './SceneInstance';

export class DebugToggle {

  // private _shark: Shark;
  private _txtCoordinates: { txtX: GUI.TextBlock, txtY: GUI.TextBlock, txtZ: GUI.TextBlock } = null;
  private _guiTexture: GUI.AdvancedDynamicTexture;
  private bool: boolean;

  constructor (sceneInstance: SceneInstance, bool: boolean, boolAction: () => void) {
    // this._shark = shark;
    this.bool = bool;

    // create new gui
    this._guiTexture = GameUtils.createGUI(sceneInstance);

    // Button to start shark animation
    GameUtils.createButtonSwim(this._guiTexture, "Start Swimming",
        (btn) => {
            let textControl = btn.children[0] as GUI.TextBlock;
            // this._shark.swimming = !this._shark.swimming;
            boolAction();
            if (this.bool) {
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
