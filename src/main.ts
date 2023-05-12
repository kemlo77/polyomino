import { Model } from './Model';
import { View } from './View';
import './style.css';



const model: Model = new Model();
const view: View = new View(model);
model.attachObserver(view);

document.getElementById('startButton').addEventListener('click', () => model.generateNextPolyominoSize());

window.addEventListener('load', () => view.updateBecauseWindowIsResized());
window.addEventListener('resize', () => view.delayedUpdateBecauseWindowIsResized());