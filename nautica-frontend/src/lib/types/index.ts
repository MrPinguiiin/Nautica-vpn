export interface ProxyData {
    proxyIP: string;
    proxyPort: string;
    country: string;
    org: string;
}

export interface ProxyHealth {
    proxyip: boolean;
    delay: number;
    colo: string;
}

export interface ProxyListResponse {
    proxies: ProxyData[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ProxyConfig {
    addressRemote: string;
    addressType: number;
    portRemote: number;
    rawDataIndex: number;
    rawClientData: ArrayBuffer;
    version: Uint8Array | null;
    isUDP: boolean;
    hasError: boolean;
    message?: string;
}

export interface CloudflareConfig {
    apiKey: string;
    apiEmail: string;
    accountId: string;
    zoneId: string;
    serviceName: string;
    rootDomain: string;
} 