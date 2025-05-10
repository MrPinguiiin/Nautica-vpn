<!-- +page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { DONATE_LINK } from '$lib/config/constants';
    import CountryList from '$lib/components/CountryList.svelte';
    import ProxyList from '$lib/components/ProxyList.svelte';
    import IPInfo from '$lib/components/IPInfo.svelte';
    import Notification from '$lib/components/Notification.svelte';
    import Button from '$lib/components/ui/button/button.svelte';

    let selectedCountries: string[] = $state([]);
    let showNotification = $state(false);
    let isDarkMode = $state(true);
    let hostname = $state("");
    $effect(() => {
        hostname = $page.url.hostname;
    });

    function handleCopyConfig(event: CustomEvent<string>) {
        const config = event.detail;
        navigator.clipboard.writeText(config);
        showNotification = true;
        setTimeout(() => {
            showNotification = false;
        }, 2000);
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.documentElement.classList.toggle('dark', isDarkMode);
    }

</script>

<svelte:head>
    <title>Nautica VPN</title>
</svelte:head>

<!-- Notification -->
<Notification />

<!-- Country List -->
<CountryList bind:selectedCountries />

<!-- Main Content -->
<div class="bg-white dark:bg-neutral-800 min-h-screen">
    <!-- IP Info -->
    <IPInfo />

    <div class="container mx-auto">
        <div class="sticky bg-white dark:bg-neutral-800 border-b-2 border-neutral-800 dark:border-white z-10 py-6 w-screen">
            <h1 class="text-xl text-center text-neutral-800 dark:text-white">
                Welcome to <span class="text-blue-500 font-semibold">Nautica</span>
            </h1>
        </div>

        <!-- Proxy List -->
        <ProxyList {hostname} countryFilter={selectedCountries} on:copyConfig={handleCopyConfig} />
    </div>
</div>

<!-- Footer -->
<footer>
    <div class="fixed bottom-3 right-3 flex flex-col gap-1 z-50">
        <a href={DONATE_LINK} target="_blank" rel="noopener noreferrer">
            <Button class="bg-green-500 rounded-full border-2 border-neutral-800 p-1 block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path
                        d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </Button>
        </a>

        <Button onclick={toggleDarkMode} class="bg-amber-400 rounded-full border-2 border-neutral-800 p-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
            </svg>
        </Button>
    </div>
</footer>