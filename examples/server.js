const Injector = require('../dist/injector.js').default;
const { asClass, asValue } = require('../dist/injector.js');

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