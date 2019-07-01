import { Coords } from '../app.interfaces';

export class AnimationHelper {
    _context: CanvasRenderingContext2D = null;
    _texture: CanvasPattern = null;

    constructor() { }

    setContext(ctx: CanvasRenderingContext2D) {
        this._context = ctx;
    }

    setTexture(imgUrl: string): Promise<void> {

        if (!this._context) {
            throw { message: 'Context is Undefined' };
        }

        const _img = document.createElement('img');
        _img.setAttribute('style.display', 'none');

        document.body.appendChild(_img);

        _img.setAttribute('src', imgUrl);

        return new Promise((resolve, reject) => {
            console.log(_img);
            _img.onload = () => {
                this._texture = this._context.createPattern(_img, 'repeat');
                resolve();
            };
        });

    }

    animateCircle(x: number, y: number, radius: number, speed: number = 0.25, lineWidth?: number): Promise<void> {
        if (this._texture) {
            this._context.strokeStyle = <any>this._texture;
        }

        if (lineWidth) {
            this._context.lineWidth = lineWidth;
        }

        this._context.beginPath();

        let from = -Math.PI / 4;
        let to = (-Math.PI / 4) + speed;

        return new Promise((resolve) => {
            const animate = () => {
                this._context.arc(x, y, radius, from, to);
                this._context.stroke();

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

    async animateCross(x: number, y: number, radius: number, lineWidth?: number): Promise<void> {
        if (lineWidth) {
            this._context.lineWidth = lineWidth;
        }
        await this.animateLine({ x: x - radius, y: y - radius }, { x: x + radius, y: y + radius });
        await this.animateLine({ x: x + radius, y: y - radius }, { x: x - radius, y: y + radius });
        return;
    }

    animateLine(initial: Coords, final: Coords, speed: number = 5, lineWidth?: number): Promise<void> {
        if (this._texture) {
            this._context.strokeStyle = <any>this._texture;
        }

        if (lineWidth) {
            this._context.lineWidth = lineWidth;
        }

        this._context.beginPath();
        this._context.moveTo(initial.x, initial.y);

        let x = initial.x;
        let y = initial.y;

        const isXPositive = initial.x < final.x;
        const isYPositive = initial.y < final.y;

        return new Promise((resolve) => {
            const animate = () => {

                if ((isXPositive && x < final.x) || (!isXPositive && x > final.x) ||
                    (isYPositive && y < final.y) || (!isYPositive && y > final.y)) {
                    // console.log('Doing Animation');
                    if (isXPositive) {
                        x = (x < final.x) ? x += speed : x;
                    } else {
                        x = (x > final.x) ? x -= speed : x;
                    }

                    if (isYPositive) {
                        y = (y < final.y) ? y += speed : y;
                    } else {
                        y = (y > final.y) ? y -= speed : y;
                    }

                    this._context.lineTo(x, y);
                    this._context.stroke();
                    this._context.moveTo(x, y);

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
