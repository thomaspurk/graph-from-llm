/**
 * @file A collection of functions for executing chat completions with the OpenAI API
 * @author Thomas J. Purk
 */

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const concept = {
  root: z.object({ joints: z.array(z.string()) }),
  joints: z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    description: z.string(),
    operations: z.array(z.string()),
  }),
  operations: z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    description: z.string(),
    tools: z.array(z.string()),
  }),
  tools: z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    description: z.string(),
  }),
};

export async function completeChat(systemContent, userContent, conceptName) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemContent },
      {
        role: "user",
        content: userContent,
      },
    ],
    response_format: zodResponseFormat(concept[conceptName], conceptName),
  });

  return completion.choices[0].message.content;
}
