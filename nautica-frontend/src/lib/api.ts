// API client untuk berkomunikasi dengan Cloudflare Workers

const API_BASE_URL = '/api'; // Proxy ke Cloudflare Worker

/**
 * Mendapatkan daftar proxy dari worker
 */
export async function getProxyList() {
  try {
    const response = await fetch(`${API_BASE_URL}/sub/0`);
    if (!response.ok) {
      throw new Error('Gagal mengambil daftar proxy');
    }
    return await response.text();
  } catch (error) {
    console.error('Error mengambil daftar proxy:', error);
    throw error;
  }
}

/**
 * Memeriksa kesehatan proxy
 */
export async function checkProxyHealth(target: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/check?target=${target}`);
    if (!response.ok) {
      throw new Error('Gagal memeriksa kesehatan proxy');
    }
    return await response.json();
  } catch (error) {
    console.error('Error memeriksa kesehatan proxy:', error);
    throw error;
  }
} 