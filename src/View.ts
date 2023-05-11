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
    private cellWidth: number = 5;
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
    }

    update(): void {
        const largestSizeGroupGenerated: number = this._model.getNumberOfGeneratedSizeGroups();
        this.addPolyominoSizeGroupToSelect(largestSizeGroupGenerated);
        this.drawPolyominosWithSize(largestSizeGroupGenerated);
        this.displayPolyominoSizeGroupInfo(largestSizeGroupGenerated);
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
        this.drawPolyomino(this._model.getAllPolyominosWithSize(size));
    }

    private drawPolyomino(polyominos: Polyomino[]): void {
        const vitKant: number = 0.5;
        let offset_x: number = this.cellWidth;
        let offset_y: number = this.cellWidth;
        //max h�jd f�r aktuel rad. Anv�nds f�r att ekonomisera utrymmet
        let maxShapeHeight: number = 0;



        // tar omr�det som kan ritas ut p�

        if (!this._canvasElement.getContext) {
            return;
        }


        this._ctx.clearRect(0, 0, this.width, this.height);
        this._ctx.fillStyle = 'rgba(170,170,170,1)';
        this._ctx.save();
        this._ctx.translate(offset_x, offset_y);

        //f�r alla shapes (att rita ut)
        for (let z: number = 0; z < polyominos.length; z++) {
            const formen: boolean[][] = polyominos[z].matrix;
            this._ctx.fillStyle = this.getFillStyle(polyominos[z].symmetryNumber);


            //ritar ut 
            for (let i: number = 0; i < formen.length; i++) {
                //sparar max antal kvadrater p� h�jden
                if (formen.length > maxShapeHeight) { maxShapeHeight = formen.length; }
                //ritar ut alla bitar
                for (let j: number = 0; j < formen[0].length; j++) {
                    if (formen[i][j]) {
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
                return 'rgba(255,204,102,1)'; //yellow
            case 63:
                return 'rgba(136,204,204,1)';
            default:
                return 'rgba(0,0,255,1)';
        }
    }

    private decreaseCellSize(): void {
        if (this.cellWidth > 1) {
            this.cellWidth -= 3;
        }
        this.drawPolyominosWithSize(this._model.getNumberOfGeneratedSizeGroups()); //todo: rita den grupp vald idropdown
    }

    private increaseCellSize(): void {
        if (this.cellWidth < 40) {
            this.cellWidth += 3;
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