<script lang="ts">
import { onMount } from 'svelte';
import { getProxyList } from '$lib/api';
import Button from '$lib/components/ui/button/button.svelte';

let {
	proxyListHtml = $bindable(),
	loading = $bindable(),
	error = $bindable()
}:{
	proxyListHtml: string,
	loading: boolean,
	error: string
} = $props();



onMount(async () => {
  try {
    proxyListHtml = await getProxyList();
    loading = false;
  } catch (err) {
    error = 'Gagal memuat data dari worker';
    loading = false;
    console.error(err);
  }
});
</script>

<svelte:head>
	<title>Nautica VPN</title>
	<meta name="description" content="Nautica x Badcode Serverless VPN" />
</svelte:head>

<section class="container mx-auto p-4">
	<h1 class="text-3xl font-bold mb-6">Welcome to Nautica x Badcode Serverless VPN</h1>
	
	{#if loading}
		<div class="flex justify-center">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			<p>{error}</p>
			<Button
				class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
				onclick={() => window.location.reload()}
			>
				Coba Lagi
		</Button>
		</div>
	{:else}
		<div class="proxy-list">
			{@html proxyListHtml}
		</div>
	{/if}
</section>

