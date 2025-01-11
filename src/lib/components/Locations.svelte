<script lang="ts">
    import type { Location } from '$lib/types';
	import { X } from 'lucide-svelte';
	import { slide, fly, fade } from 'svelte/transition';
    export let onback: () => void;
    export let locations: Location[];
</script>
<div in:fly={{duration: 400, x: 500}} out:fade={{duration: 110}} class="absolute top-0 left-0 right-0 bottom-0 colored-bg-locations">
    <div class="flex flex-col pt-6">
        <button class="pl-6" onclick={onback}><X size={26} strokeWidth={1}/></button>
        <div class="flex pl-6 flex-row">
            <div class="text-[48px] pt-8 pb-4">Locations</div>
        </div>
        <div class="flex w-full flex-row border-t border-solid border-black py-6 pl-6">
            Location 1
        </div>
    {#each locations as location}
        <div>{location.name}</div>
    {/each}
    </div>
</div>
<style>
    .colored-bg-locations {
		background-image: radial-gradient(
			circle at top right,
            #ffff 1%,
			#e2ff1a 99%
		);
	}
</style>