<script lang="ts">
	import type { City } from "$lib/types";


	import { Earth } from "lucide-svelte";
    export let cities: City[] = [];
    export let onOpenWindow: () => void;
</script>

<footer class="sticky bottom-0 max-h-24 bg-elfin_yellow">
	<div class="flex flex-row justify-between border-b border-t border-solid border-black">
		<div class="flex-grow-2 flex w-full overflow-hidden">
			<div class="flex max-h-16 items-center w-full">
				<p class="ticker flex h-[20px] w-full">
					{#each cities as location}
						<span class="marquee mr-4">{location.name}</span>
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
</footer>
<style>

	.ticker {
		animation: marquee 15s linear infinite;
		white-space: nowrap;
		overflow: hidden;
	}

	@keyframes marquee {
		0% {
			transform: translate(100%, 0);
		}
		100% {
			transform: translate(-100%, 0);
		}
	}
</style>