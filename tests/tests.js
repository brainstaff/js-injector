import assert from "assert";
import { describe, it } from "mocha";

import Injector from "../dist/injector";
import { asClass, asValue } from "../dist/injector";

describe("Injector", () => {
  it("should be able to instantiate from direct class", () => {
    const injector = new Injector(true);

    class A {
      constructor() {
        this.ClassA = true;
      }
    }

    const a1 = injector.resolve(A);
    const a2 = injector.resolve(A);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(a1)), { ClassA: true });
    assert.notEqual(a2, a1);
  });

  it("should be able to instantiate from direct function", () => {
    const injector = new Injector(true);

    function A() {
      this.ClassA = true;
    }

    const a1 = injector.resolve(A);
    const a2 = injector.resolve(A);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(a1)), { ClassA: true });
    assert.notEqual(a2, a1);
  });

  it("should be able to instantiate registered class", () => {
    const injector = new Injector(true);

    class A {
      constructor() {
        this.ClassA = true;
      }
    }

    injector.register('A', asClass(A));
    const a1 = injector.resolve('A');
    const a2 = injector.resolve('A');
    assert.deepStrictEqual(JSON.parse(JSON.stringify(a1)), { ClassA: true });
    assert.notEqual(a2, a1);

    function B() {
      this.ClassB = true;
    }

    injector.register('B', asClass(B));
    const b1 = injector.resolve('B');
    const b2 = injector.resolve('B');
    assert.deepStrictEqual(JSON.parse(JSON.stringify(b1)), { ClassB: true });
    assert.notEqual(b2, b1);
  });

  it("should provide specified values", () => {
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
        return [ "a" ];
      }
    }

    const injector = new Injector(true);
    injector.register("a", asValue(injector.resolve(A)));
    injector.register("b", asValue(injector.resolve(B)));

    const b1 = injector.resolve("b");
    const b2 = injector.resolve("b");

    assert.deepStrictEqual(JSON.parse(JSON.stringify(b1)), {
      a: {
        nameA: "A"
      },
      nameB: "B"
    });
    assert.equal(b1, b2);
  });

  it("should be able to bind class and instantiate it", () => {
    class A {
      constructor() {
        this.ClassA = true;
      }
    }

    class B {
      constructor(dependencies) {
        this.ClassB = true;
        Object.assign(this, dependencies);
      }

      get dependencies() {
        return [ "A" ]
      }
    }

    const injector = new Injector(true);
    injector.register("A", asClass(A));
    injector.register("B", asClass(B));

    const b1 = injector.resolve("B");
    const b2 = injector.resolve("B");
    assert.deepStrictEqual(JSON.parse(JSON.stringify(b1)), {
      A: {
        ClassA: true
      },
      ClassB: true
    });
    assert.notEqual(b1, b2);
  });

  it("should be able to resolve shared instance", () => {
    class A {
      constructor() {
        this.ClassA = true;
      }
    }

    class B {
      constructor(dependencies) {
        this.ClassB = true;
        Object.assign(this, dependencies);
      }

      get dependencies() {
        return [ "a" ]
      }
    }

    const injector = new Injector(true);
    injector.register("a", asValue(injector.resolve(A)));
    injector.register("B", asClass(B));

    const b1 = injector.resolve("B");
    const b2 = injector.resolve("B");
    assert.deepStrictEqual(JSON.parse(JSON.stringify(b1)), {
      a: {
        ClassA: true
      },
      ClassB: true
    });
    assert.notEqual(b1, b2);
    assert.equal(b1.a, b2.a);
  });

  it("should provide specified dependencies (prototypes)", () => {
    const A = function () {
      this.nameA = "A";
    };
    A.prototype.dependencies = [];

    const B = function (dependencies) {
      this.nameB = "B";
      Object.assign(this, dependencies);
    };
    B.prototype.dependencies = [ "a" ];

    const injector = new Injector(true);
    injector.register("a", asClass(A));
    injector.register("b", asClass(B));

    const b = injector.resolve("b");

    assert.deepStrictEqual(JSON.parse(JSON.stringify(b)), {
      a: {
        nameA: "A"
      },
      nameB: "B"
    });
  });
});