import type { APIRoute } from 'astro';
import { ALLOW_INDEXING } from 'astro:env/server';

const BOTS = [
  'Googlebot', 'Bingbot', 'Applebot',
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended',
];

export const GET: APIRoute = ({ site }) => {
  const origin = new URL(site!).origin;
  const body = ALLOW_INDEXING
    ? [
        ...BOTS.map((b) => `User-agent: ${b}\nAllow: /\n`),
        'User-agent: *\nAllow: /\n',
        `Sitemap: ${origin}/sitemap-index.xml`,
      ].join('\n')
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

