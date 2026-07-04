import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// All site content lives as files in src/content/, edited either by hand or
// through the /admin panel (Decap CMS), which commits directly to these
// folders. Astro reads everything at BUILD TIME — no database, no runtime
// fetch. Saving in /admin triggers a commit → GitHub Actions build → deploy.

const dresses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dresses' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    collection: z.enum(['bespoke', 'ready_to_wear', 'bridal', 'mens']),
    image: z.string().optional(),
    showcase: z.boolean().default(false),
    order: z.number().default(0),
    published: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    client_name: z.string(),
    rating: z.number().min(1).max(5).default(5),
    order: z.number().default(0),
    published: z.boolean().default(true),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.enum(['mannequin', 'sewing', 'ring', 'cap']),
    order: z.number().default(0),
  }),
});

export const collections = { dresses, testimonials, services };

// Single source of truth for the four collections shown on the site.
// The admin dropdown (public/admin/config.yml) has a matching list to
// keep in sync by hand.
export const COLLECTIONS = [
  { value: 'bespoke', label: 'Bespoke Collection' },
  { value: 'ready_to_wear', label: 'Ready-to-Wear' },
  { value: 'bridal', label: 'Bridal Wear' },
  { value: 'mens', label: "Men's Collection" },
];

export const collectionLabel = (value: string) =>
  COLLECTIONS.find((c) => c.value === value)?.label ?? value;
