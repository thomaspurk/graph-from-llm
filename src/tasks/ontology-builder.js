/**
 * @file Functions for creating JSON-LD formated ontologies which can be opened by Protege.
 * @todo convert to class with a constructor since not all properties will be statice
 */

const illegalChars = `<>#%^{}|"\`\\`;

export class ontologyBuilderModule {
  // Class Static Properties
  static propComment = "http://www.w3.org/2000/01/rdf-schema#comment";
  static propSubClassOf = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
  static propLabel = "http://www.w3.org/2000/01/rdf-schema#label";
  static propDomain = "http://www.w3.org/2000/01/rdf-schema#domain";
  static propRange = "http://www.w3.org/2000/01/rdf-schema#range";

  static typeOntology = "http://www.w3.org/2002/07/owl#Ontology";
  static typeClass = "http://www.w3.org/2002/07/owl#Class";
  static typeObjectProp = "http://www.w3.org/2002/07/owl#ObjectProperty";

  // Class Instance Properties
  arrOntology = [];
  namespace = "";

  constructor(namespace) {
    this.namespace = namespace;
    this.arrOntology.push({
      "@id": namespace,
      "@type": [ontologyBuilderModule.typeOntology],
    });
  }
  /**
   * @function newClass Creates a class object
   * @param {string} value
   * @return {onbject}
   * @memberof ontologyBuilderModule
   */
  newClass(value) {
    let returnObject = {};
    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = ontologyBuilderModule.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        // Format the value: Upper Case
        value = value.replace(/\b\w/g, (c) => c.toUpperCase());
        returnObject["@id"] = this.namespace + "#" + value;
        ontologyBuilderModule.appendType(returnObject, ontologyBuilderModule.typeClass);
      } else {
        throw (
          new Error(
            "Malformated Input: class name '" +
              value +
              "' contains illegal characters: " +
              JSON.stringify(illegalChars)
          ) +
          " as type " +
          typeof value
        );
      }
    } else {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }

    // add the object to the ontology array
    this.arrOntology.push(returnObject);

    return returnObject;
  }

  /**
   * @function newObjectProperty Creates an Object Propert object
   * @param {string} value
   * @return {onbject}
   * @memberof ontologyBuilderModule
   */
  newObjectProperty(value) {
    let returnObject = {};
    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = ontologyBuilderModule.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        // Format the value: Upper Case
        value = value.replace(/\b\w/g, (c) => c.toUpperCase());
        returnObject["@id"] = this.namespace + "#" + value;
        ontologyBuilderModule.appendType(
          returnObject,
          ontologyBuilderModule.typeObjectProp
        );
      } else {
        throw (
          new Error(
            "Malformated Input: Object Property name '" +
              value +
              "' contains illegal characters: " +
              JSON.stringify(illegalChars)
          ) +
          " as type " +
          typeof value
        );
      }
    } else {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }
    // add the object to the ontology array
    this.arrOntology.push(returnObject);
    return returnObject;
  }

  /**
   * @function appendType Adds the value to the type array of the entity
   * @static
   * @param {object} entity
   * @param {string} value
   * @memberof ontologyBuilderModule
   */
  static appendType(entity, value) {
    // Short hand property for comments
    const prop = "@type";
    // Ensure the value input is a string
    if (typeof value != "string") {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }

    // Ensure that the object's comment property is an array or undefined
    if (entity[prop] && Array.isArray(entity[prop])) {
      entity[prop].push(value);
    } else if (entity[prop] == undefined) {
      entity[prop] = [value];
    } else {
      throw new Error(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendComment Adds the value to the the comments array, as an object, of the entity
   * @static
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   * @memberof ontologyBuilderModule
   */
  static appendComment(entity, value, language = "en") {
    // Short hand property for comments
    const prop = ontologyBuilderModule.propComment;

    // Ensure the value input is a string
    if (typeof value == "string") {
      value = { "@language": language, "@value": value };
    } else {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }

    // Ensure that the object's comment property is an array or undefined
    if (entity[prop] && Array.isArray(entity[prop])) {
      entity[prop].push(value);
    } else if (entity[prop] == undefined) {
      entity[prop] = [value];
    } else {
      throw new Error(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendLabel Adds the value to the the label array, as an object, of the entity
   * @static
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   * @memberof ontologyBuilderModule
   */
  static appendLabel(entity, value, language = "en") {
    // Short hand property for labels
    const prop = ontologyBuilderModule.propLabel;

    // Ensure the value input is a string
    if (typeof value == "string") {
      // Format the value: Upper Case
      value = value.replace(/\b\w/g, (c) => c.toUpperCase());
      value = { "@language": language, "@value": value };
    } else {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }

    // Ensure that the object's labels property is an array or undefined
    if (entity[prop] && Array.isArray(entity[prop])) {
      entity[prop].push(value);
    } else if (entity[prop] == undefined) {
      entity[prop] = [value];
    } else {
      throw new Error(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendSubClassOf Adds the value to the the label array, as an object, of the entity. Not static because it depends on the namepace of the class instance.
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   * @memberof ontologyBuilderModule
   */
  appendSubClassOf(entity, value) {
    // Short hand property for comments
    const prop = ontologyBuilderModule.propSubClassOf;

    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = ontologyBuilderModule.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        // Format the value: Upper Case
        value = value.replace(/\b\w/g, (c) => c.toUpperCase());
        value = { "@id": this.namespace + "#" + value };
      } else {
        throw (
          new Error(
            "Malformated Input: subclass name '" +
              value +
              "' contains illegal characters: " +
              JSON.stringify(illegalChars)
          ) +
          " as type " +
          typeof value
        );
      }
    } else {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }

    // Ensure that the object's subClassOf property is an array or undefined
    if (entity[prop] && Array.isArray(entity[prop])) {
      entity[prop].push(value);
    } else if (entity[prop] == undefined) {
      entity[prop] = [value];
    } else {
      throw new Error(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendDomain Adds the value to the domain array, as an object, of the entity. Not static because it depends on the namepace of the class instance.
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   * @memberof ontologyBuilderModule
   */
  appendDomain(entity, value) {
    // Short hand property for comments
    const prop = ontologyBuilderModule.propDomain;

    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = ontologyBuilderModule.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        // Format the value: Upper Case
        value = value.replace(/\b\w/g, (c) => c.toUpperCase());
        value = { "@id": this.namespace + "#" + value };
      } else {
        throw (
          new Error(
            "Malformated Input: domain name '" +
              value +
              "' contains illegal characters: " +
              JSON.stringify(illegalChars)
          ) +
          " as type " +
          typeof value
        );
      }
    } else {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }

    // Ensure that the object's domain property is an array or undefined
    if (entity[prop] && Array.isArray(entity[prop])) {
      entity[prop].push(value);
    } else if (entity[prop] == undefined) {
      entity[prop] = [value];
    } else {
      throw new Error(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendRange Adds the value to the range array, as an object, of the entity. Not static because it depends on the namepace of the class instance.
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   * @memberof ontologyBuilderModule
   */
  appendRange(entity, value) {
    // Short hand property for comments
    const prop = ontologyBuilderModule.propRange;

    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = ontologyBuilderModule.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        // Format the value: Upper Case
        value = value.replace(/\b\w/g, (c) => c.toUpperCase());
        value = { "@id": this.namespace + "#" + value };
      } else {
        throw (
          new Error(
            "Malformated Input: range name '" +
              value +
              "' contains illegal characters: " +
              JSON.stringify(illegalChars)
          ) +
          " as type " +
          typeof value
        );
      }
    } else {
      throw (
        new Error(
          "Malformated Input: 'value' must be a string. Received " + JSON.stringify(value)
        ) +
        " as type " +
        typeof value
      );
    }

    // Ensure that the object's domain property is an array or undefined
    if (entity[prop] && Array.isArray(entity[prop])) {
      entity[prop].push(value);
    } else if (entity[prop] == undefined) {
      entity[prop] = [value];
    } else {
      throw new Error(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function hasIllegalCharacters Tests a string for characters that are not allowed in an ontology entity name.
   * @static
   * @param {string} value The input string to test.
   * @returns {Array} An array of illegal characters found in the string, empty array means no illegal characters
   * @memberof ontologyBuilderModule
   * @todo Move "illegalChars" to a .env file
   * @todo Create unit tests
   * @todo Add error trapping and logging
   * @todo Add code comments
   * @todo Validate type of "value"
   */
  static hasIllegalCharacters(value) {
    let returnArray = [];
    const illegalChars = `<>#%^{}|"\`\\`;
    const arrayChars = illegalChars.split("");
    arrayChars.forEach((char) => {
      if (value.includes(char)) {
        returnArray.push(char);
      }
    });
    return returnArray;
  }
}
