import {
    yAxisSymmetry,
    xAxisSymmetry,
    diagonalReflectionSymmetry135,
    diagonalReflectionSymmetry45,
    rotationalSymmetryOfOrderTwo,
    rotationalSymmetryOfOrderFour,
    copyMatrix,
    createPaddedMatrix,
    getDirectNeighboursToCell,
    removePaddingFromMatrix,
    matricesAreEqualIfFlippedAndOrRotated as matricesAreEqualIfFlipedAndOrRotated
} from './MatrixOperations';

export class Polyomino {

    private _emptyValue = false;
    private _filledValue = true;

    private _symmetryNumber: number;
    private _matrix: boolean[][];

    static smallestPolyomino(): Polyomino {
        return new Polyomino([[true]]);
    }

    constructor(matrix: boolean[][]) {
        this._matrix = matrix;
    }

    private calculateSymmetry(): void {
        let symmetryNumber: number = 0;

        if (yAxisSymmetry<boolean>(this._matrix)) { symmetryNumber += 1; }
        if (xAxisSymmetry<boolean>(this._matrix)) { symmetryNumber += 2; } // att roteras 90 grader

        if (diagonalReflectionSymmetry135<boolean>(this._matrix)) { symmetryNumber += 4; } // att roteras 90 grader
        if (diagonalReflectionSymmetry45<boolean>(this._matrix)) { symmetryNumber += 8; }

        if (rotationalSymmetryOfOrderTwo<boolean>(this._matrix)) { symmetryNumber += 16; }
        if (rotationalSymmetryOfOrderFour<boolean>(this._matrix)) { symmetryNumber += 32; }

        this._symmetryNumber = symmetryNumber;
    }

    get symmetryNumber(): number {
        if (this._symmetryNumber == null) {
            this.calculateSymmetry();
        }
        return this._symmetryNumber;
    }

    get matrix(): boolean[][] {
        return copyMatrix<boolean>(this._matrix);
    }

    generateNextSizePolyominosFromThis(): Polyomino[] {

        const generatedPolyominos: Polyomino[] = [];
        type CELL_TEST = (Polyomino) => boolean;
        const cellIsEmpty: CELL_TEST = cell => cell == this._emptyValue;

        const paddedMatrix: boolean[][] = createPaddedMatrix<boolean>(this._matrix, this._emptyValue);

        for (let rowIndex: number = 0; rowIndex < paddedMatrix.length; rowIndex++) {
            for (let columnIndex: number = 0; columnIndex < paddedMatrix[0].length; columnIndex++) {

                if (paddedMatrix[rowIndex][columnIndex] == this._filledValue) {
                    continue;
                }

                const directNeighboursToCell: boolean[] =
                    getDirectNeighboursToCell<boolean>(rowIndex, columnIndex, paddedMatrix);
                if (directNeighboursToCell.every(cellIsEmpty)) {
                    continue;
                }

                const paddedMatrixCopy: boolean[][] = copyMatrix(paddedMatrix);
                paddedMatrixCopy[rowIndex][columnIndex] = this._filledValue;
                const unpaddedMatrix: boolean[][] =
                    removePaddingFromMatrix<boolean>(paddedMatrixCopy, this._emptyValue);
                const newGeneratedPolyomino: Polyomino = new Polyomino(unpaddedMatrix);
                generatedPolyominos.push(newGeneratedPolyomino);

            }
        }

        return generatedPolyominos;
    }

    isEqualToOtherIfFlippedAndOrRotaded(otherPolyomino: Polyomino): boolean {
        return matricesAreEqualIfFlipedAndOrRotated(this._matrix, otherPolyomino._matrix);
    }


}