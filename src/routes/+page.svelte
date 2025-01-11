<script lang="ts">
	import { numberToWords } from '$lib/utils';
	import {
		ThermometerSun,
		CloudSun,
		CloudFog,
		CloudRain,
		CloudLightning,
		Earth
	} from 'lucide-svelte';
	import Locations from '$lib/components/Locations.svelte';
	let today_temp = numberToWords(23);

	let show_locations_window = $state(false);

	interface ShortLocation {
		name: string;
		temp: string;
	}

	let short_locations: ShortLocation[] = [
		{ name: 'San Salvador', temp: '23°' },
		{ name: 'Stockholm', temp: '12°' },
		{ name: 'New York', temp: '15°' },
		{ name: 'Tokyo', temp: '22°' },
		{ name: 'Sydney', temp: '30°' },
		{ name: 'Cape Town', temp: '18°' }
	];

	function openLocationsWindow() {
		show_locations_window = true;
	}
</script>

<div class="container-main flex min-h-full w-full flex-col bg-elfin_yellow font-sans">
	<div class="flex min-h-full w-full bg-white">
		<!-- TOP CONTAINER -->
		<div class="colored-bg h-full min-h-full w-full px-6 pb-12 pt-24">
			<!-- LOCATION -->
			<button
				type="button"
				onclick={openLocationsWindow}
				class="location flex cursor-pointer flex-col"
				aria-label="Open locations window"
			>
				<div class="font-semibold">🇸🇪 Örebro, Sweden</div>
				<div class="font-thin">59.2753° N 15.2134° E</div>
			</button>
			<!-- END OF LOCATION -->

			<!-- TEMPERATURE -->
			<div class="mt-32 text-left font-sans text-[80px] font-[300] leading-[80px] tracking-[-2px]">
				<div class="flex flex-row">
					<!-- <div class="flex">-</div> -->
					<div class="">{today_temp}<span class="font-[100]">°</span></div>
				</div>
			</div>
			<!-- END OF TEMPERATURE -->

			<!-- DATE -->
			<div class="mt-6 flex items-center gap-2 align-middle text-[20px] font-extralight">
				Tuesday
				<span class="flex h-[1px] flex-grow bg-black"></span>
				April 20
			</div>
		</div>
	</div>
	<div class="flex w-full flex-row border-t border-solid border-black py-6 pl-6">
		<div class="right-now flex w-full text-[20px]">Right Now</div>
		<div class="flex w-full flex-col">
			<div class="flex w-full flex-row items-center gap-2 text-[18px] font-extralight">
				<ThermometerSun size="16" strokeWidth="1" />
				<span class="">Feels like 22°</span>
			</div>
			<div class="flex w-full flex-row items-center gap-2 text-[18px] font-extralight">
				<CloudSun size="16" strokeWidth="1" />
				<span class="">Partly cloudy</span>
			</div>
		</div>
	</div>
	<div class="flex w-full flex-row border-t border-solid border-black py-6 pl-6">
		<div class="right-now flex w-full text-[20px]">Later Today</div>
		<div class="flex w-full flex-col">
			<div class="flex w-full flex-row items-center gap-2 align-middle text-[18px] font-extralight">
				<CloudFog size="16" strokeWidth="1" />
				<span class="flex">Foggy morning</span>
			</div>
			<div class="flex w-full flex-row items-center gap-2 text-[18px] font-extralight">
				<CloudSun size="16" strokeWidth="1" />
				<span class="">Cloudy noon</span>
			</div>
			<div class="flex w-full flex-row items-center gap-2 text-[18px] font-extralight">
				<CloudRain size="16" strokeWidth="1" />
				<span class="">Rainy afternoon</span>
			</div>
			<div class="flex w-full flex-row items-center gap-2 text-[18px] font-extralight">
				<CloudLightning size="16" strokeWidth="1" />
				<span class="">Stormy night</span>
			</div>
		</div>
	</div>
</div>
<footer class="sticky bottom-0 max-h-24 bg-elfin_yellow">
	<div class="flex flex-row justify-between border-b border-t border-solid border-black">
		<div class="flex flex-grow-2 overflow-hidden">
			<div
				class="flex max-h-16 items-center "
			>
				<p class="ticker w-full h-[20px] ">
					{#each short_locations as location}
						<span class="marquee mr-4">{location.name} {location.temp}</span>
					{/each}
				</p>
			</div>
		</div>
		<button
			type="button"
			aria-label="Locations"
			onclick={() => {
				// show locations window
				show_locations_window = true;
			}}
			class="flex  flex-grow-1 max-w-28 cursor-pointer items-center border-l border-solid border-black p-4"
			><Earth size="25" strokeWidth="1" /></button
		>
	</div>
</footer>
{#if show_locations_window}
	<Locations
		onback={() => {
			show_locations_window = false;
		}}
		locations={[]}
	/>
{/if}

<style>
	.colored-bg {
		background-image: radial-gradient(
			circle at top right in hsl shorter hue,
			#e2ff1a 1%,
			#ffff 99%
		);
	}

	.ticker {
		animation: marquee 12s linear infinite;
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
