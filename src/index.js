/**
 * @file The main point of entry for the application. Initiates the core application loop.
 * @author Thomas J. Purk
 */

import "./modules/load-env.js";
import { completeChat } from "./tasks/open-ai-chat.js";
import { ontologyBuilderModule } from "./tasks/ontology-builder.js";
import fs from "fs";

// The folder to store the LLM Chat completion data
const dirCompletions = "output-completion-cache";

// The folder to store the resulting ontology
const dirOutputOntology = "output-ontology";

// The base identifier for entities in the ontology
const ontologyUri =
  "http://www.semanticweb.org/thomaspurk/ontologies/hand-tool-woodworking";

// Instantiate an instance of the Ontology Builder. Handles building an ontology from LLM answers
const ontologyBuilder = new ontologyBuilderModule(ontologyUri);

// A base object to initiate the first loop of the application logic
const seedObject = { root: ["root"] };

// Message templates from which to build the LLM chat completions
const messages = {
  rootSystemMessage: "You are an expert in the domain of hand tool woodworking. ",
  commonUserMessages: ["Do not place aliases or alternate names in parenthesis."],
  root: `Create an object where name is "root," description is "N/A," alias is an empty array, joints is a list of woodworking joints that are used to join wooded workpieces together, and subclasses is a string array containing "Joints," "Operations," and "Tools"`,
  subclasses: `Create an object where the name is <name> and the description is a definition of the object.`,
  joints: `Descibe the <name> woodworking joint. Include the joint name, a short description, any common aliases, and the name of woodworking operations used to form the joint. Do not include the names of operations for assembling the joint with glue or fastners. <commonUserMessages>`,
  operations: `Descibe the <name> woodworking operation. Include the operation name, a short description, any common aliases, and the name of woodworking hand tools used to complete the operation.  <commonUserMessages>`,
  tools: `Descibe the <name> woodworking tool. Include the tool name, a short description, and any common aliases.  <commonUserMessages>`,
};

// Initiate the program loop
const rootConceptArray = await childConceptsProcessor(seedObject);

// Write the ontology to file
fs.writeFileSync(
  `${dirOutputOntology}/hand_tool_woodworking_ontology.json`,
  JSON.stringify(ontologyBuilder.arrOntology)
);

/**
 * @function childConceptsProcessor Main processing loop. A function to recursively process parent and children concepts. Writes the final ontology to file.
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

      // Get an JSON String containing the LLM's answer regarding the topic of interest
      const conceptJsonString = await completeChat(
        messages.rootSystemMessage,
        childUserMessage,
        parentName,
        childName,
        dirCompletions
      );

      const childConceptObject = JSON.parse(conceptJsonString);

      // Add information to the ontology
      if (!["root", "subclasses"].includes(parentName)) {
        // Create the class
        const ontClass = ontologyBuilder.newClass(childConceptObject["name"]);

        // Append the Parent link
        ontologyBuilder.appendSubClassOf(ontClass, parentName);

        // Add the main label
        ontologyBuilderModule.appendLabel(ontClass, childName);

        // Add aliases as additional labels
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

        // Find properties of the concept object that should create Object Property -> Domain & Range
        const propertyNames = Object.keys(childConceptObject).filter(
          (prop) =>
            !["name", "aliases", "descriptions"].includes(prop) &&
            Array.isArray(childConceptObject[prop])
        );

        // Loop each property name & create an object property
        for (let i = 0; i < propertyNames.length; i++) {
          const propertyName = propertyNames[i];
          const domainName = childConceptObject["name"];
          const rangeNames = childConceptObject[propertyName];

          // Create the Object Property
          const objectProperty = ontologyBuilder.newObjectProperty(
            `${domainName}_has_${propertyName}`
          );
          // Add the domain to the Object Property
          ontologyBuilder.appendDomain(objectProperty, domainName);

          // Add the ranges to the Object Property
          for (let ii = 0; ii < rangeNames.length; ii++) {
            const rangeName = rangeNames[ii];
            ontologyBuilder.appendRange(objectProperty, rangeName);
          }
        }
      }

      // Step 2..n: Recursively process potential children of this child
      // The previous call to childConceptsProcessor should have returned a 1 length array
      await childConceptsProcessor(childConceptObject);
    }
  }
}
