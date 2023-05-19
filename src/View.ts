import { Model } from './Model';
import { Observer } from './Observer';
import { Polyomino } from './Polyomino';


export class View implements Observer {

    private _selectElement: HTMLSelectElement;
    private _plusButton: HTMLButtonElement;
    private _minusButton: HTMLButtonElement;
    private _canvasElement: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private cellWidth: number = 20;
    private _model: Model;


    constructor(model: Model) {
        this._canvasElement = document.getElementById('canvas') as HTMLCanvasElement;

        this._selectElement = document.getElementById('generationListan') as HTMLSelectElement;
        this._selectElement.addEventListener('change', () => this.showSelectedSize());

        this._plusButton = document.getElementById('plusButton') as HTMLButtonElement;
        this._plusButton.addEventListener('click', () => this.increaseCellSize());

        this._minusButton = document.getElementById('minusButton') as HTMLButtonElement;
        this._minusButton.addEventListener('click', () => this.decreaseCellSize());

        this._ctx = this._canvasElement.getContext('2d');
        this._model = model;

        this.updateViewWithLargestGeneratedSize();
    }

    get height(): number {
        return this._canvasElement.height;
    }

    get width(): number {
        return this._canvasElement.width;
    }

    update(): void {
        this.updateViewWithLargestGeneratedSize();
    }

    private updateViewWithLargestGeneratedSize(): void {
        const size: number = this._model.getLargestGeneratedSize();
        this.addPolyominoSizeToSelect(size);
        this.drawPolyominosWithSize(size);
    }

    private addPolyominoSizeToSelect(size: number): void {
        const variantsOfSize: number = this._model.getAllPolyominosWithSize(size).length;
        const sizeName: string = this.getNameForPolyominoSize(size);
        const optionText: string =
            `Size ${String(size)} - ${sizeName} (${variantsOfSize} variant${variantsOfSize > 1 ? 's' : ''})`;
        this._selectElement.options[this._selectElement.options.length] =
            new Option(optionText, String(size));
        //select the added value in the list
        this._selectElement.selectedIndex = size - 1;
    }

    private getNameForPolyominoSize(size: number): string {
        const names: string[] = [
            'monomino',
            'domino',
            'tromino',
            'tetromino',
            'pentomino',
            'hexomino',
            'heptomino',
            'octomino',
            'nonomino',
            'decomino',
            'undecomino',
            'dodecomino',
        ];
        if (size > names.length) {
            return size.toString + '-omino?';
        }
        return names[size - 1];
    }

    private showSelectedSize(): void {
        this.drawPolyominosWithSize(this.getSelectedSize());
    }

    private getSelectedSize(): number {
        const selectedSize: string = this._selectElement.options[this._selectElement.selectedIndex].value;
        return Number(selectedSize);
    }


    private drawPolyominosWithSize(size: number): void {
        this.paintPolyominos(this._model.getAllPolyominosWithSize(size));
    }

    private paintPolyominos(polyominos: Polyomino[]): void {
        const cellDistance: number = this.cellWidth;

        let accumulatedOffsetX: number = 0;
        let accumulatedOffsetY: number = cellDistance;
        let currentRowMaxUsedHeight: number = 0;

        this.clearCanvas();

        polyominos.forEach(polyomino => {

            accumulatedOffsetX += cellDistance;

            const polyominoHeight: number = polyomino.matrix.length * this.cellWidth;
            const polyominoWidth: number = polyomino.matrix[0].length * this.cellWidth;

            if (currentRowMaxUsedHeight < polyominoHeight) {
                currentRowMaxUsedHeight = polyominoHeight;
            }

            if (accumulatedOffsetX + polyominoWidth + cellDistance > this.width) {
                accumulatedOffsetX = cellDistance;
                accumulatedOffsetY += currentRowMaxUsedHeight + cellDistance;
                currentRowMaxUsedHeight = 0;
            }

            this.paintPolyomino(polyomino, accumulatedOffsetX, accumulatedOffsetY);
            accumulatedOffsetX += polyominoWidth;
        });
    }

    private paintPolyomino(polyomino: Polyomino, xOffset: number, yOffset: number): void {
        const whiteBorder: number = 0.5;
        const shapeMatrix: boolean[][] = polyomino.matrix;
        this._ctx.fillStyle = this.getFillStyle(polyomino.symmetryNumber);

        for (let rowIndex: number = 0; rowIndex < shapeMatrix.length; rowIndex++) {
            for (let columnIndex: number = 0; columnIndex < shapeMatrix[0].length; columnIndex++) {
                if (shapeMatrix[rowIndex][columnIndex]) {
                    this._ctx.save();
                    this._ctx.translate(xOffset, yOffset);
                    this._ctx.fillRect(
                        this.cellWidth * columnIndex,
                        this.cellWidth * rowIndex,
                        this.cellWidth - whiteBorder,
                        this.cellWidth - whiteBorder
                    );
                    this._ctx.restore();
                }
            }
        }
    }

    private clearCanvas(): void {
        this._ctx.clearRect(0, 0, this.width, this.height);
    }

    private getFillStyle(symmetryNumber: number): string {
        switch (symmetryNumber) {
            case 0: //no symmetry
                return 'rgba(170,170,170,1)'; //gray
            case 1: //reflection symmetry aligned with grid lines
            case 2: //reflection symmetry aligned with grid lines
                return 'rgba(221,153,153,1)'; //pink
            case 4: //reflection symmetry aligned with diagonals
            case 8: //reflection symmetry aligned with diagonals
                return 'rgba(170,221,170,1)'; //green
            case 16: //point symmetry, rotational symmetry of order 2
                return 'rgba(170,170,221,1)'; //blue
            case 19: //two axis of symmetry aligned with grid lines
                return 'rgba(204,170,204,1)'; //purple
            case 28: //two axis of symmetry aligned with diagonals
                return 'rgba(255,153,119,1)'; //orange
            case 48: //rotational symmetry of order 4
                return 'rgba(255,204,102,1)'; //yellow
            case 63: ////four axis of symmetry and rotational symmetry of order 4
                return 'rgba(136,204,204,1)'; //cyan
            default:
                return 'rgba(0,0,255,1)';
        }
    }

    private decreaseCellSize(): void {
        this.cellWidth -= 2;
        if (this.cellWidth < 2) {
            this.cellWidth = 2;
        }
        this.drawPolyominosWithSize(this.getSelectedSize()); //todo: rita den grupp vald idropdown
    }

    private increaseCellSize(): void {
        this.cellWidth += 2;
        if (this.cellWidth > 80) {
            this.cellWidth = 80;
        }
        this.drawPolyominosWithSize(this.getSelectedSize()); //todo: rita den grupp vald idropdown
    }

    public updateBecauseWindowIsResized(): void {
        this._canvasElement.width = window.innerWidth - 32;
        this._canvasElement.height = window.innerHeight - 64;

        this.showSelectedSize();
    }


    public delayedUpdateBecauseWindowIsResized: any =
        this.debounce((): void => this.updateBecauseWindowIsResized(), 500);

    private debounce<F extends Function>(func: F, wait: number): F {
        let timeoutID: number;
        return <any>function (this: any, ...args: any[]) {
            clearTimeout(timeoutID);
            const context: any = this;
            timeoutID = window.setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
}