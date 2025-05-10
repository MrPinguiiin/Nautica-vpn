<!-- ProxyCard.svelte -->
<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { PROTOCOLS, PORTS } from '$lib/config/constants';
    import type { ProxyData, ProxyHealth } from '$lib/types';
    import { ProxyService } from '$lib/services/proxy';

    const dispatch = createEventDispatcher<{
        copyConfig: string;
    }>();

    export let proxy: ProxyData;
    export let index: number;
    export let hostname: string;

    let health: ProxyHealth | null = null;
    let isChecking = false;

    onMount(async () => {
        await checkHealth();
    });

    async function checkHealth() {
        if (isChecking) return;
        isChecking = true;

        try {
            health = await ProxyService.checkProxyHealth(proxy.proxyIP, proxy.proxyPort);
        } catch (error) {
            console.error('Failed to check proxy health:', error);
        } finally {
            isChecking = false;
        }
    }

    function getStatusClass(health: ProxyHealth | null): string {
        if (!health) return 'animate-pulse dark:text-white';
        return health.proxyip ? 'text-green-600' : 'text-red-600';
    }

    function getStatusText(health: ProxyHealth | null): string {
        if (!health) return `Idle ${proxy.proxyIP}:${proxy.proxyPort}`;
        if (isChecking) return 'Checking...';
        return health.proxyip ? `Active ${health.delay}ms (${health.colo})` : 'Inactive';
    }
</script>

<div class="lozad scale-95 mb-2 bg-white dark:bg-neutral-800 transition-transform duration-200 rounded-lg p-4 w-60 border-2 border-neutral-800">
    <div id="countryFlag" class="absolute -translate-y-9 -translate-x-2 border-2 border-neutral-800 rounded-full overflow-hidden">
        <img width="32" src="https://hatscripts.github.io/circle-flags/flags/{proxy.country.toLowerCase()}.svg" alt="{proxy.country} flag" />
    </div>
    
    <div>
        <div class="{getStatusClass(health)} text-xs font-semibold">
            {getStatusText(health)}
        </div>
    </div>

    <div class="rounded py-1 px-2 bg-amber-400 dark:bg-neutral-800 dark:border-2 dark:border-amber-400">
        <h5 class="font-bold text-md text-neutral-900 dark:text-white mb-1 overflow-x-scroll scrollbar-hide text-nowrap">
            {proxy.org}
        </h5>
        <div class="text-neutral-900 dark:text-white text-sm">
            <p>IP: {proxy.proxyIP}</p>
            <p>Port: {proxy.proxyPort}</p>
        </div>
    </div>

    <div class="flex flex-col gap-2 mt-3 text-sm">
        {#each PORTS as port}
            <div class="flex gap-2 justify-around w-full">
                {#each PROTOCOLS as protocol}
                    <button 
                        class="bg-blue-500 dark:bg-neutral-800 dark:border-2 dark:border-blue-500 rounded p-1 w-full text-white"
                        on:click={() => {
                            const uri = new URL(`${protocol}://${hostname}`);
                            uri.searchParams.set('encryption', 'none');
                            uri.searchParams.set('type', 'ws');
                            uri.searchParams.set('host', hostname);
                            uri.searchParams.set('path', `/${proxy.proxyIP}-${proxy.proxyPort}`);
                            uri.port = port.toString();
                            uri.hash = `${index + 1} ${ProxyService.getFlagEmoji(proxy.country)} ${proxy.org} WS ${port === 443 ? 'TLS' : 'NTLS'}`;
                            
                            dispatch('copyConfig', uri.toString());
                        }}
                    >
                        {protocol.split('').reverse().join('')} {port === 443 ? 'TLS' : 'NTLS'}
                    </button>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    /* For Webkit-based browsers (Chrome, Safari and Opera) */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

    /* For IE, Edge and Firefox */
    .scrollbar-hide {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style> 