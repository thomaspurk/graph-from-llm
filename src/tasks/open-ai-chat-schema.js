import { z } from "zod";

export const responseSchema = {
  root: z.object({
    name: z.string(),
    aliases: z.array(z.string()),
    description: z.string(),
    joints: z.array(z.string()),
  }),
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
