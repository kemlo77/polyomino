export class Timer {

    private startInstant: Date;

    constructor() {
        this.startInstant = new Date();
    }

    public static startNewTimer(): Timer {
        return new Timer();
    }

    public stopTimerAndGetTimePassed(): string {
        const stopInstant: Date = new Date();
        const passedSeconds: number = (stopInstant.getTime() - this.startInstant.getTime()) / 1000;
        if (passedSeconds > 60) {
            return (passedSeconds - passedSeconds % 60) / 60 + 'm ' + Math.round(passedSeconds % 60) + 's';
        }
        return passedSeconds + 's';

    }

}