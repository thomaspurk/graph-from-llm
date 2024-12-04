/**
 * @file
 * @author Thomas J. Purk
 */

import "./modules/load-env.js";
import { completeChat } from "./tasks/open-ai-chat.js";
import fs from "fs";

const dirCompletions = "output-completions";
const rootSystemMessage = "You are an expert in the domain of woodworking. ";
const commonUserMessages = ["Do not place aliases or alternate names in parenthesis."];

// Step 1: Get a list of woodworking joints\
// Joints are the root of the model

// Inputs
let concept = "root";
let parentConcept = "root";

let rootConceptObject = {};
rootConceptObject[parentConcept] = [concept];
const rootUserMessage = `Make a list of woodworking joints that are used to join wooded 
workpieces together. ${commonUserMessages.join(" ")}`;

// Execute
const rootConceptArray = await conceptProcessor(
  rootSystemMessage,
  rootUserMessage,
  rootConceptObject,
  parentConcept
);

// Outputs
const rootObject = JSON.parse(rootJsonString);
if (!fs.existsSync(outputFile)) {
  fs.writeFileSync(outputFile, rootJsonString);
}

// Step 2: For each joint name get data from the LLM

// Inputs
parentConcept = "joints";
const jointUserMessage = `Descibe the <name> woodworking joint. Include the joint name, 
a short description, any common aliases, and the name of woodworking operations used to form 
the joint using hand tools. Do not include the names of operations for assembling the joint with glue or fastners. 
${commonUserMessages.join(" ")}`;

const joints = await conceptProcessor(
  rootSystemMessage,
  jointUserMessage,
  rootObject,
  parentConcept
);

async function conceptProcessor(
  systemMessage,
  userMessage,
  conceptsObject,
  parentConcept
) {
  const conceptObjectArray = [];
  let outputDir = `${dirCompletions}/${parentConcept}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < conceptsObject[parentConcept].length; i++) {
    const concept = conceptsObject[parentConcept][i];

    const conceptJsonString = await completeChat(
      systemMessage,
      userMessage,
      parentConcept,
      concept,
      dirCompletions
    );

    const outputFile = `${outputDir}/${concept}.json`;
    if (!fs.existsSync(outputFile)) {
      fs.writeFileSync(outputFile, conceptJsonString);
    }
    const conceptObject = JSON.parse(conceptJsonString);
    conceptObjectArray.push(conceptObject);
  }
  return conceptObjectArray;
}
