import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AnimationHelper } from '../_utilities/animation.helper';

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
  readonly lineWidth = 2;
  // Assume Square Matrix
  readonly matrixRows = 3;
  readonly blockWidth = (this.width - (2 * (this.matrixRows - 1))) / this.matrixRows;

  private readonly _animationHelper = new AnimationHelper();

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
    await this._drawGrid();


    // await animationHelper.animateCircle(50, 50, 25);
    // await animationHelper.animateCross(150, 150, 25);
    // await animationHelper.animateCircle(50, 250, 25);

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
  }

  tap(event: MouseEvent) {
    const canvas = this.canvas.nativeElement;

    const canvasRangeStart: Coords = {
      x: canvas.offsetLeft,
      y: canvas.offsetTop
    };

    const canvasRangeEnd: Coords = {
      x: canvas.offsetLeft + this.width,
      y: canvas.offsetTop + this.height
    };

  }


}
