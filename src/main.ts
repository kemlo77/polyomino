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

document.getElementById('startButton').addEventListener('click', () => starta());
document.getElementById('plusButton').addEventListener('click', () => plusKvadratBredd());
document.getElementById('minusButton').addEventListener('click', () => minusKvadratBredd());
document.getElementById('generationListan').addEventListener('change', () => listChange());

let WIDTH;
let HEIGHT;
let kvadratBredd = 3;
let variantGeneration = new Array();
let generationLevel = new Array();
let startMatris = new Array();
let calculationTime = new Array();
calculationTime.push("0s");
startMatris.push([1]);
generationLevel.push(startMatris);
variantGeneration.push(generationLevel);
let startMeasuredTime: number = 0;

let variantGenerationSymInfo = new Array();
let generationLevelSymInfo = new Array();
generationLevelSymInfo.push([1]);
variantGenerationSymInfo.push(generationLevelSymInfo);

function getListValue(): number {
    const generationSelect: HTMLSelectElement = document.getElementById('generationListan') as HTMLSelectElement;
    const returnValdGeneration: string = generationSelect.options[generationSelect.selectedIndex].value;
    return Number(returnValdGeneration);
}

function drawShapes(): void {

    const valdGeneration: number = getListValue();

    //arrayen som formerna ligger i
    let shapesArray = variantGeneration[valdGeneration - 1];
    //arrayen som talar om vilken symmetri formen har
    let symmetryArray = variantGenerationSymInfo[valdGeneration - 1];

    let vitKant = 0;
    let offset_x = kvadratBredd;
    let offset_y = kvadratBredd;
    //max h�jd f�r aktuel rad. Anv�nds f�r att ekonomisera utrymmet
    let maxShapeHeight = 0;


    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    // tar omr�det som kan ritas ut p�
    HEIGHT = canvas.offsetHeight;
    WIDTH = canvas.offsetWidth;
    if (canvas.getContext) {

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = 'rgba(170,170,170,1)';
        ctx.save();
        ctx.translate(offset_x, offset_y);

        //f�r alla shapes (att rita ut)
        for (let z: number = 0; z < shapesArray.length; z++) {
            const formen = shapesArray[z];
            ctx.fillStyle = getFillStyle(symmetryArray[z]);


            //if(symmetryArray[z]!==0){
            //ritar ut 
            for (let i: number = 0; i < formen.length; i++) {
                //sparar max antal kvadrater p� h�jden
                if (formen.length > maxShapeHeight) { maxShapeHeight = formen.length; }
                //ritar ut alla bitar
                for (let j: number = 0; j < formen[0].length; j++) {
                    if (formen[i][j] > 0) {
                        ctx.fillRect(j * kvadratBredd, i * kvadratBredd, kvadratBredd - vitKant, kvadratBredd - vitKant);
                    }
                }

            }
            //om bredden �r n�dd till h�ger. s� ska det bli en ny rad
            offset_x += (formen[0].length + 1) * kvadratBredd;
            if (offset_x > WIDTH - (formen[0].length + 1) * kvadratBredd) {
                offset_x = kvadratBredd;
                offset_y += (maxShapeHeight + 1) * kvadratBredd;
                maxShapeHeight = 0;

            }
            //}

            ctx.restore();
            ctx.save();
            ctx.translate(offset_x, offset_y);
        }
        ctx.restore();
    }
}


function getFillStyle(symmetryNumber: number): string {
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
            return 'rgba(255,204,102,1)';
        case 63:
            return 'rgba(136,204,204,1)';
        default:
            return 'rgba(0,0,255,1)';
    }
}


function starta(): void {
    tick();
    let fluffTecken = 0;


    let generationLevel = new Array();
    let generationLevelSymInfo = new Array();
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
                            //console.log("l�gger till ny 1");
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
                                generationLevelSymInfo.push(theSymmetryNumber);
                                // om den �r enkelt symetrisk kring x-axeln eller kring 135 
                                // grader roteras den 90 grader innan den sparas.
                                if (theSymmetryNumber == 2 || theSymmetryNumber == 4) {
                                    //generationLevel.push(roteraMatrisMoturs90(matrixToCompare));
                                    generationLevel.push(rotate90CounterClockwise(matrixToCompare));
                                }
                                else { generationLevel.push(matrixToCompare); }
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











function minusKvadratBredd(): void {
    if (kvadratBredd > 1) {
        kvadratBredd--;
    }
    drawShapes();
}

function plusKvadratBredd(): void {
    if (kvadratBredd < 40) {
        kvadratBredd++;
    }
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
    drawShapes();
    //antal delar
    document.getElementById('delar').innerHTML = getListValue() + '';
    //uppdaterar med antal
    document.getElementById('antalText').innerHTML = variantGeneration[getListValue() - 1].length + '';
    //hur l�ng tid ber�kningen tog
    document.getElementById('cost').innerHTML = calculationTime[getListValue() - 1];


}

