import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    summary: z.string(),
    year: z.string(),
    role: z.string(),
    status: z.string(),
    stack: z.array(z.string()),
    track: z.enum(['ai', 'quant', 'both']),
    /** Position in the index per lens (lower = higher up). */
    order: z.object({ ai: z.number(), quant: z.number() }),
    headline: z.object({ value: z.string(), label: z.string() }),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).min(2).max(4),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

export const collections = { work };
