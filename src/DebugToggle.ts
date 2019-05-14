import { GUITexture, OnOffButton, XYZTextBlock, XYZText } from './gui';
import * as GUI from 'babylonjs-gui';
import { SceneInstance } from './SceneInstance';
import { BehaviorSubject } from 'rxjs';

export class DebugToggle {

  private txtCoordinates: XYZText = null;
  private guiTexture: GUITexture;
  private bool: BehaviorSubject<boolean>;

  constructor (sceneInstance: SceneInstance, bool: BehaviorSubject<boolean>, boolAction: () => void) {
    this.bool = bool;

    // create new gui
    this.guiTexture = new GUITexture(sceneInstance.scene);

    // Button to start shark animation
    let onOffButton = new OnOffButton(this.guiTexture.texture, "On");

    onOffButton.onPointerUp((btn) => {
        let textControl = btn.children[0] as GUI.TextBlock;
        boolAction();
        if (this.bool.getValue()) {
            textControl.text = "Off";
        }
        else {
            textControl.text = "On";
        }
    });


      // Debug Text for Shark coordinates
    this.txtCoordinates = new XYZTextBlock(this.guiTexture.texture).text;
  }

  /**
   * Prints the given Vector3
   * @param coordinates
   */
  public updateCoordinateTexture(coordinates: BABYLON.Vector3) {
      if(!coordinates) {
          return;
      }
      this.txtCoordinates.x.text = "X: " + coordinates.x;
      this.txtCoordinates.y.text = "Y: " + coordinates.y;
      this.txtCoordinates.z.text = "Z: " + coordinates.z;
  }
}
