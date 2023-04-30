import {
    createPaddedMatrix,
    diagonalReflectionSymmetry135,
    diagonalReflectionSymmetry45,
    flipHorizontally,
    flipVertically,
    getDirectNeighboursToCell,
    matricesAreEqualIfFlipedOrRotated,
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
} from './MatrixOperations';
import { Polyomino } from './Polyomino';
import './style.css';
import { View } from './View';

document.getElementById('startButton').addEventListener('click', () => starta());
document.getElementById('plusButton').addEventListener('click', () => increaseSize());
document.getElementById('minusButton').addEventListener('click', () => decreaseSize());
const generationSelect: HTMLSelectElement = document.getElementById('generationListan') as HTMLSelectElement;
generationSelect.addEventListener('change', () => listChange());
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

const view: View = new View(canvas);

const calculationTime: string[] = [];
calculationTime.push("0s");
let startMeasuredTime: number = 0;


const smallestPolyomino: Polyomino<number> = new Polyomino([[1]]);
const variantGenerationPolyomino: Polyomino<number>[][] = [[smallestPolyomino]];


function getListValue(): number {
    const returnValdGeneration: string = generationSelect.options[generationSelect.selectedIndex].value;
    return Number(returnValdGeneration);
}

function addValueToSelect(size: number): void {
    generationSelect.options[generationSelect.options.length] = new Option(String(size), String(size));
    //select the added value in the list
    generationSelect.selectedIndex = size - 1;
}

function drawShapes(): void {

    //const valdGeneration: number = getListValue();

    view.drawPolyomino(variantGenerationPolyomino[variantGenerationPolyomino.length - 1]);

}



function starta(): void {
    tick();
    let fluffTecken = 0;


    let foundPolyominosOfCurrentSize = [];
    //att j�mf�ra med alla p� den f�reg�ende niv�n
    variantGenerationPolyomino[variantGenerationPolyomino.length - 1].forEach(polyomino => {
        let paddedMatrix = createPaddedMatrix(polyomino.matrix, fluffTecken);
        //testa alla positioner f�r ny "kvadratdel"
        for (let z: number = 0; z < paddedMatrix.length; z++) {
            for (let d: number = 0; d < paddedMatrix[0].length; d++) {
                //om det �r en tom cell testar vi p� den
                if (paddedMatrix[z][d] == fluffTecken) {
                    //bara intressant att kolla om den har grannar
                    const directNeighboursToCell = getDirectNeighboursToCell(z, d, paddedMatrix);
                    if (directNeighboursToCell.some(cell => cell !== 0)) {
                        //s�tter en tempor�r markering i rutan som kollas
                        paddedMatrix[z][d] = 1;
                        //om det inte finns N�T sparat f�r den leveln s� �r det bara att spara
                        if (foundPolyominosOfCurrentSize.length == 0) {
                            let matrixToStore = removePaddingFromMatrix(paddedMatrix, fluffTecken);
                            foundPolyominosOfCurrentSize.push(new Polyomino(matrixToStore));
                        }
                        else {
                            //j�mf�ra med alla p� befintlig generation level
                            let hittarMatchning: boolean = false;
                            let matrixToCompare = removePaddingFromMatrix(paddedMatrix, fluffTecken);
                            for (let h: number = 0; h < foundPolyominosOfCurrentSize.length; h++) {
                                hittarMatchning = matricesAreEqualIfFlipedOrRotated(foundPolyominosOfCurrentSize[h].matrix, matrixToCompare);
                                if (hittarMatchning) { break; }//om den redan fanns kan man avbryta
                            }
                            if (!hittarMatchning) {//sparar om det inte finns n�n matchning
                                let theSymmetryNumber = calculateSymmetry(matrixToCompare);

                                // om den �r enkelt symetrisk kring x-axeln eller kring 135 
                                // grader roteras den 90 grader innan den sparas.
                                if (theSymmetryNumber == 2 || theSymmetryNumber == 4) {
                                    foundPolyominosOfCurrentSize.push(new Polyomino(rotate90CounterClockwise(matrixToCompare)));
                                }
                                else {
                                    foundPolyominosOfCurrentSize.push(new Polyomino(matrixToCompare));
                                }
                            }

                        }
                        paddedMatrix[z][d] = fluffTecken; //�terst�ller fluffadMatris f�r att �teranv�nda
                    }
                }
            }
        }
    });



    variantGenerationPolyomino.push(foundPolyominosOfCurrentSize);


    addValueToSelect(variantGenerationPolyomino.length);

    //note how long it took to calculate
    const timePassed: string = tock();
    calculationTime.push(timePassed);

    //update info and repaint
    listChange();
    drawShapes();
}




function calculateSymmetry(matris): number {
    let symmetryNumber: number = 0;

    if (yAxisSymmetry(matris)) { symmetryNumber += 1; }
    if (xAxisSymmetry(matris)) { symmetryNumber += 2; }

    if (diagonalReflectionSymmetry135(matris)) { symmetryNumber += 4; }
    if (diagonalReflectionSymmetry45(matris)) { symmetryNumber += 8; }

    if (rotationalSymmetryOfOrderTwo(matris)) { symmetryNumber += 16; }
    if (rotationalSymmetryOfOrderFour(matris)) { symmetryNumber += 32; }

    return symmetryNumber;
}


function decreaseSize(): void {
    view.decreaseCellSize();
    drawShapes();
}

function increaseSize(): void {
    view.increaseCellSize();
    drawShapes();
}

function tick(): void {
    const tempD: Date = new Date();
    startMeasuredTime = tempD.getTime();
}

function tock(): string {
    const tempD: Date = new Date();
    let returString: string = '';
    const passedTime: number = (tempD.getTime() - startMeasuredTime) / 1000;
    if (passedTime > 60) {
        returString = (passedTime - passedTime % 60) / 60 + 'm ' + Math.round(passedTime % 60) + 's';
    }
    else {
        returString = passedTime + 's';
    }
    return returString;
}

function listChange(): void {

    //antal delar
    document.getElementById('delar').innerHTML = getListValue() + '';
    //uppdaterar med antal
    document.getElementById('antalText').innerHTML = variantGenerationPolyomino[getListValue() - 1].length + '';
    //hur l�ng tid ber�kningen tog
    document.getElementById('cost').innerHTML = calculationTime[getListValue() - 1];


}

