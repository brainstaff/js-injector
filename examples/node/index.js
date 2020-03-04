import Injector from '@brainstaff/injector';
import { asClass, asValue } from '@brainstaff/injector';

class A {
    constructor() {
        this.nameA = "A";
    }
    get dependencies() {
        return [];
    }
}

class B {
    constructor(dependencies) {
        Object.assign(this, dependencies);
        this.nameB = "B";
    }
    get dependencies() {
        return ['a'];
    }
}

const injector = new Injector();
injector.register('a', asValue(injector.resolve(A)));
injector.register('B', asClass(B));
const b = injector.resolve("B");

console.log(b);