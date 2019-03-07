import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AnimationHelper } from '../_utilities/animation.helper';

enum Player {
  x,
  o
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  // Conf options
  readonly width = parseInt(`${window.innerWidth * 0.8}`, 10);
  readonly height = parseInt(`${window.innerWidth * 0.8}`, 10);
  readonly lineWidth = 4;
  // Assume Square Matrix
  readonly matrixRows = 3;
  readonly blockWidth = ((this.width - (2 * (this.matrixRows - 1))) / this.matrixRows);

  private readonly _animationHelper = new AnimationHelper();

  private _turnCount = 0;
  private _canDraw = false;
  private _turnMatrix = new Array(this.matrixRows).fill(null).map(() => new Array(this.matrixRows).fill(null));

  constructor() { }

  ngAfterViewInit() {
    this._initCanvas();
  }

  async _initCanvas() {

    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    canvas.setAttribute('width', `${this.width}px`);
    canvas.setAttribute('height', `${this.height}px`);

    context.lineWidth = this.lineWidth;

    this._animationHelper.setContext(context);
    await this._animationHelper.setTexture('/assets/images/chalk-texture.png');

    /**
     * Draw Grid
     */
    this._lockDraw();
    await this._drawGrid();
    this._unlockDraw();

  }

  private async _drawGrid() {
    /**
     * DRAW GRID LINES
     * First Draw Horizontal Lines
     * Then Vertical Lines
     */
    for (let i = 1; i < this.matrixRows; i++) {
      const _xOffset = this.blockWidth * i + (this.lineWidth * (i - 1));
      await this._animationHelper.animateLine({ x: _xOffset, y: 0 }, { x: _xOffset, y: this.height }, 20);
    }

    for (let i = 1; i < this.matrixRows; i++) {
      const _yOffset = this.blockWidth * i + (this.lineWidth * (i - 1));
      await this._animationHelper.animateLine({ x: 0, y: _yOffset }, { x: this.width, y: _yOffset }, 20);
    }

    return;
  }

  private async _drawCrossKnotAtGridPos(i: number, j: number) {

    if (this._turnMatrix[i][j] != null) {
      return;
    }

    const blockPadding = 16;
    const radius = Math.ceil((this.blockWidth - blockPadding * 2) / 2);
    const blockPaddingFactor = Math.ceil(blockPadding / 2);
    const lineWidthI = i ? this.lineWidth : 0;
    const lineWidthJ = j ? this.lineWidth : 0;

    const delError = blockPadding / 2;

    const coords: Coords = {
      x: (i * (this.blockWidth + lineWidthI)) + radius + blockPaddingFactor + delError,
      y: (j * (this.blockWidth + lineWidthJ)) + radius + blockPaddingFactor + delError
    };

    this._lockDraw();
    if (this._turnCount % 2 === 0) {
      await this._animationHelper.animateCircle(coords.x, coords.y, radius);
      this._turnMatrix[i][j] = Player.o;
    } else {
      await this._animationHelper.animateCross(coords.x, coords.y, radius, 5);
      this._turnMatrix[i][j] = Player.x;
    }
    this._unlockDraw();

    this._turnCount++;

  }

  private _drawCrossKnotGetGridPos(coords: Coords) {

    for (let i = 0; i < this.matrixRows; i++) {
      if (this._xInRange(i, coords.x)) {
        for (let j = 0; j < this.matrixRows; j++) {
          if (this._yInRange(j, coords.y)) {
            console.log('The i, j', i, j);
            return this._drawCrossKnotAtGridPos(i, j);
          }
        }
      }
    }
  }

  private _xInRange(i: number, x: number) {
    const lineWidth = i ? this.lineWidth : 0;
    return ((x > (i * this.blockWidth + lineWidth)) && x < ((i + 1) * this.blockWidth));
  }

  private _yInRange(j: number, y: number) {
    const lineWidth = j ? this.lineWidth : 0;
    return ((y > (j * this.blockWidth + lineWidth)) && y < ((j + 1) * this.blockWidth));
  }

  tap(event: MouseEvent) {

    if (!this._canDraw) {
      return;
    }

    const canvas = this.canvas.nativeElement;

    const relativeCoords: Coords = {
      x: event.clientX - canvas.offsetLeft,
      y: event.clientY - canvas.offsetTop
    };

    this._drawCrossKnotGetGridPos(relativeCoords);

  }

  private _lockDraw() {
    this._canDraw = false;
  }

  private _unlockDraw() {
    this._canDraw = true;
  }



}
