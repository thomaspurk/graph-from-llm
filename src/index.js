/**
 * @file
 * @author Thomas J. Purk
 */

import "./modules/load-env.js";
import { completeChat } from "./tasks/open-ai-chat.js";
import fs from "fs";

const dirCompletions = "output-completion-cache";
const messages = {
  rootSystemMessage: "You are an expert in the domain of hadn tool woodworking. ",
  commonUserMessages: ["Do not place aliases or alternate names in parenthesis."],
  root: `Create an object where name is "root," description is "N/A," alias is an empty array, and joints is a list of woodworking joints that are used to join wooded workpieces together.`,
  joints: `Descibe the <name> woodworking joint. Include the joint name, a short description, any common aliases, and the name of woodworking operations used to form the joint. Do not include the names of operations for assembling the joint with glue or fastners. <commonUserMessages>`,
  operations: `Descibe the <name> woodworking operation. Include the operation name, a short description, any common aliases, and the name of woodworking hand tools used to complete the operation.  <commonUserMessages>`,
  tools: `Descibe the <name> woodworking tool. Include the tool name, a short description, and any common aliases.  <commonUserMessages>`,
};

// Step 1: Get a list of woodworking joints
// Joints are the root of the model
const rootConceptArray = await childConceptsProcessor({ root: ["root"] });

/**
 * @function childConceptsProcessor
 * @param {object} conceptsObject An object containing a property with the parentConcept as as the name and the list of concepts as a string Array.
 * @return {array} An array of Objects.
 */
async function childConceptsProcessor(conceptsObject) {
  // Find properties of the concept object that contain a child names array
  const childCategories = Object.keys(conceptsObject).filter(
    (prop) =>
      !["name", "aliases", "descriptions"].includes(prop) &&
      Array.isArray(conceptsObject[prop])
  );

  // Loop each possible child category
  for (let i = 0; i < childCategories.length; i++) {
    // Identify the parent concept name
    const parentConcept = childCategories[i];

    // Get the user message assicated with the name
    // Append common messages that apply to all user messages
    let userMessage = messages[parentConcept];
    userMessage = userMessage.replace(
      "<commonUserMessages>",
      messages.commonUserMessages.join(" ")
    );

    // Identify the array of strings representing the child concept names
    const childConceptNames = conceptsObject[parentConcept];

    // Set up caching directory, create new if not found
    let outputDir = `${dirCompletions}/${parentConcept}`;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Loop each child concept name & Process the Child Concept
    for (let i = 0; i < childConceptNames.length; i++) {
      // Identify the current concept name.
      const conceptName = childConceptNames[i];

      // Tailor the user message to the current child concept name
      userMessage = userMessage.replace("<name>", conceptName);

      const conceptJsonString = await completeChat(
        messages.rootSystemMessage,
        userMessage,
        parentConcept,
        conceptName,
        dirCompletions
      );

      const conceptObject = JSON.parse(conceptJsonString);
      // Step 2..n: Recursively process potential children of this child
      // The previous call to childConceptsProcessor should have returned a 1 length array
      await childConceptsProcessor(conceptObject);
    }
  }
}
