import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const WORKER_DOMAIN = 'https://nautica.badcode.biz.id';

export const GET: RequestHandler = async ({ url, params, fetch, request }) => {
  try {
    const workerUrl = new URL(`${WORKER_DOMAIN}/${params.path}`);
    url.searchParams.forEach((value, key) => {
      workerUrl.searchParams.append(key, value);
    });

    const response = await fetch(workerUrl.toString(), {
      headers: request.headers
    });

    if (!response.ok) {
      throw error(response.status, `Worker returned status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'text/plain';
    
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