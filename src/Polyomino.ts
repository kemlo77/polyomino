import {
    yAxisSymmetry,
    xAxisSymmetry,
    diagonalReflectionSymmetry135,
    diagonalReflectionSymmetry45,
    rotationalSymmetryOfOrderTwo,
    rotationalSymmetryOfOrderFour
} from './MatrixOperations';

export class Polyomino<Type> {

    private _symmetryNumber: number;
    private _matrix: Type[][];

    constructor(matrix: Type[][]) {
        this._matrix = matrix;
        this._symmetryNumber = this.calculateSymmetry(this._matrix);
    }

    private calculateSymmetry(matris: Type[][]): number {
        let symmetryNumber: number = 0;

        if (yAxisSymmetry<Type>(matris)) { symmetryNumber += 1; }
        if (xAxisSymmetry<Type>(matris)) { symmetryNumber += 2; }

        if (diagonalReflectionSymmetry135<Type>(matris)) { symmetryNumber += 4; }
        if (diagonalReflectionSymmetry45<Type>(matris)) { symmetryNumber += 8; }

        if (rotationalSymmetryOfOrderTwo<Type>(matris)) { symmetryNumber += 16; }
        if (rotationalSymmetryOfOrderFour<Type>(matris)) { symmetryNumber += 32; }

        return symmetryNumber;
    }

    get symmetryNumber(): number {
        return this._symmetryNumber;
    }

    get matrix(): Type[][] {
        return this._matrix;
    }
}