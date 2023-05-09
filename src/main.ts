import { Model } from './Model';
import { View } from './View';
import './style.css';

document.getElementById('startButton').addEventListener('click', () => starta());
document.getElementById('plusButton').addEventListener('click', () => increaseSize());
document.getElementById('minusButton').addEventListener('click', () => decreaseSize());
const generationSelect: HTMLSelectElement = document.getElementById('generationListan') as HTMLSelectElement;
generationSelect.addEventListener('change', () => listChange());
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;


const view: View = new View(canvas);
const model: Model = new Model();

const calculationTime: string[] = [];
calculationTime.push('0s');
let startMeasuredTime: number = 0;





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

    view.drawPolyomino(model.largestGeneratedSizeGroup);

}



function starta(): void {
    tick();


    const sizeGroupGenerated: number = model.generateNextPolyominoSizeGroup();



    addValueToSelect(sizeGroupGenerated);

    //note how long it took to calculate
    const timePassed: string = tock();
    calculationTime.push(timePassed);

    //update info and repaint
    listChange();
    drawShapes();
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
    document.getElementById('antalText').innerHTML = model.getAllPolyominosWithSize(getListValue()).length + '';
    //hur l�ng tid ber�kningen tog
    document.getElementById('cost').innerHTML = calculationTime[getListValue() - 1];


}

