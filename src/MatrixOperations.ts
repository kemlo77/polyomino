export function transpose<Type>(matrix: Type[][]): Type[][] {
    const newArrayOfArrays: Type[][] = [];
    for (let column: number = 0; column < matrix[0].length; column++) {
        const newRow: Type[] = [];
        for (let row: number = 0; row < matrix.length; row++) {
            newRow.push(matrix[row][column]);
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
    for (let r: number = 0; r < matrix1.length; r++) {
        for (let s: number = 0; s < matrix1[0].length; s++) {
            if (matrix1[r][s] !== matrix2[r][s]) {
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
    for (let x: number = 1; x < matrix.length; x++) {
        for (let y: number = 0; y < x; y++) {
            if (matrix[x][y] !== matrix[y][x]) {
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

    for (let x: number = 0; x < matrix.length - 1; x++) {
        for (let y: number = 0; y < matrix.length - x - 1; y++) {
            if (matrix[x][y] !== matrix[matrix.length - y - 1][matrix.length - x - 1]) {
                return false;
            }
        }
    }
    return true;
}


export function xAxisSymmetry<Type>(matrix: Type[][]): boolean {
    for (let x: number = 0; x < Math.floor(matrix.length / 2); x++) {
        for (let y: number = 0; y < matrix[0].length; y++) {
            if (matrix[x][y] !== matrix[matrix.length - 1 - x][y]) { return false; }
        }
    }
    return true;
}


export function yAxisSymmetry<Type>(matrix: Type[][]): boolean {
    for (let x: number = 0; x < matrix.length; x++) {
        for (let y: number = 0; y < Math.floor(matrix[0].length / 2); y++) {
            if (matrix[x][y] !== matrix[x][matrix[0].length - 1 - y]) { return false; }
        }
    }
    return true;
}


export function rotationalSymmetryOfOrderTwo<Type>(matrix: Type[][]): boolean {
    for (let x: number = 0; x < Math.ceil(matrix.length / 2); x++) {
        for (let y: number = 0; y < matrix[0].length; y++) {
            if (matrix[x][y] !== matrix[matrix.length - 1 - x][matrix[0].length - 1 - y]) { return false; }
        }
    }
    return true;
}


export function rotationalSymmetryOfOrderFour<Type>(matrix: Type[][]): boolean {
    if (matrix.length !== matrix[0].length) {
        return false;
    }

    for (let x: number = 0; x < Math.ceil(matrix.length / 2); x++) {
        for (let y: number = 0; y < Math.ceil(matrix[0].length / 2); y++) {
            //top right
            if (matrix[x][y] !== matrix[y][matrix[0].length - 1 - x]) { return false; }
            //lower right
            if (matrix[x][y] !== matrix[matrix.length - 1 - x][matrix[0].length - 1 - y]) { return false; }
            //lower left
            if (matrix[x][y] !== matrix[matrix.length - 1 - y][x]) { return false; }
        }
    }
    return true;
}


export function createPaddedMatrix<Type>(matrix: Type[][], paddingValue: Type): Type[][] {
    const newMatrix: Type[][] = [];
    newMatrix.push(Array(matrix[0].length + 2).fill(paddingValue));
    for (let x: number = 0; x < matrix.length; x++) {
        newMatrix.push([paddingValue].concat(matrix[x], paddingValue));
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

    for (let n: number = rowStartIndex; n < rowEndIndex; n++) {
        newUnpaddedMatrix.push(matrix[n].slice(columnStartIndex, columnStopIndex));
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
