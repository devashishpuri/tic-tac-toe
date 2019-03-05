import { Component, OnInit } from '@angular/core';

interface Coords {
  x: number;
  y: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private _img: Promise<HTMLImageElement>;

  constructor() { }

  ngOnInit() {
    // Return Image as Promise when loaded
    const img = <HTMLImageElement>document.getElementById('texture');
    this._img = new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(img);
      };
    });

    this._initCanvas();
  }

  async _initCanvas() {

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');

    const context = canvas.getContext('2d');

    const width = (window.innerWidth * 0.8);
    const height = (window.innerWidth * 0.8);

    canvas.setAttribute('width', `${width}px`);
    canvas.setAttribute('height', `${height}px`);

    const texture = context.createPattern(await this._img, 'repeat');

    context.fillStyle = texture;
    context.lineWidth = 2;
    // context.rect(0, 0, 100, 100);
    // context.fill();

    await this._animateCircle(context, 50, 50, 25, texture);
    await this._animateCircle(context, 150, 150, 25, texture);
    await this._animateCross(context, 50, 250, 25, texture);
    // this._animateLine(context, texture);
  }

  private _animateCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, texture?: any): Promise<void> {
    if (texture) {
      context.strokeStyle = texture;
    }

    context.beginPath();

    const speed = 0.25;

    let from = -Math.PI / 4;
    let to = (-Math.PI / 4) + speed;

    return new Promise((resolve, reject) => {
      const animate = () => {
        context.arc(x, y, radius, from, to);
        context.stroke();

        if (to >= 2 * Math.PI) {
          resolve();
          return;
        } else {
          from = to;
          to += speed;
          requestAnimationFrame(animate);
        }
      };

      animate();
    });

  }

  private async _animateCross(context: CanvasRenderingContext2D, x: number, y: number, radius: number, texture?: any): Promise<void> {
    await this._animateLine(context, { x: x - radius, y: y - radius }, { x: x + radius, y: y + radius }, texture);
    await this._animateLine(context, { x: x + radius, y: y - radius }, { x: x - radius, y: y + radius }, texture);
    return;
  }

  private _animateLine(context: CanvasRenderingContext2D, initial: Coords, final: Coords, texture?: any): Promise<void> {
    if (texture) {
      context.strokeStyle = texture;
    }

    context.beginPath();
    context.moveTo(initial.x, initial.y);

    const speed = 5;
    let x = initial.x;
    let y = initial.y;

    const isXPositive = initial.x < final.x;
    const isYPositive = initial.y < final.y;

    return new Promise((resolve, reject) => {
      const animate = () => {
        context.lineTo(x, y);
        // context.lineWidth = 4;
        context.stroke();

        context.moveTo(x, y);

        if (x < final.x || y < final.y) {
          if (isXPositive) {
            x = (x <= final.x) ? x += speed : x;
          } else {
            x = (x >= final.x) ? x -= speed : x;
          }

          if (isYPositive) {
            y = (y <= final.y) ? y += speed : y;
          } else {
            y = (y >= final.y) ? y -= speed : y;
          }

          requestAnimationFrame(animate);
        } else {
          resolve();
          return;
        }
      };

      animate();
    });

  }


}
