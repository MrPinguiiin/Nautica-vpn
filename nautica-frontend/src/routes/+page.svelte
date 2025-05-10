<script lang="ts">
import { onMount } from 'svelte';
import { getProxyList } from '$lib/api';

let proxyListHtml = '';
let loading = true;
let error = '';

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
			<button 
				class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
				on:click={() => window.location.reload()}
			>
				Coba Lagi
			</button>
		</div>
	{:else}
		<div class="proxy-list">
			{@html proxyListHtml}
		</div>
	{/if}
</section>

<style>
	:global(.proxy-list a) {
		@apply text-blue-500 underline;
	}
	
	:global(.proxy-list table) {
		@apply w-full border-collapse border border-gray-300 mt-4;
	}
	
	:global(.proxy-list th, .proxy-list td) {
		@apply border border-gray-300 p-2;
	}
	
	:global(.proxy-list th) {
		@apply bg-gray-100;
	}
</style>
