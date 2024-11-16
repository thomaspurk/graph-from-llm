/**
 * @file Unit tests for functions in the ontology-builder.js file
 * @author Thomas J. Purk
 */

import { describe, expect, it } from "vitest";
import { ontologyBuilderModule } from "../tasks/ontology-builder.js";

// Global Arrange
const namespace = "http://ontologies.purk.com/unit-tests";
const ontologyBuilder = new ontologyBuilderModule(namespace);

describe("ontologyBuilderModule constructor()", () => {
  it("should create an object with the correct properties", () => {
    // Arrange
    const expectedResult = [
      {
        "@id": namespace,
        "@type": ["http://www.w3.org/2002/07/owl#Ontology"],
      },
    ];

    // Act

    // Assert
    expect(ontologyBuilder.arrOntology).toEqual(expect.arrayContaining(expectedResult));
    expect(ontologyBuilder.namespace).toEqual(namespace);
  });
});
