import { Observer } from './Observer';

export interface Subject {
    attachObserver(observer: Observer): void;

    notify(): void;
}