export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const q   = url.searchParams.get('question') ?? 'No question';
  const src = url.searchParams.get('source')   ?? 'GPT';

  // Fire-and-forget to Google Apps Script
  fetch(
    'https://script.google.com/macros/s/AKfycbxB_Z2wB969QeTJ-LfO9kAjA7NLYzQ3beA1qp52SwcvqlRifnNAGRRNcDEFj5IB_SA/exec'
      + `?question=${encodeURIComponent(q)}`
      + `&source=${encodeURIComponent(src)}`
  ).catch(() => {});

  return new Response('ok', { status: 200 });
}
