<script lang="ts">
	import type { City } from "$lib/types";


	import { Earth } from "lucide-svelte";
    export let cities: City[] = [];
    export let onOpenWindow: () => void;
</script>
<div class="fixed bottom-0 left-0 z-50 max-w-[100vw] md:max-h-0 md:h-[0vh] lg:h-0 lg:max-h-0 bg-elfin_yellow md:invisible">
	<div class="flex flex-row justify-between border-b border-t border-solid border-black">
		<div class="flex-grow-2 flex w-full overflow-hidden">
			<div class="flex max-h-16 items-center w-full">
				<p class="ticker flex h-[20px] md:h-0 lg:h-0">
					{#each cities as location}
						<span class="marquee mr-4">{location.name} {location.temp}°</span> 
					{/each}
				</p>
			</div>
		</div>
		<button
			type="button"
			aria-label="Locations"
			onclick={onOpenWindow}
			class="flex-grow-1 flex max-w-28 cursor-pointer items-center border-l border-solid border-black p-4"
			><Earth size="25" strokeWidth="1" /></button
		>
	</div>
</div>
<style>

	.ticker {
		animation: marquee 15s linear infinite;
		white-space: nowrap;
		overflow: hidden;
        min-width: fit-content;
	}

	@keyframes marquee {
		0% {
			transform: translate(680px, 0);
		}
		100% {
			transform: translateX(-100%);
		}
	}

</style>