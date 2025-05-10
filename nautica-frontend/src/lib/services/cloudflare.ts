import { BAD_WORDS_LIST } from '$lib/config/constants';
import type { CloudflareConfig } from '$lib/types';

export class CloudflareService {
    private bearer: string;
    private headers: Record<string, string>;

    constructor(private config: CloudflareConfig) {
        this.bearer = `Bearer ${config.apiKey}`;
        this.headers = {
            Authorization: this.bearer,
            "X-Auth-Email": config.apiEmail,
            "X-Auth-Key": config.apiKey,
        };
    }

    /**
     * Mendapatkan daftar domain yang terdaftar
     */
    async getDomainList(): Promise<string[]> {
        const url = `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/workers/domains`;
        const res = await fetch(url, {
            headers: this.headers,
        });

        if (res.status === 200) {
            const respJson = await res.json();
            return respJson.result
                .filter((data: any) => data.service === this.config.serviceName)
                .map((data: any) => data.hostname);
        }

        return [];
    }

    /**
     * Mendaftarkan domain baru
     */
    async registerDomain(domain: string): Promise<number> {
        domain = domain.toLowerCase();
        const registeredDomains = await this.getDomainList();
        const appDomain = `${this.config.serviceName}.${this.config.rootDomain}`;

        if (!domain.endsWith(this.config.rootDomain)) return 400;
        if (registeredDomains.includes(domain)) return 409;

        try {
            const domainTest = await fetch(`https://${domain.replaceAll("." + appDomain, "")}`);
            if (domainTest.status === 530) return domainTest.status;

            const badWordsListRes = await fetch(BAD_WORDS_LIST);
            if (badWordsListRes.status === 200) {
                const badWordsList = (await badWordsListRes.text()).split("\n");
                for (const badWord of badWordsList) {
                    if (domain.includes(badWord.toLowerCase())) {
                        return 403;
                    }
                }
            } else {
                return 403;
            }
        } catch (e) {
            return 400;
        }

        const url = `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/workers/domains`;
        const res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({
                environment: "production",
                hostname: domain,
                service: this.config.serviceName,
                zone_id: this.config.zoneId,
            }),
            headers: this.headers,
        });

        return res.status;
    }
} 