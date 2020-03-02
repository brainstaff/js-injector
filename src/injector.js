/**
 * Dependency injection container.
 */
class Injector {
  constructor(disableOutput = false) {
    this.disableOutput = disableOutput;
    this.components = {
      injector: this,
    };
  }

  /**
   * Registers prepared component or constructor.
   * @param name Name of the component.
   * @param definition Component definition prepared by "as" functions.
   */
  register(name, definition) {
    if (!this.disableOutput) {
      console.log(
        `[${new Date()}]`,
        `[Injector]`,
        `Registering '${name}' component.`
      );
    }
    this.components[name] = definition;
  }

  /**
   * Resolves constructor into prepared component.
   * @param constructor Prepared component or constructor.
   * @param params Parameters for directly provided constructor.
   * @returns {*}
   */
  resolve(constructor, params) {
    // If we have a definition
    if (typeof constructor === "string" && this.components[constructor]) {
      const definition = this.components[constructor];
      if (definition.type === "class") {
        const dependencies = {};
        if (definition.class.prototype && definition.class.prototype.dependencies) {
          definition.class.prototype.dependencies.forEach((dependency) => {
            if (this.components[dependency] === undefined) {
              throw `Cannot resolve '${dependency}' dependency.`;
            }
            dependencies[dependency] = this.resolve(dependency);
          });
        }
        return new definition.class(dependencies, definition.params);
      }
      if (typeof definition === "object" && definition.type === "function") {
        return definition.function.call(null, definition.params);
      }
      if (typeof definition === "object" && definition.type === "value") {
        return definition.value;
      }
    }
    // If constructor is a function resolving it
    if (typeof constructor === "function") {
      const dependencies = {};
      if (constructor.prototype.dependencies) {
        constructor.prototype.dependencies.forEach((dependency) => {
          if (this.components[dependency] === undefined) {
            throw `Cannot resolve '${dependency}' dependency.`;
          }
          dependencies[dependency] = this.resolve(dependency);
        });
      }
      return new constructor(dependencies, params);
    }
    throw `Cannot resolve dependency.`;
  }
}

/**
 * Prepares definition of the function which generates instance.
 * @param _function Function which generates the instance.
 * @param params Params for the function.
 * @returns {{function: *, type: string, params: *}}
 */
export function asFunction(_function, params) {
  return {
    type: "function",
    function: _function,
    params
  };
}

/**
 * Prepares definition of the class.
 * @param _class Class to be resolved.
 * @param params Params for the constructor.
 * @returns {{type: string, params: *, class: *}}
 */
export function asClass(_class, params) {
  return {
    type: "class",
    class: _class,
    params
  };
}

/**
 * Prepares definition of already resolved value.
 * @param value Value to return.
 * @returns {{type: string, value: *}}
 */
export function asValue(value) {
  return {
    type: "value",
    value
  };
}

export default Injector;
