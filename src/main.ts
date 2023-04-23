import './style.css';

document.getElementById('startButton').addEventListener('click', () => starta());

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
            let formen = shapesArray[z];


            //s�tt vilken f�rg som ska anv�ndas
            if (symmetryArray[z] == 0) {
                ctx.fillStyle = 'rgba(170,170,170,1)';
            }
            else {
                //om det �r en spegel-symmetrisk kring x- eller y-axeln
                if (symmetryArray[z] == 1 || symmetryArray[z] == 2) {
                    ctx.fillStyle = 'rgba(221,153,153,1)';
                }
                else {
                    //om spegel-symmetrisk kring diagonalerna
                    if (symmetryArray[z] == 4 || symmetryArray[z] == 8) {
                        ctx.fillStyle = 'rgba(170,221,170,1)';
                    }
                    else {
                        //rotations-symmetri (180)
                        if (symmetryArray[z] == 16) {
                            ctx.fillStyle = 'rgba(170,170,221,1)';
                        }
                        else {
                            if (symmetryArray[z] == 19) {
                                ctx.fillStyle = 'rgba(204,170,204,1)';
                            }
                            else {
                                if (symmetryArray[z] == 28) {
                                    ctx.fillStyle = 'rgba(255,153,119,1)';
                                }
                                else {
                                    if (symmetryArray[z] == 63) {
                                        ctx.fillStyle = 'rgba(136,204,204,1)';
                                    }
                                    else {
                                        if (symmetryArray[z] == 48) {
                                            ctx.fillStyle = 'rgba(255,204,102,1)';
                                        }
                                        else {
                                            ctx.fillStyle = 'rgba(0,0,255,1)';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }


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


function starta() {
    tick();
    let fluffTecken = 0;


    let generationLevel = new Array();
    let generationLevelSymInfo = new Array();
    //att j�mf�ra med alla p� den f�reg�ende niv�n
    for (let v: number = 0; v < variantGeneration[variantGeneration.length - 1].length; v++) {//inre loop
        let fluffadMatris = fluffaIn(variantGeneration[variantGeneration.length - 1][v]);
        //testa alla positioner f�r ny "kvadratdel"
        for (let z: number = 0; z < fluffadMatris.length; z++) {
            for (let d: number = 0; d < fluffadMatris[0].length; d++) {
                //om det �r en tom cell testar vi p� den
                if (fluffadMatris[z][d] == fluffTecken) {
                    //bara intressant att kolla om den har grannar
                    if (hasNeighbours(z, d, fluffadMatris)) {
                        //s�tter en tempor�r markering i rutan som kollas
                        fluffadMatris[z][d] = 1;
                        //om det inte finns N�T sparat f�r den leveln s� �r det bara att spara
                        if (generationLevel.length == 0) {
                            let matrixToStore = deFluffMatris(fluffadMatris);
                            generationLevel.push(matrixToStore);
                            generationLevelSymInfo.push(calculateSymmetry(matrixToStore));
                            //console.log("l�gger till ny 1");
                        }
                        else {
                            //j�mf�ra med alla p� befintlig generation level
                            let hittarMatchning: boolean = false;
                            let matrixToCompare = deFluffMatris(fluffadMatris);
                            for (let h: number = 0; h < generationLevel.length; h++) {
                                hittarMatchning = compareMatrix(generationLevel[h], matrixToCompare);
                                if (hittarMatchning) { break; }//om den redan fanns kan man avbryta
                            }
                            if (!hittarMatchning) {//sparar om det inte finns n�n matchning
                                let theSymmetryNumber = calculateSymmetry(matrixToCompare);
                                generationLevelSymInfo.push(theSymmetryNumber);
                                // om den �r enkelt symetrisk kring x-axeln eller kring 135 
                                // grader roteras den 90 grader innan den sparas.
                                if (theSymmetryNumber == 2 || theSymmetryNumber == 4) {
                                    generationLevel.push(roteraMatrisMoturs90(matrixToCompare));
                                }
                                else { generationLevel.push(matrixToCompare); }
                            }
                            else {
                            }
                        }
                        fluffadMatris[z][d] = fluffTecken; //�terst�ller fluffadMatris f�r att �teranv�nda
                    }
                    else {
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

function compareMatrix(matris1, matris2) {
    //returnerar true om det finns en matchning
    let theyMatch: boolean = false;
    let tempCompMatrix = [];
    if ((matris1.length == matris2.length && matris1[0].length == matris2[0].length) || (matris1.length == matris2[0].length && matris2.length == matris1[0].length)) {
        //R1
        //console.log("boss");
        if (helpCompareMatrix(matris1, matris2)) { return true; }
        //L1
        matris2.reverse();
        if (helpCompareMatrix(matris1, matris2)) { return true; }
        matris2.reverse();//v�nder tillbaka
        //R2
        tempCompMatrix = roteraMatrisMedurs90(matris2);
        if (helpCompareMatrix(matris1, tempCompMatrix)) { return true; }
        //L2
        tempCompMatrix.reverse();
        if (helpCompareMatrix(matris1, tempCompMatrix)) { return true; }
        //R3
        tempCompMatrix = roteraMatris180(matris2);
        if (helpCompareMatrix(matris1, tempCompMatrix)) { return true; }
        //L3
        tempCompMatrix.reverse();
        if (helpCompareMatrix(matris1, tempCompMatrix)) { return true; }
        //R4
        tempCompMatrix = roteraMatrisMoturs90(matris2);
        if (helpCompareMatrix(matris1, tempCompMatrix)) { return true; }
        //L4
        tempCompMatrix.reverse();
        if (helpCompareMatrix(matris1, tempCompMatrix)) { return true; }

    }
    else {
        //console.log("olika stora")
    }
    //console.log("-----------------");
    //console.log("theyMatch: "+theyMatch);
    //consoleMatrix(matris1);
    //consoleMatrix(matris2);
    //console.log("-----------------");

    return theyMatch;
}

function helpCompareMatrix(helpMatris1, helpMatris2) {
    //console.log("help compare matrix");
    let doTheyMatch: boolean = true;
    //console.log("hejpa");
    if (helpMatris1.length == helpMatris2.length && helpMatris1[0].length == helpMatris2[0].length) {
        //outerLoopLabel:
        for (let r: number = 0; r < helpMatris1.length; r++) {
            for (let s: number = 0; s < helpMatris1[0].length; s++) {
                //console.log("outer: "+r+" inner: "+s);
                //if(helpMatris1[r][s]>0){tempvar1=1}
                //else{tempvar1=0}
                //if(helpMatris2[r][s]>0){tempvar2=1}
                //else{tempvar2=0}					
                if (helpMatris1[r][s] !== helpMatris2[r][s]) {
                    //if(helpMatris1[r][s]!==helpMatris2[r][s]){
                    //if(helpMatris1[r][s]==0||helpMatris2[r][s]==0){
                    //if(tempvar1!==tempvar2){
                    return false;
                    //break outerLoopLabel;
                }
            }
        }
    }
    else {
        doTheyMatch = false;
        //console.log("olika stora");
    }
    return doTheyMatch;
}

function hasNeighbours(row, column, matrix) {
    let itHasNeighbour: boolean = false;
    const fluffTecken: number = 0;
    //kollar upp�t
    if (row > 0) { if (matrix[row - 1][column] !== fluffTecken) { itHasNeighbour = true; } }
    //kollar ned�t
    if (row < matrix.length - 1) { if (matrix[row + 1][column] !== fluffTecken) { itHasNeighbour = true; } }
    //kollar v�nster
    if (column > 0) { if (matrix[row][column - 1] !== fluffTecken) { itHasNeighbour = true; } }
    //kollar h�ger
    if (column < (matrix[row].length - 1)) { if (matrix[row][column + 1] !== fluffTecken) { itHasNeighbour = true; } }
    return itHasNeighbour;
}

function deFluffMatris(matris) {
    const flufftecken: number = 0;
    let findsOneInFirstRow: boolean = false;
    let findsOneInLastRow: boolean = false;
    let findsOneInFirstColumn: boolean = false;
    let findsOneInLastColumn: boolean = false;
    //nya arrayen att l�gga till rader
    const unFluffedMatrix = new Array();

    //kollar f�rsta och sista raden
    for (let i: number = 0; i < matris[0].length; i++) {
        if (matris[0][i] !== flufftecken) { findsOneInFirstRow = true; }
        if (matris[matris.length - 1][i] !== flufftecken) { findsOneInLastRow = true; }
    }
    //man beh�ver ev inte ta h�nsyn till f�rsta och sista raden vid kopiering till nya matrisen
    let startNr: number = 1;
    let slutNr: number = matris.length - 1;
    if (findsOneInFirstRow) { startNr = 0; }
    if (findsOneInLastRow) { slutNr = matris.length; }

    //kollar f�rsta och sista kolumnen
    for (let k: number = startNr; k < slutNr; k++) {
        //console.log("letar i rad "+k);
        if (matris[k][0] !== flufftecken) { findsOneInFirstColumn = true; }
        if (matris[k][matris[k].length - 1] !== flufftecken) { findsOneInLastColumn = true; }
    }
    for (let n: number = startNr; n < slutNr; n++) {
        //nya kolumndelar till varje rad
        let unFluffedColumn = new Array();
        //f�rsta och sista kolumnen beh�ver ev inte kopieras med till nya matrisen
        let inreStartNr: number = 1;
        let inreSlutNr: number = matris[n].length - 1;
        if (findsOneInFirstColumn) { inreStartNr = 0; }
        if (findsOneInLastColumn) { inreSlutNr = matris[n].length; }
        for (let c: number = inreStartNr; c < inreSlutNr; c++) {
            unFluffedColumn.push(matris[n][c]);
        }
        unFluffedMatrix.push(unFluffedColumn);
    }
    return unFluffedMatrix;
}

function fluffaIn(matris) {
    const flufftecken: number = 0;
    let nymatris = new Array();
    for (let a: number = 0; a < matris.length + 2; a++) {
        let column = new Array();
        column.push(flufftecken);
        for (let b: number = 0; b < matris[0].length; b++) {
            //console.log("a"+a+"b"+b);
            if (a == 0 || a == (matris.length + 1)) {
                column.push(flufftecken);
            }
            else {
                column.push(matris[a - 1][b]);
            }
        }
        column.push(flufftecken);
        nymatris.push(column);
    }
    return nymatris;
}

function roteraMatrisMedurs90(matris) {
    //alert("hejpa");
    let nymatris = new Array();
    for (let a: number = 0; a < matris[0].length; a++) {
        let column = new Array();
        for (let b: number = matris.length - 1; b >= 0; b--) {
            column.push(matris[b][a]);
        }
        nymatris.push(column);
    }
    return nymatris;
}

function roteraMatrisMoturs90(matris) {
    let nymatris = new Array();
    for (let a: number = matris[0].length - 1; a >= 0; a--) {
        let column = new Array();
        for (let b: number = 0; b < matris.length; b++) {
            column.push(matris[b][a]);
        }
        nymatris.push(column);
    }
    return nymatris;
}

function roteraMatris180(matris) {
    let nymatris = new Array();
    //alert(matris.length+" asdf");
    for (let a: number = matris.length - 1; a >= 0; a--) {
        let column = new Array();
        for (let b: number = matris[a].length - 1; b >= 0; b--) {
            column.push(matris[a][b]);
        }
        nymatris.push(column);
    }
    return nymatris;
}

function alertMatrix(matris): void {
    let printString: string = 'matris:\n';
    for (let i: number = 0; i < matris.length; i++) {
        for (let j: number = 0; j < matris[i].length; j++) {
            printString += matris[i][j];
        }
        printString += '\n';
    }
    alert(printString);
}

function consoleMatrix(matris): void {
    let printString: string = 'matris:\n';
    for (let i: number = 0; i < matris.length; i++) {
        for (let j: number = 0; j < matris[i].length; j++) {
            printString += matris[i][j];
        }
        printString += '\n';
    }
    console.log(printString);
}

function diagonalReflectionSymmetry135(matris): boolean {
    if (matris.length == matris[0].length) {
        const isSymmetrical: boolean = true;
        for (let x: number = 1; x < matris.length; x++) {
            for (let y: number = 0; y < x; y++) {
                if (matris[x][y] !== matris[y][x]) { return false; }
            }
        }
        return isSymmetrical;
    }
    else { return false; }
}

function diagonalReflectionSymmetry45(matris): boolean {
    if (matris.length == matris[0].length) {
        const isSymmetrical: boolean = true;
        for (let x: number = 0; x < matris.length - 1; x++) {
            for (let y: number = 0; y < matris.length - 1 - x; y++) {
                if (matris[x][y] !== matris[matris.length - 1 - y][matris.length - 1 - x]) { return false; }
            }
        }
        return isSymmetrical;
    }
    else { return false; }
}

function yAxisSymmetry(matris): boolean {
    const isSymmetrical: boolean = true;

    for (let y: number = 0; y < Math.floor(matris[0].length / 2); y++) {
        for (let x: number = 0; x < matris.length; x++) {
            if (matris[x][y] !== matris[x][matris[0].length - 1 - y]) { return false; }
        }
    }
    return isSymmetrical;
}

function xAxisSymmetry(matris): boolean {
    const isSymmetrical: boolean = true;
    for (let x: number = 0; x < Math.floor(matris.length / 2); x++) {
        for (let y: number = 0; y < matris[0].length; y++) {
            if (matris[x][y] !== matris[matris.length - 1 - x][y]) { return false; }
        }
    }
    return isSymmetrical;
}

function rotationalSymmetryOfOrderTwo(matris): boolean {
    //if(matris.length==matris[0].length){
    const isSymmetrical: boolean = true;
    for (let x: number = 0; x < Math.ceil(matris.length / 2); x++) {
        for (let y: number = 0; y < matris[0].length; y++) {
            //if(matris[x][y]!==matris[matris.length-1-x][y]){return false;}
            if (matris[x][y] !== matris[matris.length - 1 - x][matris[0].length - 1 - y]) { return false; }
        }
    }
    return isSymmetrical;
    //}
    //else{return false;}
}

function rotationalSymmetryOfOrderFour(matris): boolean {
    if (matris.length == matris[0].length) {
        const isSymmetrical: boolean = true;
        for (let x: number = 0; x < Math.ceil(matris.length / 2); x++) {
            for (let y: number = 0; y < Math.ceil(matris[0].length / 2); y++) {
                //�vre h�gra
                if (matris[x][y] !== matris[y][matris[0].length - 1 - x]) { return false; }
                //nedre h�gra
                if (matris[x][y] !== matris[matris.length - 1 - x][matris[0].length - 1 - y]) { return false; }
                //nedre v�nstra
                if (matris[x][y] !== matris[matris.length - 1 - y][x]) { return false; }
            }
        }
        //consoleMatrix(matris);
        return isSymmetrical;
    }
    else { return false; }
}


function plusKvadratBredd(): void {
    if (kvadratBredd > 1) {
        kvadratBredd--;
    }
    drawShapes();
}

function minusKvadratBredd(): void {
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

