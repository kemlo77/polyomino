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
import './style.css';
import { View } from './View';

document.getElementById('startButton').addEventListener('click', () => starta());
document.getElementById('plusButton').addEventListener('click', () => increaseSize());
document.getElementById('minusButton').addEventListener('click', () => decreaseSize());
document.getElementById('generationListan').addEventListener('change', () => listChange());
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

const view: View = new View(canvas);


let variantGeneration = [];
let generationLevel = [];
let startMatris = [];
const calculationTime: string[] = [];
calculationTime.push("0s");
startMatris.push([1]);
generationLevel.push(startMatris);
variantGeneration.push(generationLevel);
let startMeasuredTime: number = 0;

const variantGenerationSymInfo = [];
let generationLevelSymInfo = [];
generationLevelSymInfo.push([1]);
variantGenerationSymInfo.push(generationLevelSymInfo);

function getListValue(): number {
    const generationSelect: HTMLSelectElement = document.getElementById('generationListan') as HTMLSelectElement;
    const returnValdGeneration: string = generationSelect.options[generationSelect.selectedIndex].value;
    return Number(returnValdGeneration);
}

function drawShapes(): void {

    const valdGeneration: number = getListValue();

    let shapesArray = variantGeneration[valdGeneration - 1];
    let symmetryArray = variantGenerationSymInfo[valdGeneration - 1];

    view.drawPolyomino(shapesArray, symmetryArray);

}



function starta(): void {
    tick();
    let fluffTecken = 0;


    let generationLevel = [];
    let generationLevelSymInfo = [];
    let generationLevelPolyomino = [];
    //att j�mf�ra med alla p� den f�reg�ende niv�n
    for (let v: number = 0; v < variantGeneration[variantGeneration.length - 1].length; v++) {//inre loop
        let paddedMatrix = createPaddedMatrix(variantGeneration[variantGeneration.length - 1][v], 0);
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
                        if (generationLevel.length == 0) {
                            let matrixToStore = removePaddingFromMatrix(paddedMatrix, 0);

                            generationLevel.push(matrixToStore);
                            generationLevelSymInfo.push(calculateSymmetry(matrixToStore));

                        }
                        else {
                            //j�mf�ra med alla p� befintlig generation level
                            let hittarMatchning: boolean = false;
                            let matrixToCompare = removePaddingFromMatrix(paddedMatrix, 0);
                            for (let h: number = 0; h < generationLevel.length; h++) {
                                hittarMatchning = matricesAreEqualIfFlipedOrRotated(generationLevel[h], matrixToCompare);
                                if (hittarMatchning) { break; }//om den redan fanns kan man avbryta
                            }
                            if (!hittarMatchning) {//sparar om det inte finns n�n matchning
                                let theSymmetryNumber = calculateSymmetry(matrixToCompare);

                                // om den �r enkelt symetrisk kring x-axeln eller kring 135 
                                // grader roteras den 90 grader innan den sparas.
                                if (theSymmetryNumber == 2 || theSymmetryNumber == 4) {
                                    //generationLevel.push(roteraMatrisMoturs90(matrixToCompare));
                                    generationLevel.push(rotate90CounterClockwise(matrixToCompare));
                                    generationLevelSymInfo.push(theSymmetryNumber);
                                }
                                else {
                                    generationLevel.push(matrixToCompare);
                                    generationLevelSymInfo.push(theSymmetryNumber);
                                }
                            }

                        }
                        paddedMatrix[z][d] = fluffTecken; //�terst�ller fluffadMatris f�r att �teranv�nda
                    }
                }
            }
        }
    }//inre loop slut		

    variantGeneration.push(generationLevel);
    variantGenerationSymInfo.push(generationLevelSymInfo);


    const generationSelect: HTMLSelectElement = document.getElementById('generationListan') as HTMLSelectElement;
    generationSelect.options[generationSelect.options.length] =
        new Option(variantGeneration.length.toString(), String(variantGeneration.length));

    //select the added value in the list
    generationSelect.selectedIndex = variantGeneration.length - 1;
    //note how long it took to calculate

    const timePassed: string = tock();
    //console.log("f�rdigber�knat generation "+variantGeneration.length+" ("+generationLevel.length+" st)"+" tids�tg�ng: "+timePassed);
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
    document.getElementById('antalText').innerHTML = variantGeneration[getListValue() - 1].length + '';
    //hur l�ng tid ber�kningen tog
    document.getElementById('cost').innerHTML = calculationTime[getListValue() - 1];


}

