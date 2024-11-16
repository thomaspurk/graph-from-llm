/**
 * @file Functions for creating JSON-LD formated ontologies which can be opened by Protege.
 * @todo convert to class with a constructor since not all properties will be statice
 */
const propComment = "http://www.w3.org/2000/01/rdf-schema#comment";
const propSubClassOf = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
const propLabel = "http://www.w3.org/2000/01/rdf-schema#label";
const propDomain = "http://www.w3.org/2000/01/rdf-schema#domain";
const propRange = "http://www.w3.org/2000/01/rdf-schema#range";

const typeOntology = "http://www.w3.org/2002/07/owl#Ontology";
const typeClass = "http://www.w3.org/2002/07/owl#Class";
const typeObjectProp = "http://www.w3.org/2002/07/owl#ObjectProperty";

const illegalChars = `<>#%^{}|"\`\\`;

export class ontologyBuilderModule {
  arrOntology = [];
  namespace = "";

  constructor(namespace) {
    this.namespace = namespace;
    this.arrOntology.push({
      "@id": namespace,
      "@type": [typeOntology],
    });
  }
  /**
   * @function newClass Creates a class object
   * @param {string} value
   */
  newClass(value) {
    let returnObject = {};
    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = this.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        returnObject["@id"] = this.namespace + "#" + value;
        this.appendType(returnObject, typeClass);
      } else {
        throw (
          new Exception(
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
        new Exception(
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
   * @function newClass Creates an Object Propert object
   * @param {string} value
   */
  newObjectProperty(value) {
    let returnObject = {};
    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = this.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        returnObject["@id"] = this.namespace + "#" + value;
        this.appendType(returnObject, typeObjectProp);
      } else {
        throw (
          new Exception(
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
        new Exception(
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
   * @param {object} entity
   * @param {string} value
   */
  appendType(entity, value) {
    // Short hand property for comments
    const prop = "@type";
    // Ensure the value input is a string
    if (typeof value != "string") {
      throw (
        new Exception(
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
      throw new Exception(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendComment Adds the value to the the comments array, as an object, of the entity
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   */
  appendComment(entity, value, language = "en") {
    // Short hand property for comments
    const prop = propComment;

    // Ensure the value input is a string
    if (typeof value == "string") {
      value = { "@language": language, "@value": value };
    } else {
      throw (
        new Exception(
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
      throw new Exception(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendLabel Adds the value to the the label array, as an object, of the entity
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   */
  appendLabel(entity, value, language = "en") {
    // Short hand property for comments
    const prop = propLabel;

    // Ensure the value input is a string
    if (typeof value == "string") {
      value = { "@language": language, "@value": value };
    } else {
      throw (
        new Exception(
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
      throw new Exception(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendSubClassOf Adds the value to the the label array, as an object, of the entity
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   */
  appendSubClassOf(entity, value) {
    // Short hand property for comments
    const prop = propSubClassOf;

    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = this.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        value = { "@id": this.namespace + "#" + value };
      } else {
        throw (
          new Exception(
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
        new Exception(
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
      throw new Exception(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendDomain Adds the value to the domain array, as an object, of the entity
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   */
  appendDomain(entity, value) {
    // Short hand property for comments
    const prop = propDomain;

    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = this.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        value = { "@id": this.namespace + "#" + value };
      } else {
        throw (
          new Exception(
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
        new Exception(
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
      throw new Exception(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function appendRange Adds the value to the range array, as an object, of the entity
   * @param {object} entity
   * @param {string} value
   * @param {string} language
   */
  appendRange(entity, value) {
    // Short hand property for comments
    const prop = propRange;

    // Ensure the value input is a string
    if (typeof value == "string") {
      // Test for Illegal Characters
      const illegalChars = this.hasIllegalCharacters(value);
      if (illegalChars.length == 0) {
        // Clean up spaces and create an object storing the value
        value = value.replace(/\s+/g, "_");
        value = { "@id": this.namespace + "#" + value };
      } else {
        throw (
          new Exception(
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
        new Exception(
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
      throw new Exception(
        "Malformated Input: Property " +
          prop +
          " must be type array or undefined. Recieved " +
          JSON.stringify(entity)
      );
    }
  }

  /**
   * @function hasIllegalCharacters Tests a string for characters that are not allowed in an ontology entity name.
   * @param {string} value The input string to test.
   * @returns An array of illegal characters found in the string, empty array means no illegal characters
   * @todo Move "illegalChars" to a .env file
   * @todo Create unit tests
   * @todo Add error trapping and logging
   * @todo Add code comments
   * @todo Validate type of "value"
   */
  hasIllegalCharacters(value) {
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
