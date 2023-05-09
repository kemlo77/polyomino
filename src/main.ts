import { Model } from './Model';
import { View } from './View';
import './style.css';



const model: Model = new Model();
const view: View = new View(model);

document.getElementById('startButton').addEventListener('click', () => generateNextSizeGroup());
document.getElementById('plusButton').addEventListener('click', () => view.increaseCellSize());
document.getElementById('minusButton').addEventListener('click', () => view.decreaseCellSize());
const generationSelect: HTMLSelectElement = document.getElementById('generationListan') as HTMLSelectElement;
//generationSelect.addEventListener('change', () => listChange());




function getListValue(): number {
    const returnValdGeneration: string = generationSelect.options[generationSelect.selectedIndex].value;
    return Number(returnValdGeneration);
}

function addValueToSelect(size: number): void {
    generationSelect.options[generationSelect.options.length] = new Option(String(size), String(size));
    //select the added value in the list
    generationSelect.selectedIndex = size - 1;
}


function generateNextSizeGroup(): void {
    const sizeGroupGenerated: number = model.generateNextPolyominoSizeGroup();

    addValueToSelect(sizeGroupGenerated);
    view.displayInfo(sizeGroupGenerated);
    view.drawLargestSizeGroup(sizeGroupGenerated);
}

