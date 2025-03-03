/**
 * @file Unit tests for functions in the ontology-builder.js file
 * @author Thomas J. Purk
 */

import { describe, expect, it } from "vitest";
import { ontologyBuilderModule } from "../tasks/ontology-builder.js";

const ontologyUri = "http://ontologies.purk.com/unit-tests";

describe("ontologyBuilderModule constructor()", () => {
  it("should create an object with the correct arrOntology and namespace properties", () => {
    // Arrange
    const expectedResult = [
      {
        "@id": ontologyUri,
        "@type": [ontologyBuilderModule.typeOntology],
      },
    ];

    // Act
    const result = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(result.arrOntology).toEqual(expectedResult);
    expect(result.namespace).toEqual(ontologyUri);
  });
});

describe("newClass()", () => {
  it("should create a new class object if a valid name is provided", () => {
    // Arrange
    const input = "Unit Test Class Name";
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
      "@type": [ontologyBuilderModule.typeClass],
    };

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    const result = ontologyBuilder.newClass(input);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(ontologyBuilder.arrOntology).toContainEqual(expectedResult);
  });
  it("should throw an error if name contains illegal chacters", () => {
    // Arrange
    const input = "Unit# Test% Class> Name<";
    const expectedResult = "contains illegal characters:";

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(() => ontologyBuilder.newClass(input)).toThrowError(expectedResult);
  });
  it("should throw an error name is not a string", () => {
    // Arrange
    const input = [];
    const expectedResult = "Malformated Input: 'value' must be a string. Received ";

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(() => ontologyBuilder.newClass(input)).toThrowError(expectedResult);
  });
});

describe("newOjectProperty()", () => {
  it("should create a new object propert object if a valid name is provided", () => {
    // Arrange
    const input = "Unit Test Object Property Name";
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Object_Property_Name",
      "@type": [ontologyBuilderModule.typeObjectProp],
    };

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    const result = ontologyBuilder.newObjectProperty(input);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(ontologyBuilder.arrOntology).toContainEqual(expectedResult);
  });
  it("should throw an error if name contains illegal chacters", () => {
    // Arrange
    const input = "Unit\\ Test` Object^ Property Name";
    const expectedResult = "contains illegal characters:";

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(() => ontologyBuilder.newObjectProperty(input)).toThrowError(expectedResult);
  });
  it("should throw an error name is not a string", () => {
    // Arrange
    const input = [];
    const expectedResult = "Malformated Input: 'value' must be a string. Received ";

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(() => ontologyBuilder.newObjectProperty(input)).toThrowError(expectedResult);
  });
});

describe("appendType()", () => {
  it("should add a type property to the element if no type property exists", () => {
    // Arrange
    const input = ontologyBuilderModule.typeClass;
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
      "@type": [ontologyBuilderModule.typeClass],
    };

    // Act
    ontologyBuilderModule.appendType(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should append a type item to the element if a type property exists", () => {
    // Arrange
    const input = ontologyBuilderModule.typeObjectProp;
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
      "@type": [ontologyBuilderModule.typeClass],
    };
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
      "@type": [ontologyBuilderModule.typeClass, ontologyBuilderModule.typeObjectProp],
    };

    // Act
    ontologyBuilderModule.appendType(inputObject, input);

    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should throw an error if the type property is not an array or undefined", () => {
    // Arrange
    const input = ontologyBuilderModule.typeClass;
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
      "@type": "not an array or undefined",
    };

    // Act
    // Assert
    expect(() => ontologyBuilderModule.appendType(inputObject, input)).toThrowError(
      "must be type array or undefined. Recieved"
    );
  });
  it("should throw an error if the input type property is not a string", () => {
    // Arrange
    const input = ["not a string"];
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };

    // Act
    // Assert
    expect(() => ontologyBuilderModule.appendType(inputObject, input)).toThrowError(
      "Malformated Input: 'value' must be a string. Received"
    );
  });
});

describe("appendComment()", () => {
  it("should add a comment property to the element if no comment property exists", () => {
    // Arrange
    const input = "This is a sample comment for unit testing";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
      "http://www.w3.org/2000/01/rdf-schema#comment": [
        {
          "@language": "en",
          "@value": input,
        },
      ],
    };

    // Act
    ontologyBuilderModule.appendComment(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should append a comment item to the element if a comment property exists", () => {
    // Arrange
    const input = "This is a sample comment for unit testing";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propComment] = [
      {
        "@language": "en",
        "@value": "Existing Comment",
      },
    ];
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propComment] = [
      {
        "@language": "en",
        "@value": "Existing Comment",
      },
      {
        "@language": "en",
        "@value": input,
      },
    ];

    // Act
    ontologyBuilderModule.appendComment(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should throw an error if the type property is not an array or undefined", () => {
    // Arrange

    const input = "This is a sample comment for unit testing";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propComment] = {
      "@language": "en",
      "@value": "Existing Comment",
    };

    // Act
    // Assert
    expect(() => ontologyBuilderModule.appendComment(inputObject, input)).toThrowError(
      "must be type array or undefined. Recieved"
    );
  });
  it("should throw an error if the input comment property is not a string", () => {
    // Arrange
    const input = ["not a string"];
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };

    // Act
    // Assert
    expect(() => ontologyBuilderModule.appendComment(inputObject, input)).toThrowError(
      "Malformated Input: 'value' must be a string. Received"
    );
  });
});

describe("appendLabel()", () => {
  it("should add a label property to the element if no label property exists", () => {
    // Arrange

    const input = "Sample Label";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propLabel] = [
      {
        "@language": "en",
        "@value": input,
      },
    ];

    // Act
    ontologyBuilderModule.appendLabel(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should append a label item to the element if a label property exists", () => {
    // Arrange

    const input = "Sample Label";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propLabel] = [
      {
        "@language": "en",
        "@value": "Existing Label",
      },
    ];
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propLabel] = [
      {
        "@language": "en",
        "@value": "Existing Label",
      },
      {
        "@language": "en",
        "@value": input,
      },
    ];
    // Act
    ontologyBuilderModule.appendLabel(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should throw an error if the label property is not an array or undefined", () => {
    // Arrange

    const input = "Sample Label";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propLabel] = "not an array";

    // Act
    // Assert
    expect(() => ontologyBuilderModule.appendLabel(inputObject, input)).toThrowError(
      "must be type array or undefined. Recieved"
    );
  });
  it("should throw an error if the input label property is not a string", () => {
    // Arrange
    const input = ["not a string"];
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };

    // Act
    // Assert
    expect(() => ontologyBuilderModule.appendLabel(inputObject, [input])).toThrowError(
      "Malformated Input: 'value' must be a string. Received"
    );
  });
});

describe("appendSubclassOf()", () => {
  it("should add a subClassOf property to the element if no subClassOf property exists", () => {
    // Arrange
    const input = "Unit Test SubClassOf Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propSubClassOf] = [
      {
        "@id": ontologyUri + "#Unit_Test_SubClassOf_Name",
      },
    ];
    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    ontologyBuilder.appendSubClassOf(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should append a subClassOf item to the element if a subClassOf property exists", () => {
    // Arrange

    const input = "Unit Test SubClassOf Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propSubClassOf] = [
      {
        "@id": ontologyUri + "#Existing_Unit_Test_SubClassOf_Name",
      },
    ];
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propSubClassOf] = [
      {
        "@id": ontologyUri + "#Existing_Unit_Test_SubClassOf_Name",
      },
      {
        "@id": ontologyUri + "#Unit_Test_SubClassOf_Name",
      },
    ];
    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    ontologyBuilder.appendSubClassOf(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should throw an error if the type property is not an array or undefined", () => {
    // Arrange
    const input = "Sample Label";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propSubClassOf] = "not an array or undefined";

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    // Assert
    expect(() => ontologyBuilder.appendSubClassOf(inputObject, input)).toThrowError(
      "must be type array or undefined. Recieved"
    );
  });
  it("should throw an error if the input type property is not a string", () => {
    // Arrange
    const input = ["not a string"];
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(() => ontologyBuilder.appendSubClassOf(inputObject, input)).toThrowError(
      "Malformated Input: 'value' must be a string. Received"
    );
  });
});

describe("appendDomain()", () => {
  it("should add a domain property to the element if no domain property exists", () => {
    // Arrange
    const input = "Unit Test Domain Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propDomain] = [
      {
        "@id": ontologyUri + "#Unit_Test_Domain_Name",
      },
    ];
    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    ontologyBuilder.appendDomain(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should append a Domain item to the element if a Domain property exists", () => {
    // Arrange

    const input = "Unit Test Domain Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propDomain] = [
      {
        "@id": ontologyUri + "#Existing_Unit_Test_Domain_Name",
      },
    ];
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propDomain] = [
      {
        "@id": ontologyUri + "#Existing_Unit_Test_Domain_Name",
      },
      {
        "@id": ontologyUri + "#Unit_Test_Domain_Name",
      },
    ];
    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    ontologyBuilder.appendDomain(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should throw an error if the Domain property is not an array or undefined", () => {
    // Arrange
    const input = "Unit Test Domain Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propDomain] = "not an array or undefined";

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    // Assert
    expect(() => ontologyBuilder.appendDomain(inputObject, input)).toThrowError(
      "must be type array or undefined. Recieved"
    );
  });
  it("should throw an error if the input type property is not a string", () => {
    // Arrange
    const input = ["not a string"];
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(() => ontologyBuilder.appendDomain(inputObject, input)).toThrowError(
      "Malformated Input: 'value' must be a string. Received"
    );
  });
});

describe("appendRange()", () => {
  it("should add a domain property to the element if no domain property exists", () => {
    // Arrange
    const input = "Unit Test Range Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propRange] = [
      {
        "@id": ontologyUri + "#Unit_Test_Range_Name",
      },
    ];
    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    ontologyBuilder.appendRange(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should append a Range item to the element if a Range property exists", () => {
    // Arrange

    const input = "Unit Test Range Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propRange] = [
      {
        "@id": ontologyUri + "#Existing_Unit_Test_Range_Name",
      },
    ];
    const expectedResult = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    expectedResult[ontologyBuilderModule.propRange] = [
      {
        "@id": ontologyUri + "#Existing_Unit_Test_Range_Name",
      },
      {
        "@id": ontologyUri + "#Unit_Test_Range_Name",
      },
    ];
    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    ontologyBuilder.appendRange(inputObject, input);
    // Assert
    expect(inputObject).toEqual(expectedResult);
  });
  it("should throw an error if the Range property is not an array or undefined", () => {
    // Arrange
    const input = "Unit Test Range Name";
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };
    inputObject[ontologyBuilderModule.propRange] = "not an array or undefined";

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);
    // Assert
    expect(() => ontologyBuilder.appendRange(inputObject, input)).toThrowError(
      "must be type array or undefined. Recieved"
    );
  });
  it("should throw an error if the input type property is not a string", () => {
    // Arrange
    const input = ["not a string"];
    const inputObject = {
      "@id": ontologyUri + "#Unit_Test_Class_Name",
    };

    // Act
    const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

    // Assert
    expect(() => ontologyBuilder.appendRange(inputObject, input)).toThrowError(
      "Malformated Input: 'value' must be a string. Received"
    );
  });
});

describe("hasIllegalCharacters()", () => {
  it("should return an empty array if the input has no illegal characters", () => {
    // Arrange
    const input = "A string with no illegal characters.";
    const expectedResult = [];

    // Act
    const result = ontologyBuilderModule.hasIllegalCharacters(input);

    // Assert
    expect(result).toEqual(expectedResult);
  });
  it("should return an array containing one illegal character if one character is in the input", () => {
    // Arrange
    const input = `<>#%^{}|"\`\\`;
    const arrayInput = input.split("");

    arrayInput.forEach((char) => {
      const expectedResult = [char];
      // Act
      const result = ontologyBuilderModule.hasIllegalCharacters(char);
      // Assert
      expect(result).toEqual(expectedResult);
    });
  });
});
