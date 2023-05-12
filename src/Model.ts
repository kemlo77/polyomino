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

    generateNextPolyominoSize(): void {
        const timer: Timer = Timer.startNewTimer();
        const foundPolyominosOfNewSize: Polyomino[] = [];
        const largestSizeGroup: Polyomino[] = this._polyominoSizeGroups[this._polyominoSizeGroups.length - 1];

        largestSizeGroup
            .forEach((currentSizePolyomino, index) => {
                currentSizePolyomino
                    .generateNextSizePolyominosFromThis()
                    .forEach(nextSizePolyomino => {
                        const alreadyFound: boolean = foundPolyominosOfNewSize.some(foundPolyomino =>
                            nextSizePolyomino.isEqualToOtherIfFlippedAndOrRotaded(foundPolyomino));
                        if (!alreadyFound) {
                            foundPolyominosOfNewSize.push(nextSizePolyomino);
                        }
                    });
            });

        this._polyominoSizeGroups.push(foundPolyominosOfNewSize);
        this._calculationTime.push(timer.stopTimerAndGetTimePassed());

        this.notify();
    }


    get largestGeneratedSize(): Polyomino[] {
        return this._polyominoSizeGroups[this._polyominoSizeGroups.length - 1].slice();
    }

    getLargestGeneratedSize(): number {
        return this._polyominoSizeGroups.length;
    }

    getAllPolyominosWithSize(size: number): Polyomino[] {
        return this._polyominoSizeGroups[size - 1].slice();
    }

    getTimeConsumedForGeneratingSize(size: number): string {
        return this._calculationTime[size - 1];
    }




}

