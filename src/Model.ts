import { Polyomino } from './Polyomino';

export class Model {


    private _polyominoSizeGroups: Polyomino[][];
    private _calculationTime: string[];
    private startMeasuredTime: number = 0;

    constructor() {
        this._polyominoSizeGroups = [[Polyomino.smallestPolyomino()]];
        this._calculationTime = ['0s'];

    }

    generateNextPolyominoSizeGroup(): number {
        this.tick();
        const foundPolyominosOfCurrentSize: Polyomino[] = [];
        this._polyominoSizeGroups[this._polyominoSizeGroups.length - 1]
            .forEach(currentSizePolyomino => {
                currentSizePolyomino
                    .generateNextSizePolyominosFromThis()
                    .forEach(nextSizePolyomino => {
                        const alreadyFound: boolean = foundPolyominosOfCurrentSize.some(foundPolyomino =>
                            nextSizePolyomino.isEqualToOtherIfFlippedAndOrRotaded(foundPolyomino));
                        if (!alreadyFound) {
                            foundPolyominosOfCurrentSize.push(nextSizePolyomino);
                        }
                    });
            });

        this._polyominoSizeGroups.push(foundPolyominosOfCurrentSize);
        this._calculationTime.push(this.tock());
        return this._polyominoSizeGroups.length;
    }



    get largestGeneratedSizeGroup(): Polyomino[] {
        return this._polyominoSizeGroups[this._polyominoSizeGroups.length - 1];
    }

    getNumberOfGeneratedSizeGroups(): number {
        return this._polyominoSizeGroups.length;
    }

    getAllPolyominosWithSize(size: number): Polyomino[] {
        return this._polyominoSizeGroups[size - 1];
    }

    getTimeConsumedForGroupWithSize(size: number): string {
        return this._calculationTime[size - 1];
    }

    getNameForGroupWithSize(size: number): string {
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

    private tick(): void {
        const tempD: Date = new Date();
        this.startMeasuredTime = tempD.getTime();
    }

    private tock(): string {
        const tempD: Date = new Date();
        let returString: string = '';
        const passedTime: number = (tempD.getTime() - this.startMeasuredTime) / 1000;
        if (passedTime > 60) {
            returString = (passedTime - passedTime % 60) / 60 + 'm ' + Math.round(passedTime % 60) + 's';
        }
        else {
            returString = passedTime + 's';
        }
        return returString;
    }

}

