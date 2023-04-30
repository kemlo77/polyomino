import { Polyomino } from './Polyomino';

export class View {

    private width: number;
    private height: number;
    private cellWidth: number = 3;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.height = this._canvas.offsetHeight;
        this.width = this._canvas.offsetWidth;
        this._ctx = this._canvas.getContext('2d');
    }



    decreaseCellSize(): void {
        if (this.cellWidth > 1) {
            this.cellWidth -= 3;
        }
    }

    increaseCellSize(): void {
        if (this.cellWidth < 40) {
            this.cellWidth += 3;
        }
    }

    drawPolyomino(polyominos: Polyomino<number>[]): void {
        const vitKant: number = 0.5;
        let offset_x: number = this.cellWidth;
        let offset_y: number = this.cellWidth;
        //max h�jd f�r aktuel rad. Anv�nds f�r att ekonomisera utrymmet
        let maxShapeHeight: number = 0;



        // tar omr�det som kan ritas ut p�

        if (!this._canvas.getContext) {
            return;
        }


        this._ctx.clearRect(0, 0, this.width, this.height);
        this._ctx.fillStyle = 'rgba(170,170,170,1)';
        this._ctx.save();
        this._ctx.translate(offset_x, offset_y);

        //f�r alla shapes (att rita ut)
        for (let z: number = 0; z < polyominos.length; z++) {
            const formen = polyominos[z].matrix;
            this._ctx.fillStyle = this.getFillStyle(polyominos[z].symmetryNumber);


            //ritar ut 
            for (let i: number = 0; i < formen.length; i++) {
                //sparar max antal kvadrater p� h�jden
                if (formen.length > maxShapeHeight) { maxShapeHeight = formen.length; }
                //ritar ut alla bitar
                for (let j: number = 0; j < formen[0].length; j++) {
                    if (formen[i][j] > 0) {
                        this._ctx.fillRect(
                            j * this.cellWidth,
                            i * this.cellWidth,
                            this.cellWidth - vitKant,
                            this.cellWidth - vitKant);
                    }
                }

            }
            //om bredden �r n�dd till h�ger. s� ska det bli en ny rad
            offset_x += (formen[0].length + 1) * this.cellWidth;
            if (offset_x > this.width - (formen[0].length + 1) * this.cellWidth) {
                offset_x = this.cellWidth;
                offset_y += (maxShapeHeight + 1) * this.cellWidth;
                maxShapeHeight = 0;

            }
            //}

            this._ctx.restore();
            this._ctx.save();
            this._ctx.translate(offset_x, offset_y);
        }
        this._ctx.restore();

    }

    private getFillStyle(symmetryNumber: number): string {
        switch (symmetryNumber) {
            case 0:
                return 'rgba(170,170,170,1)';
            case 1:
            case 2:
                return 'rgba(221,153,153,1)';
            case 4:
            case 8:
                return 'rgba(170,221,170,1)';
            case 16:
                return 'rgba(170,170,221,1)';
            case 19:
                return 'rgba(204,170,204,1)';
            case 28:
                return 'rgba(255,153,119,1)';
            case 48:
                return 'rgba(255,204,102,1)';
            case 63:
                return 'rgba(136,204,204,1)';
            default:
                return 'rgba(0,0,255,1)';
        }
    }
}