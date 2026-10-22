import { z } from "zod";

// Versioned non-sensitive contract. No financial records in M1.
export const statusInputSchema = z.strictObject({});
export const statusSchema = z.strictObject({
  schemaVersion: z.literal(1),
  service: z.literal("maple-portfolio"),
  status: z.literal("ok"),
  milestone: z.literal("M1"),
  portfolioDataSupported: z.literal(false),
});
export type ServiceStatus = z.infer<typeof statusSchema>;
export function getStatus(): ServiceStatus {
  return statusSchema.parse({
    schemaVersion: 1,
    service: "maple-portfolio",
    status: "ok",
    milestone: "M1",
    portfolioDataSupported: false,
  });
}
