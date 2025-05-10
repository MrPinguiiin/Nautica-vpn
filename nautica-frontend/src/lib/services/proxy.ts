import { KV_PROXY_URL, PROXY_BANK_URL, PROXY_HEALTH_CHECK_API } from '$lib/config/constants';
import type { ProxyData, ProxyHealth } from '$lib/types';

export class ProxyService {
    /**
     * Mengambil daftar proxy dari KV storage
     */
    static async getKVProxyList(kvProxyUrl = KV_PROXY_URL): Promise<Record<string, string[]>> {
        if (!kvProxyUrl) {
            throw new Error("No KV Proxy URL Provided!");
        }

        const kvProxy = await fetch(kvProxyUrl);
        if (kvProxy.status === 200) {
            return await kvProxy.json();
        }
        return {};
    }

    /**
     * Mengambil daftar proxy dari proxy bank
     * Format: <IP>,<Port>,<Country ID>,<ORG>
     * Contoh: 1.1.1.1,443,SG,Cloudflare Inc.
     */
    static async getProxyList(proxyBankUrl = PROXY_BANK_URL): Promise<ProxyData[]> {
        if (!proxyBankUrl) {
            throw new Error("No Proxy Bank URL Provided!");
        }

        const proxyBank = await fetch(proxyBankUrl);
        if (proxyBank.status === 200) {
            const text = (await proxyBank.text()) || "";

            return text
                .split("\n")
                .filter(Boolean)
                .map((entry) => {
                    const [proxyIP, proxyPort, country, org] = entry.split(",");
                    return {
                        proxyIP: proxyIP || "Unknown",
                        proxyPort: proxyPort || "Unknown",
                        country: country || "Unknown",
                        org: org || "Unknown Org",
                    };
                });
        }

        return [];
    }

    /**
     * Memeriksa kesehatan proxy
     */
    static async checkProxyHealth(proxyIP: string, proxyPort: string): Promise<ProxyHealth> {
        const response = await fetch(`${PROXY_HEALTH_CHECK_API}?ip=${proxyIP}:${proxyPort}`);
        return await response.json();
    }

    /**
     * Mengacak array proxy
     */
    static shuffleProxyList(array: ProxyData[]): ProxyData[] {
        let currentIndex = array.length;
        while (currentIndex !== 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    /**
     * Mendapatkan emoji bendera dari kode negara
     */
    static getFlagEmoji(isoCode: string): string {
        const codePoints = isoCode
            .toUpperCase()
            .split("")
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }
} 