/**
 * @file
 * @author Thomas J. Purk
 */

import "./modules/load-env.js";
import { completeChat } from "./tasks/open-ai-chat.js";
import { ontologyBuilderModule } from "./tasks/ontology-builder.js";
import fs from "fs";

const dirCompletions = "output-completion-cache";
const dirOutputOntology = "output-ontology";
const ontologyUri =
  "http://www.semanticweb.org/thomaspurk/ontologies/hand-tool-woodworking";

const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

const seedObject = {};

const messages = {
  rootSystemMessage: "You are an expert in the domain of hand tool woodworking. ",
  commonUserMessages: ["Do not place aliases or alternate names in parenthesis."],
  root: `Create an object where name is "root," description is "N/A," alias is an empty array, and joints is a list of woodworking joints that are used to join wooded workpieces together.`,
  joints: `Descibe the <name> woodworking joint. Include the joint name, a short description, any common aliases, and the name of woodworking operations used to form the joint. Do not include the names of operations for assembling the joint with glue or fastners. <commonUserMessages>`,
  operations: `Descibe the <name> woodworking operation. Include the operation name, a short description, any common aliases, and the name of woodworking hand tools used to complete the operation.  <commonUserMessages>`,
  tools: `Descibe the <name> woodworking tool. Include the tool name, a short description, and any common aliases.  <commonUserMessages>`,
};

// Step 1: Get a list of woodworking joints
// Joints are the root of the model
const rootConceptArray = await childConceptsProcessor({ root: ["root"] });

// Write the ontology to file
fs.writeFileSync(
  `${dirOutputOntology}/output_ontology.json`,
  JSON.stringify(ontologyBuilder.arrOntology)
);

/**
 * @function childConceptsProcessor
 * @param {object} conceptsObject An object containing a property with the parentConcept as the name and the list of concepts as a string Array.
 * @return {array} An array of Objects.
 */
async function childConceptsProcessor(conceptsObject) {
  // Find properties of the concept object that contain a child names array
  const parentNames = Object.keys(conceptsObject).filter(
    (prop) =>
      !["name", "aliases", "descriptions"].includes(prop) &&
      Array.isArray(conceptsObject[prop])
  );

  // Loop each possible child category
  for (let i = 0; i < parentNames.length; i++) {
    // Identify the parent concept name
    // The children of the current parent concept become a parent
    const parentName = parentNames[i];

    // Get the user message assicated with the name
    // Append common messages that apply to all user messages
    let userMessage = messages[parentName];
    userMessage = userMessage.replace(
      "<commonUserMessages>",
      messages.commonUserMessages.join(" ")
    );

    // Identify the array of strings representing the child concept names
    const childNames = conceptsObject[parentName];

    // Set up caching directory, create new if not found
    let outputDir = `${dirCompletions}/${parentName}`;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Loop each child concept name & Process the Child Concept
    for (let i = 0; i < childNames.length; i++) {
      // Identify the current concept name.
      const childName = childNames[i];

      // Tailor the user message to the current child concept name
      const childUserMessage = userMessage.replace("<name>", childName);

      const conceptJsonString = await completeChat(
        messages.rootSystemMessage,
        childUserMessage,
        parentName,
        childName,
        dirCompletions
      );

      const childConceptObject = JSON.parse(conceptJsonString);

      // Add information to the ontology
      if (parentName != "root") {
        // Create the class
        const ontClass = ontologyBuilder.newClass(childConceptObject["name"]);

        // Append the Parent link
        ontologyBuilder.appendSubClassOf(ontClass, parentName);

        // Add the main label
        ontologyBuilderModule.appendLabel(ontClass, childName);

        // Add aliases as additional labels
        // TODO: Look into the appendLabel function and why it is on the module not the object instance
        if (
          childConceptObject["aliases"] &&
          Array.isArray(childConceptObject["aliases"])
        ) {
          childConceptObject["aliases"].forEach((a) => {
            ontologyBuilderModule.appendLabel(ontClass, a);
          });
        }

        // Add the desription as a comment
        if (childConceptObject["description"]) {
          ontologyBuilderModule.appendComment(
            ontClass,
            childConceptObject["description"]
          );
        }
      }

      // Step 2..n: Recursively process potential children of this child
      // The previous call to childConceptsProcessor should have returned a 1 length array
      await childConceptsProcessor(childConceptObject);
    }
  }
}
