<!-- ProxyList.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { PROXY_PER_PAGE } from '$lib/config/constants';
    import type { ProxyData } from '$lib/types';
    import { ProxyService } from '$lib/services/proxy';
    import ProxyCard from './ProxyCard.svelte';

    export let hostname: string;
    export let countryFilter: string[] = [];

    let proxyList: ProxyData[] = [];
    let currentPage = 0;
    let isLoading = true;
    let error: string | null = null;

    $: startIndex = PROXY_PER_PAGE * currentPage;
    $: endIndex = startIndex + PROXY_PER_PAGE;
    $: totalPages = Math.ceil(proxyList.length / PROXY_PER_PAGE);
    $: displayedProxies = proxyList.slice(startIndex, endIndex);

    onMount(async () => {
        await loadProxies();
    });

    async function loadProxies() {
        try {
            isLoading = true;
            error = null;
            
            let proxies = await ProxyService.getProxyList();
            
            // Filter by country if specified
            if (countryFilter.length > 0) {
                proxies = proxies.filter(proxy => countryFilter.includes(proxy.country));
            }
            
            // Shuffle the proxy list
            proxyList = ProxyService.shuffleProxyList(proxies);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load proxies';
            console.error('Failed to load proxies:', err);
        } finally {
            isLoading = false;
        }
    }

    function handleCopyConfig(event: CustomEvent<string>) {
        const config = event.detail;
        // Dispatch event to parent
        dispatch('copyConfig', config);
    }

    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
        }
    }
</script>

<div class="container mx-auto px-4">
    {#if isLoading}
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    {:else if error}
        <div class="text-red-500 text-center py-4">
            {error}
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {#each displayedProxies as proxy, i}
                <ProxyCard 
                    {proxy}
                    index={startIndex + i}
                    {hostname}
                    on:copyConfig={handleCopyConfig}
                />
            {/each}
        </div>

        <!-- Pagination -->
        <nav class="w-screen mt-8 sticky bottom-0 right-0 left-0 transition -translate-y-6 z-20">
            <ul class="flex justify-center space-x-4">
                <li>
                    <button 
                        class="px-3 py-1 bg-amber-400 border-2 border-neutral-800 rounded" 
                        disabled={currentPage === 0}
                        on:click={prevPage}
                    >
                        Prev
                    </button>
                </li>
                <li>
                    <button 
                        class="px-3 py-1 bg-amber-400 border-2 border-neutral-800 rounded"
                        disabled={currentPage >= totalPages - 1}
                        on:click={nextPage}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    {/if}
</div> 