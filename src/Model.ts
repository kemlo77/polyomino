import { Observer } from './Observer';
import { Polyomino } from './Polyomino';
import { Subject } from './Subject';
import { Timer } from './Timer';

export class Model implements Subject {


    private _polyominoSizeGroups: Polyomino[][];
    private _calculationTime: string[];
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
        const timer: Timer = Timer.startNewTimer();
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
        this._calculationTime.push(timer.stopTimerAndGetTimePassed());

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




}

