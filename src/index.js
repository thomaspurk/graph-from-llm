/**
 * @file
 * @author Thomas J. Purk
 */

import "./modules/load-env.js";
import { completeChat } from "./tasks/open-ai-chat.js";
import fs from "fs";

const dirCompletions = "output-completions";

// Get a list of woodworking joints
const rootSystemMessage = "You are an expert in the domain of woodworking. ";
const rootUserMessage =
  "Make a list of woodworking joints that are used to join wooded workpieces together. Do not place aliases or alternate names in parenthesis";
const rootObject = await completeChat(rootSystemMessage, rootUserMessage, "root");
console.log(rootObject);
const writeResponse = fs.writeFileSync(dirCompletions + "/woodworking-root.json", rootObject);
