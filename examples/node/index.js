const Injector = require('@brainstaff/injector').default;
const { asClass, asValue } = require('@brainstaff/injector');

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
injector.register('b', asClass(B));
const b = injector.resolve("b");

console.log(b);