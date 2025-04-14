import { z } from 'zod';

export const holdingItemSchema = z.object({
    offerings: z.object({
        name: z.string(),
        invested: z.string(),
    }),
    investmentType: z.enum(["AB", "WC", "IG"]),
    unitsHolding: z.string(),
    propUnits: z.string(),
    dividends: z.string(),
    totalpl: z.string(),
});

export type holdingItemSchemaType = z.infer<typeof holdingItemSchema>;
