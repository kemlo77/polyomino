import { Observer } from './Observer';
import { Polyomino } from './Polyomino';
import { Subject } from './Subject';

export class Model implements Subject {


    private _polyominoSizeGroups: Polyomino[][];
    private _calculationTime: string[];
    private startMeasuredTime: number = 0;
    private _observers: Observer[] = [];

    constructor() {
        this._polyominoSizeGroups = [[Polyomino.smallestPolyomino()]];
        this._calculationTime = ['0s'];

    }

    public attachObserver(observer: Observer): void {
        if (this._observers.includes(observer)) {
            return;
        }
        this._observers.push(observer);
    }

    notify(): void {
        this._observers.forEach(observer => observer.update());
    }

    generateNextPolyominoSizeGroup(): void {
        this.tick();
        const foundPolyominosOfCurrentSize: Polyomino[] = [];
        this._polyominoSizeGroups[this._polyominoSizeGroups.length - 1]
            .forEach(currentSizePolyomino => {
                currentSizePolyomino
                    .generateNextSizePolyominosFromThis()
                    .forEach(nextSizePolyomino => {
                        const alreadyFound: boolean = foundPolyominosOfCurrentSize.some(foundPolyomino =>
                            nextSizePolyomino.isEqualToOtherIfFlippedAndOrRotaded(foundPolyomino));
                        if (!alreadyFound) {
                            foundPolyominosOfCurrentSize.push(nextSizePolyomino);
                        }
                    });
            });

        this._polyominoSizeGroups.push(foundPolyominosOfCurrentSize);
        this._calculationTime.push(this.tock());

        this.notify();
    }


    get largestGeneratedSizeGroup(): Polyomino[] {
        return this._polyominoSizeGroups[this._polyominoSizeGroups.length - 1];
    }

    getNumberOfGeneratedSizeGroups(): number {
        return this._polyominoSizeGroups.length;
    }

    getAllPolyominosWithSize(size: number): Polyomino[] {
        return this._polyominoSizeGroups[size - 1];
    }

    getTimeConsumedForGroupWithSize(size: number): string {
        return this._calculationTime[size - 1];
    }


    private tick(): void {
        const tempD: Date = new Date();
        this.startMeasuredTime = tempD.getTime();
    }

    private tock(): string {
        const tempD: Date = new Date();
        let returString: string = '';
        const passedTime: number = (tempD.getTime() - this.startMeasuredTime) / 1000;
        if (passedTime > 60) {
            returString = (passedTime - passedTime % 60) / 60 + 'm ' + Math.round(passedTime % 60) + 's';
        }
        else {
            returString = passedTime + 's';
        }
        return returString;
    }

}

