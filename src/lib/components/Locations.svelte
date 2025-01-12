<script lang="ts">
	import type { City } from '$lib/types';
	import { X, Plus } from 'lucide-svelte';
	import { slide, fly, fade } from 'svelte/transition';
	const { onback, locations } = $props<{ onback: () => void, locations: City[] }>();


	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
            onback();
        }
	}


</script>

<svelte:window {onkeydown}/>
<div
	in:fly={{ duration: 400, x: 500 }}
	out:fade={{ duration: 110 }}
	class="colored-bg-locations sticky h-full bottom-0 left-0 right-0 top-0"
>
	<div class="flex flex-col pt-6">
		<button class="pl-6" onclick={onback}><X size={26} strokeWidth={1} /></button>
		<div class="flex flex-row items-center justify-between px-6 align-middle">
			<div class="pb-4 pt-8 text-[48px]">Locations</div>
			<button class="h-fit translate-y-2 rounded-full border border-black p-3"><Plus /></button>
		</div>
		{#each locations as location}
			<div in:fly={{duration: 200, x:200}} class="flex justify-between font-[500] w-full text-lg flex-row border-t border-solid border-black py-6 px-6">
				<div class="flex">{location.name}, {location.country}</div>
                <div class="flex">{location.temp}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.colored-bg-locations {
		background-image: radial-gradient(circle at top right, #ffff 1%, #e2ff1a 99%);
	}
</style>
