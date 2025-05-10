import { env } from '$env/dynamic/public';

// Domain Configuration
export const ROOT_DOMAIN = env.PUBLIC_ROOT_DOMAIN || "badcode.biz.id";
export const SERVICE_NAME = env.PUBLIC_SERVICE_NAME || "nautica";
export const APP_DOMAIN = `${SERVICE_NAME}.${ROOT_DOMAIN}`;

// Proxy Configuration
export const PORTS = [443, 80] as const;
export const PROTOCOLS = ["trojan", "vless", "ss"].map(s => s.split("").reverse().join(""));
export const KV_PROXY_URL = env.PUBLIC_KV_PROXY_URL || "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/kvProxyList.json";
export const PROXY_BANK_URL = env.PUBLIC_PROXY_BANK_URL || "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt";
export const PROXY_HEALTH_CHECK_API = env.PUBLIC_PROXY_HEALTH_CHECK_API || "https://id1.foolvpn.me/api/v1/check";
export const CONVERTER_URL = env.PUBLIC_CONVERTER_URL || "https://api.foolvpn.me/convert";
export const DONATE_LINK = "https://trakteer.id/dickymuliafiqri/tip";
export const BAD_WORDS_LIST = "https://gist.githubusercontent.com/adierebel/a69396d79b787b84d89b45002cb37cd6/raw/6df5f8728b18699496ad588b3953931078ab9cf1/kata-kasar.txt";

// DNS Configuration
export const DNS_SERVER_ADDRESS = "8.8.8.8";
export const DNS_SERVER_PORT = 53;

// UI Configuration
export const PROXY_PER_PAGE = 24;

// WebSocket States
export const WS_READY_STATE = {
    OPEN: 1,
    CLOSING: 2
} as const;

// CORS Configuration
export const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
} as const; 