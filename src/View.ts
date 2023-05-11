import { Model } from './Model';
import { Observer } from './Observer';
import { Polyomino } from './Polyomino';


export class View implements Observer {

    private _selectElement: HTMLSelectElement;
    private _plusButton: HTMLButtonElement;
    private _minusButton: HTMLButtonElement;
    private _canvasElement: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private width: number;
    private height: number;
    private cellWidth: number = 20;
    private _model: Model;


    constructor(model: Model) {
        this._canvasElement = document.getElementById('canvas') as HTMLCanvasElement;

        this._selectElement = document.getElementById('generationListan') as HTMLSelectElement;
        this._selectElement.addEventListener('change', () => this.showSelectedSizeGroup());

        this._plusButton = document.getElementById('plusButton') as HTMLButtonElement;
        this._plusButton.addEventListener('click', () => this.increaseCellSize());

        this._minusButton = document.getElementById('minusButton') as HTMLButtonElement;
        this._minusButton.addEventListener('click', () => this.decreaseCellSize());

        this.height = this._canvasElement.offsetHeight;
        this.width = this._canvasElement.offsetWidth;
        this._ctx = this._canvasElement.getContext('2d');
        this._model = model;

        this.updateViewWithLargestGeneratedSizeGroup();
    }

    update(): void {
        this.updateViewWithLargestGeneratedSizeGroup();
    }

    private updateViewWithLargestGeneratedSizeGroup(): void {
        const largestGeneratedSizeGroup: number = this._model.getNumberOfGeneratedSizeGroups();
        this.addPolyominoSizeGroupToSelect(largestGeneratedSizeGroup);
        this.drawPolyominosWithSize(largestGeneratedSizeGroup);
        this.displayPolyominoSizeGroupInfo(largestGeneratedSizeGroup);
    }

    private addPolyominoSizeGroupToSelect(size: number): void {
        const optionText: string = `${this.getNameForGroupWithSize(size)} (size ${String(size)})`;
        this._selectElement.options[this._selectElement.options.length] =
            new Option(optionText, String(size));
        //select the added value in the list
        this._selectElement.selectedIndex = size - 1;
    }

    private getNameForGroupWithSize(size: number): string {
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

    private showSelectedSizeGroup(): void {
        this.drawPolyominosWithSize(this.getSelectedSizeGroup());
        this.displayPolyominoSizeGroupInfo(this.getSelectedSizeGroup());
    }

    private getSelectedSizeGroup(): number {
        const selectedSizeGroup: string = this._selectElement.options[this._selectElement.selectedIndex].value;
        return Number(selectedSizeGroup);
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
                return 'rgba(255,204,102,1)'; //yellow
            case 63:
                return 'rgba(136,204,204,1)';
            default:
                return 'rgba(0,0,255,1)';
        }
    }

    private decreaseCellSize(): void {
        this.cellWidth -= 2;
        if (this.cellWidth < 2) {
            this.cellWidth = 2;
        }
        this.drawPolyominosWithSize(this._model.getNumberOfGeneratedSizeGroups()); //todo: rita den grupp vald idropdown
    }

    private increaseCellSize(): void {
        this.cellWidth += 2;
        if (this.cellWidth > 40) {
            this.cellWidth = 40;
        }
        this.drawPolyominosWithSize(this._model.getNumberOfGeneratedSizeGroups()); //todo: rita den grupp vald idropdown
    }

    private displayPolyominoSizeGroupInfo(sizeGroup: number): void {
        const numberOfVariants: number = this._model.getAllPolyominosWithSize(sizeGroup).length;
        const timeConsumed: string = this._model.getTimeConsumedForGroupWithSize(sizeGroup);
        const infoString: string =
            `Polyomino of size ${sizeGroup} has ${numberOfVariants} variants and took ${timeConsumed} to generate.`;

        document.getElementById('calculationInfo').innerHTML = infoString;
    }
}