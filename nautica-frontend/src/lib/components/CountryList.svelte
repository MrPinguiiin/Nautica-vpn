<!-- CountryList.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { ProxyData } from '$lib/types';
    import { ProxyService } from '$lib/services/proxy';

    export let selectedCountries: string[] = [];
    let countries: string[] = [];
    let isLoading = true;
    let error: string | null = null;

    onMount(async () => {
        await loadCountries();
    });

    async function loadCountries() {
        try {
            isLoading = true;
            error = null;
            
            const proxies = await ProxyService.getProxyList();
            countries = [...new Set(proxies.map(proxy => proxy.country))];
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load countries';
            console.error('Failed to load countries:', err);
        } finally {
            isLoading = false;
        }
    }

    function toggleCountry(country: string) {
        const index = selectedCountries.indexOf(country);
        if (index === -1) {
            selectedCountries = [...selectedCountries, country];
        } else {
            selectedCountries = selectedCountries.filter(c => c !== country);
        }
    }
</script>

<div class="h-full fixed top-0 w-14 bg-white dark:bg-neutral-800 border-r-2 border-neutral-800 dark:border-white z-20 overflow-y-scroll scrollbar-hide">
    <div class="text-2xl flex flex-col items-center h-full gap-2">
        {#if isLoading}
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        {:else if error}
            <div class="text-red-500 text-xs text-center">
                {error}
            </div>
        {:else}
            {#each countries as country}
                <button 
                    class="py-1 relative {selectedCountries.includes(country) ? 'scale-125' : ''} transition-transform"
                    on:click={() => toggleCountry(country)}
                >
                    <img 
                        width="20" 
                        src="https://hatscripts.github.io/circle-flags/flags/{country.toLowerCase()}.svg"
                        alt="{country} flag"
                    />
                    {#if selectedCountries.includes(country)}
                        <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    {/if}
                </button>
            {/each}
        {/if}
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