import { SimpleChange } from 'angular2/core';
import { Observable, Observer } from 'rxjs/Rx';

export function makeObservableFunction<T>(target: any, functionName: string) {
    let observer: Observer<any>;
    const observable = Observable.create(obs => {
        observer = obs;
    });
    target[functionName] = function() {
        const len = arguments.length;
        if (len === 1) {
            observer.next(arguments[0]);
        } else {
            const args = new Array(len);
            for (let i = 0; i < len; i++) {
                args[i] = arguments[i];
            }
            observer.next(args);
        }
    }
    return observable;
}

export function observeCurrentValueFor<T>(changes$: Observable<{ [key: string]: SimpleChange }>, propertyName: string) {
    return changes$
        .filter(changes => !!changes[propertyName])
        .map<T>(changes => changes[propertyName].currentValue);
}

export function setFocus(elementRef) {
    setTimeout(() => {
        if (elementRef && elementRef.nativeElement) {
            elementRef.nativeElement.focus()
        }
    });
}
