import { SimpleChange } from 'angular2/core';
import { Observable, Observer } from 'rxjs/Rx';

export function makeObservableFunction<T>(target: any, functionName: string) {
    let observer: Observer<any>;
    const observable = Observable.create(obs => {
        observer = obs;
    });
    target[functionName] = function(...args) { // leverage ES6 rest parameter to get all arguments passed to event
        if (args.length === 1) { // for single-arg event pass it directly into Observable to simplify handling ex: .map(e => e.target.value)
            observer.next(args[0]);
        } else { // for event with more arguments propagate those into Observable as an array, then to get single param you can destructure array ex: .map( ([e]) => e.target.value ) 
            observer.next(args);
        }
    };
    return observable;
}

export function observeCurrentValueFor<T>(changes$: Observable<{ [key: string]: SimpleChange }>, propertyName: string) {
    return changes$
        .filter(changes => changes.hasOwnProperty(propertyName)) // check if there are changes for propertyName (@Input) 
        .map<T>(changes => changes[propertyName].currentValue);
}

export function setFocus(elementRef) {
    setTimeout(() => {
        if (elementRef && elementRef.nativeElement) {
            elementRef.nativeElement.focus()
        }
    });
}
