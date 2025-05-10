import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Domain untuk Cloudflare Worker
const WORKER_DOMAIN = 'https://nautica.badcode.biz.id'; // Ganti dengan domain worker Anda

export const GET: RequestHandler = async ({ url, params, fetch, request }) => {
  try {
    // Membuat URL untuk worker dengan meneruskan path dan query params
    const workerUrl = new URL(`${WORKER_DOMAIN}/${params.path}`);
    url.searchParams.forEach((value, key) => {
      workerUrl.searchParams.append(key, value);
    });

    // Forward request ke worker
    const response = await fetch(workerUrl.toString(), {
      headers: request.headers
    });

    if (!response.ok) {
      throw error(response.status, `Worker returned status: ${response.status}`);
    }

    // Tentukan jenis konten berdasarkan respons dari worker
    const contentType = response.headers.get('content-type') || 'text/plain';
    
    // Mengembalikan respons dari worker
    return new Response(response.body, {
      status: response.status,
      headers: {
        'content-type': contentType,
        'access-control-allow-origin': '*'
      }
    });
  } catch (err) {
    console.error('Error forwarding to worker:', err);
    throw error(500, 'Failed to connect to worker');
  }
}; 