import { z } from "zod";

/**
 * @see {@link https://discord.com/developers/docs/events/gateway-events#resume-resume-structure}
 */
export const ResumeEntity = z.object({
  token: z.string(),
  session_id: z.string(),
  seq: z.number().int(),
});

export type ResumeEntity = z.infer<typeof ResumeEntity>;
