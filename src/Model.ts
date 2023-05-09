import { Polyomino } from './Polyomino';

export class Model {


    private _polyominoSizeGroups: Polyomino[][];

    constructor() {
        this._polyominoSizeGroups = [[Polyomino.smallestPolyomino()]];

    }

    generateNextPolyominoSizeGroup(): number {
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
        return this._polyominoSizeGroups.length;
    }

    private sizeGroupName(size: number): string {
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

    get largestGeneratedSizeGroup(): Polyomino[] {
        return this._polyominoSizeGroups[this._polyominoSizeGroups.length - 1];
    }

    getAllPolyominosWithSize(size: number): Polyomino[] {
        return this._polyominoSizeGroups[size - 1];
    }



}

