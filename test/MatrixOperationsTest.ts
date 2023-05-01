import { expect } from 'chai';
import {
    copyMatrix,
    createPaddedMatrix,
    diagonalReflectionSymmetry135,
    diagonalReflectionSymmetry45,
    flipHorizontally, flipVertically,
    getDirectNeighboursToCell,
    matricesAreEqualIfFlippedAndOrRotated,
    matrixToString,
    matrixesAreEqual,
    removePaddingFromMatrix,
    rotate180,
    rotate90Clockwise,
    rotate90CounterClockwise,
    rotationalSymmetryOfOrderFour,
    rotationalSymmetryOfOrderTwo,
    xAxisSymmetry,
    yAxisSymmetry
} from '../src/MatrixOperations';

describe('ModelOperations', () => {


    it('matrixesAreEqual - equal', () => {
        const testMatrix5: string[][] = [
            ['a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h'],
            ['i', 'j', 'k', 'l'],
            ['m', 'n', 'o', 'p']
        ];
        expect(matrixesAreEqual(testMatrix5, testMatrix5)).to.be.true;
    });

    it('matrixesAreEqual - not equal alt 1', () => {
        const matrix1: string[][] = [['a', 'b']];
        const matrix2: string[][] = [['a'], ['b']];
        expect(matrixesAreEqual(matrix1, matrix2)).to.be.false;
    });

    it('matrixesAreEqual - not equal alt 2', () => {
        const matrix1: string[][] = [['a', 'b']];
        const matrix2: string[][] = [['a', 'c']];
        expect(matrixesAreEqual(matrix1, matrix2)).to.be.false;
    });

    it('matrixesAreEqual - not equal alt 3', () => {
        const matrix1: string[][] = [['a', 'b', 'c']];
        const matrix2: string[][] = [['a', 'b']];
        expect(matrixesAreEqual(matrix1, matrix2)).to.be.false;
    });

    it('rotate90Clockwise - equal', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ];
        const matrix1ExpectedRotation: string[][] = [
            ['d', 'a'],
            ['e', 'b'],
            ['f', 'c']
        ];
        const rotatedMatrix: string[][] = rotate90Clockwise(matrix1);
        expect(matrixesAreEqual(rotatedMatrix, matrix1ExpectedRotation)).to.be.true;
    });

    it('rotate90CounterClockwise - equal', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ];
        const matrix1ExpectedRotation: string[][] = [
            ['c', 'f'],
            ['b', 'e'],
            ['a', 'd']
        ];
        const rotatedMatrix: string[][] = rotate90CounterClockwise(matrix1);
        expect(matrixesAreEqual(rotatedMatrix, matrix1ExpectedRotation)).to.be.true;
    });

    it('rotate180 - equal', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ];
        const matrix1ExpectedRotation: string[][] = [
            ['f', 'e', 'd'],
            ['c', 'b', 'a']
        ];
        const rotatedMatrix: string[][] = rotate180(matrix1);
        expect(matrixesAreEqual(rotatedMatrix, matrix1ExpectedRotation)).to.be.true;
    });

    it('flipVertically', () => {
        const matrix: string[][] = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ];
        const matrixExpectedFlip: string[][] = [
            ['c', 'b', 'a'],
            ['f', 'e', 'd']
        ];
        const rotatedMatrix: string[][] = flipVertically(matrix);
        expect(matrixesAreEqual(rotatedMatrix, matrixExpectedFlip)).to.be.true;
    });

    it('flipHorizontally', () => {
        const matrix: string[][] = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ];
        const expectedMatrixAfterFlip: string[][] = [
            ['d', 'e', 'f'],
            ['a', 'b', 'c']
        ];
        const rotatedMatrix: string[][] = flipHorizontally(matrix);
        expect(matrixesAreEqual(rotatedMatrix, expectedMatrixAfterFlip)).to.be.true;
    });



    it('matricesAreEqualIfFlippedAndOrRotated - happy case', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h'],
            ['i', 'j', 'k', 'l'],
            ['m', 'n', 'o', 'p']
        ];
        const rotatedMatrices: string[][][] = [];
        rotatedMatrices.push(matrix1);
        rotatedMatrices.push(rotate90Clockwise(matrix1));
        rotatedMatrices.push(rotate180(matrix1));
        rotatedMatrices.push(rotate90CounterClockwise(matrix1));
        rotatedMatrices.push(flipHorizontally(matrix1));
        rotatedMatrices.push(flipHorizontally(rotate90Clockwise(matrix1)));
        rotatedMatrices.push(flipHorizontally(rotate180(matrix1)));
        rotatedMatrices.push(flipHorizontally(rotate90CounterClockwise(matrix1)));

        rotatedMatrices.forEach(matrix => {
            expect(matricesAreEqualIfFlippedAndOrRotated(matrix, matrix1)).to.be.true;
        });
    });



    it('matricesAreEqualIfFlippedAndOrRotated - different dimensions', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ];
        const matrix2: string[][] = [
            ['a', 'b'],
            ['c', 'd']
        ];
        expect(matricesAreEqualIfFlippedAndOrRotated(matrix2, matrix1)).to.be.false;
    });

    it('matricesAreEqualIfFlippedAndOrRotated - different values', () => {
        const testMatrix: string[][] = [
            ['a', 'b'],
            ['c', 'd']
        ];
        const testMatrix3alternate: string[][] = [
            ['a', 'b'],
            ['c', 'q']
        ];
        expect(matricesAreEqualIfFlippedAndOrRotated(testMatrix, testMatrix3alternate)).to.be.false;
    });

    it('diagonalReflectionSymmetry135 - is symmetrical', () => {
        const matrix: string[][] = [
            ['v', '1', '2', '3'],
            ['1', 'x', '4', '5'],
            ['2', '4', 'y', '6'],
            ['3', '5', '6', 'z']
        ];
        expect(diagonalReflectionSymmetry135(matrix)).to.be.true;
    });

    it('diagonalReflectionSymmetry135 - is not symmetrical 1', () => {
        const matrix: string[][] = [
            ['v', '1', '2', '3'],
            ['1', 'x', '4', '5'],
            ['2', '4', 'y', '6'],
            ['3', '5', '_', 'z']
        ];
        expect(diagonalReflectionSymmetry135(matrix)).to.be.false;
    });

    it('diagonalReflectionSymmetry135 - is not symmetrical 2', () => {
        const matrix: string[][] = [
            ['1', '1', '1', '1'],
            ['1', '1', '1', '1'],
            ['1', '1', '1', '1']
        ];
        expect(diagonalReflectionSymmetry135(matrix)).to.be.false;
    });

    it('diagonalReflectionSymmetry45 - is symmetrical', () => {
        const matrix: string[][] = [
            ['3', '2', '1', 'v'],
            ['5', '4', 'x', '1'],
            ['6', 'y', '4', '2'],
            ['z', '6', '5', '3']
        ];
        expect(diagonalReflectionSymmetry45(matrix)).to.be.true;
    });

    it('diagonalReflectionSymmetry45 - is not symmetrical 1', () => {
        const matrix: string[][] = [
            ['3', '2', '1', 'v'],
            ['5', '4', 'x', '1'],
            ['6', 'y', '4', '2'],
            ['z', '6', '_', '3']
        ];
        expect(diagonalReflectionSymmetry45(matrix)).to.be.false;
    });

    it('diagonalReflectionSymmetry45 - is not symmetrical 2', () => {
        const matrix: string[][] = [
            ['1', '1', '1', '1'],
            ['1', '1', '1', '1'],
            ['1', '1', '1', '1']
        ];
        expect(diagonalReflectionSymmetry45(matrix)).to.be.false;
    });


    it('xAxisSymmetry - is symmetrical', () => {
        const passMatrix1: string[][] = [
            ['a', 'b'],
            ['e', 'f'],
            ['e', 'f'],
            ['a', 'b']
        ];
        const passMatrix2: string[][] = [
            ['a', 'b'],
            ['e', 'f'],
            ['r', 'd'],
            ['e', 'f'],
            ['a', 'b']
        ];
        expect(xAxisSymmetry(passMatrix1)).to.be.true;
        expect(xAxisSymmetry(passMatrix2)).to.be.true;
    });

    it('xAxisSymmetry - is not symmetrical', () => {
        const passMatrix1: string[][] = [
            ['a', 'b'],
            ['e', 'f'],
            ['e', '_'],
            ['a', 'b']
        ];
        const passMatrix2: string[][] = [
            ['a', 'b'],
            ['e', 'f'],
            ['r', 'd'],
            ['_', 'f'],
            ['a', 'b']
        ];
        expect(xAxisSymmetry(passMatrix1)).to.be.false;
        expect(xAxisSymmetry(passMatrix2)).to.be.false;
    });

    it('yAxisSymmetry - is symmetrical', () => {
        const passMatrix1: string[][] = [
            ['a', 'b', 'x', 'b', 'a'],
            ['e', 'f', 'y', 'f', 'e']
        ];
        const passMatrix2: string[][] = [
            ['a', 'b', 'b', 'a'],
            ['e', 'f', 'f', 'e']
        ];
        expect(yAxisSymmetry(passMatrix1)).to.be.true;
        expect(yAxisSymmetry(passMatrix2)).to.be.true;
    });

    it('yAxisSymmetry - is not symmetrical', () => {
        const passMatrix1: string[][] = [
            ['a', 'b', 'x', '_', 'a'],
            ['e', 'f', 'y', 'f', 'e']
        ];
        const passMatrix2: string[][] = [
            ['a', 'b', 'b', 'a'],
            ['e', '_', 'f', 'e']
        ];
        expect(yAxisSymmetry(passMatrix1)).to.be.false;
        expect(yAxisSymmetry(passMatrix2)).to.be.false;
    });


    it('rotationalSymmetryOfOrderTwo - is symmetrical', () => {
        const passMatrix1: string[][] = [
            ['a', 'b'],
            ['b', 'a']
        ];
        const passMatrix2: string[][] = [
            ['a', 'b', 'c'],
            ['e', 'f', 'e'],
            ['c', 'b', 'a']
        ];
        const passMatrix3: string[][] = [
            ['a', 'b', 'c'],
            ['c', 'b', 'a']
        ];
        expect(rotationalSymmetryOfOrderTwo(passMatrix1)).to.be.true;
        expect(rotationalSymmetryOfOrderTwo(passMatrix2)).to.be.true;
        expect(rotationalSymmetryOfOrderTwo(passMatrix3)).to.be.true;
    });

    it('rotationalSymmetryOfOrderTwo - is not symmetrical', () => {
        const failMatrix1: string[][] = [
            ['a', 'b', 'c'],
            ['c', 'b', '_']
        ];
        expect(rotationalSymmetryOfOrderTwo(failMatrix1)).to.be.false;
    });

    it('rotationalSymmetryOfOrderFour - is symmetrical', () => {
        const passMatrix1: string[][] = [
            ['a', 'b', 'a'],
            ['b', 'f', 'b'],
            ['a', 'b', 'a']
        ];
        const passMatrix2: string[][] = [
            ['a', 'a'],
            ['a', 'a']
        ];
        expect(rotationalSymmetryOfOrderFour(passMatrix1)).to.be.true;
        expect(rotationalSymmetryOfOrderFour(passMatrix2)).to.be.true;
    });

    it('rotationalSymmetryOfOrderFour - is not symmetrical', () => {
        const failMatrix1: string[][] = [
            ['a', 'a'],
            ['c', 'a']
        ];
        const failMatrix2: string[][] = [
            ['a', 'a'],
            ['a', 'a'],
            ['a', 'a'],
        ];
        const failMatrix3: string[][] = [
            ['a', 'b', 'a'],
            ['a', 'b', 'a']
        ];
        const failMatrix4a: string[][] = [
            ['_', 'b', 'a'],
            ['b', 'f', 'b'],
            ['a', 'b', 'a']
        ];
        const failMatrix4b: string[][] = [
            ['a', 'b', 'a'],
            ['b', 'f', 'b'],
            ['_', 'b', 'a']
        ];
        const failMatrix4c: string[][] = [
            ['a', 'b', '_'],
            ['b', 'f', 'b'],
            ['a', 'b', 'a']
        ];
        const failMatrix4d: string[][] = [
            ['a', 'b', 'a'],
            ['b', 'f', 'b'],
            ['a', 'b', '_']
        ];
        const failMatrix5a: string[][] = [
            ['a', '_', 'a'],
            ['b', 'f', 'b'],
            ['a', 'b', 'a']
        ];
        const failMatrix5b: string[][] = [
            ['a', 'b', 'a'],
            ['_', 'f', 'b'],
            ['a', 'b', 'a']
        ];
        const failMatrix5c: string[][] = [
            ['a', 'b', 'a'],
            ['b', 'f', '_'],
            ['a', 'b', 'a']
        ];
        const failMatrix5d: string[][] = [
            ['a', 'b', 'a'],
            ['b', 'f', 'b'],
            ['a', '_', 'a']
        ];
        [
            failMatrix1,
            failMatrix2,
            failMatrix3,
            failMatrix4a,
            failMatrix4b,
            failMatrix4c,
            failMatrix4d,
            failMatrix5a,
            failMatrix5b,
            failMatrix5c,
            failMatrix5d
        ].forEach(matrix => {
            expect(rotationalSymmetryOfOrderFour(matrix)).to.be.false;
        });
    });



    it('createPaddedMatrix', () => {
        const matrix: string[][] = [
            ['a', 'b'],
            ['c', 'd']];
        const paddedMatrix: string[][] = createPaddedMatrix(matrix, '_');
        const expectedMatrix: string[][] = [
            ['_', '_', '_', '_'],
            ['_', 'a', 'b', '_'],
            ['_', 'c', 'd', '_'],
            ['_', '_', '_', '_']];
        expect(matrixesAreEqual(paddedMatrix, expectedMatrix)).to.be.true;
    });

    it('removePaddingFromMatrix - matrix is intact', () => {
        const matrix: string[][] = [
            ['a', 'b'],
            ['c', 'd']];
        const matrixWithPaddingRemoved: string[][] = removePaddingFromMatrix(matrix, '_');
        expect(matrixesAreEqual(matrix, matrixWithPaddingRemoved)).to.be.true;
    });


    it('removePaddingFromMatrix - padding is removed', () => {
        const paddedMatrix: string[][] = [
            ['_', '_', '_', '_'],
            ['_', 'a', 'b', '_'],
            ['_', 'c', 'd', '_'],
            ['_', '_', '_', '_']];
        const expectedMatrix: string[][] = [
            ['a', 'b'],
            ['c', 'd']];
        const matrixWithPaddingRemoved: string[][] = removePaddingFromMatrix(paddedMatrix, '_');
        expect(matrixesAreEqual(matrixWithPaddingRemoved, expectedMatrix)).to.be.true;
    });

    it('matrixToString', () => {
        const matrix: string[][] = [
            ['a', 'b'],
            ['c', 'd']];
        expect(matrixToString(matrix)).to.equal('a\tb\nc\td\n');
    });

    it('getDirectNeighboursToCell - 4 neighbours', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'a'],
            ['a', 'a', 'a'],
            ['a', 'a', 'a']
        ];
        expect(getDirectNeighboursToCell(1, 1, matrix1).length).to.equal(4);
    });

    it('getDirectNeighboursToCell - two neighbours', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'a'],
            ['a', 'a', 'a'],
            ['a', 'a', 'a']
        ];
        expect(getDirectNeighboursToCell(0, 0, matrix1).length).to.equal(2);
    });

    it('getDirectNeighboursToCell - two neighbours (ver b)', () => {
        const matrix1: string[][] = [
            ['a', 'b', 'a'],
            ['a', 'a', 'a'],
            ['a', 'a', 'a']
        ];
        expect(getDirectNeighboursToCell(2, 2, matrix1).length).to.equal(2);
    });

    it('copyMatrix', () => {
        const matrix: string[][] = [
            ['a', 'b', 'c'],
            ['d', 'e', 'f'],
            ['g', 'h', 'i']
        ];
        const matrixCopy: string[][] = copyMatrix(matrix);
        expect(matrixesAreEqual(matrix, matrixCopy)).to.be.true;
    });



});