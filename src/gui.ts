import * as GUI from 'babylonjs-gui';

/**
 * Creates a GUI Texture
 * @param scene
 */
export class GUITexture {
  public texture: GUI.AdvancedDynamicTexture;

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
