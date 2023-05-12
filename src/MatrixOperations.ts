export function transpose<Type>(matrix: Type[][]): Type[][] {
    const newArrayOfArrays: Type[][] = [];
    for (let col: number = 0; col < matrix[0].length; col++) {
        const newRow: Type[] = [];
        for (let row: number = 0; row < matrix.length; row++) {
            newRow.push(matrix[row][col]);
        }
        newArrayOfArrays.push(newRow);
    }
    return newArrayOfArrays;
}


export function flipHorizontally<Type>(matrix: Type[][]): Type[][] {
    return matrix.slice().reverse();
}


export function flipVertically<Type>(matrix: Type[][]): Type[][] {
    const returnMatrix: Type[][] = [];
    matrix.forEach(row => {
        returnMatrix.push(row.slice().reverse());
    });
    return returnMatrix;
}

export function rotate90Clockwise<Type>(matrix: Type[][]): Type[][] {
    return transpose(flipHorizontally<Type>(matrix));
}


export function rotate90CounterClockwise<Type>(matrix: Type[][]): Type[][] {
    return transpose(flipVertically<Type>(matrix));
}


export function rotate180<Type>(matrix: Type[][]): Type[][] {
    return flipHorizontally(flipVertically<Type>(matrix));
}


export function matrixesAreEqual<Type>(matrix1: Type[][], matrix2: Type[][]): boolean {
    if (matrix1.length !== matrix2.length) {
        return false;
    }
    if (matrix1[0].length !== matrix2[0].length) {
        return false;
    }
    for (let row: number = 0; row < matrix1.length; row++) {
        for (let col: number = 0; col < matrix1[0].length; col++) {
            if (matrix1[row][col] !== matrix2[row][col]) {
                return false;
            }
        }
    }

    return true;
}


export function matricesAreEqualIfFlippedAndOrRotated<Type>(matrix1: Type[][], matrix2: Type[][]): boolean {

    const matricesAlreadyHaveSameDimensions: boolean =
        matrix1.length == matrix2.length && matrix1[0].length == matrix2[0].length;
    const matricesHaveSameDimensionsIfOneIsRotated: boolean =
        matrix1.length == matrix2[0].length && matrix2.length == matrix1[0].length;

    if (matricesAlreadyHaveSameDimensions) {
        if (matrixesAreEqual(matrix1, matrix2)) { return true; }
        if (matrixesAreEqual(matrix1, flipHorizontally(matrix2))) { return true; }
        if (matrixesAreEqual(matrix1, rotate180(matrix2))) { return true; }
        if (matrixesAreEqual(matrix1, flipVertically(matrix2))) { return true; }
    }

    if (matricesHaveSameDimensionsIfOneIsRotated) {
        const matrix2Rotated90Clockwise: Type[][] = rotate90Clockwise(matrix2);
        if (matrixesAreEqual(matrix1, matrix2Rotated90Clockwise)) { return true; }
        if (matrixesAreEqual(matrix1, flipHorizontally(matrix2Rotated90Clockwise))) { return true; }
        if (matrixesAreEqual(matrix1, rotate180(matrix2Rotated90Clockwise))) { return true; }
        if (matrixesAreEqual(matrix1, flipVertically(matrix2Rotated90Clockwise))) { return true; }

    }
    return false;
}


export function diagonalReflectionSymmetry135<Type>(matrix: Type[][]): boolean {
    if (matrix.length !== matrix[0].length) {
        return false;
    }
    for (let row: number = 1; row < matrix.length; row++) {
        for (let col: number = 0; col < row; col++) {
            if (matrix[row][col] !== matrix[col][row]) {
                return false;
            }
        }
    }
    return true;
}


export function diagonalReflectionSymmetry45<Type>(matrix: Type[][]): boolean {
    if (matrix.length !== matrix[0].length) {
        return false;
    }

    for (let row: number = 0; row < matrix.length - 1; row++) {
        for (let col: number = 0; col < matrix.length - row - 1; col++) {
            if (matrix[row][col] !== matrix[matrix.length - col - 1][matrix.length - row - 1]) {
                return false;
            }
        }
    }
    return true;
}


export function xAxisSymmetry<Type>(matrix: Type[][]): boolean {
    for (let row: number = 0; row < Math.floor(matrix.length / 2); row++) {
        for (let col: number = 0; col < matrix[0].length; col++) {
            if (matrix[row][col] !== matrix[matrix.length - 1 - row][col]) { return false; }
        }
    }
    return true;
}


export function yAxisSymmetry<Type>(matrix: Type[][]): boolean {
    for (let row: number = 0; row < matrix.length; row++) {
        for (let col: number = 0; col < Math.floor(matrix[0].length / 2); col++) {
            if (matrix[row][col] !== matrix[row][matrix[0].length - 1 - col]) { return false; }
        }
    }
    return true;
}


export function rotationalSymmetryOfOrderTwo<Type>(matrix: Type[][]): boolean {
    for (let row: number = 0; row < Math.ceil(matrix.length / 2); row++) {
        for (let col: number = 0; col < matrix[0].length; col++) {
            if (matrix[row][col] !== matrix[matrix.length - 1 - row][matrix[0].length - 1 - col]) { return false; }
        }
    }
    return true;
}


export function rotationalSymmetryOfOrderFour<Type>(matrix: Type[][]): boolean {
    if (matrix.length !== matrix[0].length) {
        return false;
    }

    for (let row: number = 0; row < Math.ceil(matrix.length / 2); row++) {
        for (let col: number = 0; col < Math.ceil(matrix[0].length / 2); col++) {
            //top right
            if (matrix[row][col] !== matrix[col][matrix[0].length - 1 - row]) { return false; }
            //lower right
            if (matrix[row][col] !== matrix[matrix.length - 1 - row][matrix[0].length - 1 - col]) { return false; }
            //lower left
            if (matrix[row][col] !== matrix[matrix.length - 1 - col][row]) { return false; }
        }
    }
    return true;
}


export function createPaddedMatrix<Type>(matrix: Type[][], paddingValue: Type): Type[][] {
    const newMatrix: Type[][] = [];
    newMatrix.push(Array(matrix[0].length + 2).fill(paddingValue));
    for (let row: number = 0; row < matrix.length; row++) {
        newMatrix.push([paddingValue].concat(matrix[row], paddingValue));
    }
    newMatrix.push(Array(matrix[0].length + 2).fill(paddingValue));
    return newMatrix;
}


export function removePaddingFromMatrix<Type>(matrix: Type[][], paddingValue: Type): Type[][] {
    const valueIsNotPaddingValue: (x: Type) => boolean = (value: Type): boolean => value !== paddingValue;
    const firstRow: Type[] = matrix[0];
    const lastRow: Type[] = matrix[matrix.length - 1];
    const firstColumn: Type[] = matrix.map(row => row[0]);
    const lastColumn: Type[] = matrix.map(row => row[row.length - 1]);

    const newUnpaddedMatrix: Type[][] = [];

    const rowStartIndex: number = firstRow.some(valueIsNotPaddingValue) ? 0 : 1;
    const rowEndIndex: number = lastRow.some(valueIsNotPaddingValue) ? matrix.length : matrix.length - 1;
    const columnStartIndex: number = firstColumn.some(valueIsNotPaddingValue) ? 0 : 1;
    const columnStopIndex: number = lastColumn.some(valueIsNotPaddingValue) ? Infinity : -1;

    for (let rowIndex: number = rowStartIndex; rowIndex < rowEndIndex; rowIndex++) {
        newUnpaddedMatrix.push(matrix[rowIndex].slice(columnStartIndex, columnStopIndex));
    }

    return newUnpaddedMatrix;
}


export function getDirectNeighboursToCell<Type>(row: number, column: number, matrix: Type[][],): Type[] {
    const directNeighbouringCells: Type[] = [];

    if (row > 0) {
        const neighbourAbove: Type = matrix[row - 1][column];
        directNeighbouringCells.push(neighbourAbove);
    }

    if (row < matrix.length - 1) {
        const neigbourBelow: Type = matrix[row + 1][column];
        directNeighbouringCells.push(neigbourBelow);
    }

    if (column > 0) {
        const neighbourToTheLeft: Type = matrix[row][column - 1];
        directNeighbouringCells.push(neighbourToTheLeft);
    }

    if (column < (matrix[row].length - 1)) {
        const neighbourToTheRight: Type = matrix[row][column + 1];
        directNeighbouringCells.push(neighbourToTheRight);
    }
    return directNeighbouringCells;
}


export function matrixToString<Type>(matrix: Type[][]): string {
    let matrixAsString: string = '';
    matrix.forEach(row => {
        matrixAsString += row.join('\t');
        matrixAsString += '\n';
    });
    return matrixAsString;
}

export function copyMatrix<Type>(matrix: Type[][]): Type[][] {
    const newMatrix: Type[][] = [];
    matrix.forEach(row => newMatrix.push(row.slice()));
    return newMatrix;
}
