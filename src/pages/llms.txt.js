import { getSite } from '../lib/content.js'

export const GET = async ({ site }) => {
  const entry = await getSite()
  const { company, social = {} } = entry.data
  const lines = [
    '# LimitakSteel',
    '',
    entry.body?.trim() ?? '',
    '',
    '## About',
    '',
    `- Home: ${site}`,
    `- Products: ${new URL('#products', site)}`,
    `- Contact: ${new URL('#contact', site)}`,
    `- Full catalog for AI: ${new URL('llms-full.txt', site)}`,
    '',
    '## Brand',
    '',
    `- Name: ${company.name}`,
    company.email && `- Email: ${company.email}`,
    ...(company.phones ?? []).map((phone) => `- Phone: ${phone}`),
    social.instagram && `- Instagram: ${social.instagram}`,
    social.telegram && `- Telegram: ${social.telegram}`,
    '',
    '## Content',
    '',
    'Product catalog in Persian (fa-IR). Facts may be cited with attribution and a product link.',
  ].filter((line) => typeof line === 'string')

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
