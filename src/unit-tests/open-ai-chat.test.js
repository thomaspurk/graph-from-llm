/**
 * @file Unit tests for functions in the ontology-builder.js file
 * @author Thomas J. Purk
 */

import "../modules/load-env.js";
import { describe, expect, it } from "vitest";
import { completeChat } from "../tasks/open-ai-chat.js";

describe("completeChat()", () => {
  it("should load the match cache file from disk instead of making an API call", async () => {
    // Arrange

    const input_systemContent = "You are a polite professional.";
    const input_userContent = "Create a test object for unit testing";
    const input_parentConcept = "unit-test";
    const input_conceptName = "unit-test";
    const input_dirCompletions = "output-completion-test";

    const expectedResult = {
      name: "unit-test",
      aliases: ["unit-test"],
      description: "existing-file",
    };

    // Act
    const result = await completeChat(
      input_systemContent,
      input_userContent,
      input_parentConcept,
      input_conceptName,
      input_dirCompletions
    );

    // Assert
    expect(JSON.parse(result)).toStrictEqual(expectedResult);
  });
});
