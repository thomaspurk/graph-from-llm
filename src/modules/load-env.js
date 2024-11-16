/**
 * @file
 * @author Thomas J. Purk
 * Node.js calls all import statements to load ES Modules first, before executing any other code, regardless of the order in the code file. This module used to load the environment variales before importing other modules.
 *
 */

import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
