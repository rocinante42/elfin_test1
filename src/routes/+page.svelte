<!-- // TODO: Scroll on location visible background FIX!!!!!!! -->
<script lang="ts">
	import { numberToWords } from '$lib/utils';
	import { browser } from '$app/environment';
	import my_cities from '$lib/stores/my_cities';
	import {
		ThermometerSun,
		CloudSun,
		CloudFog,
		CloudRain,
		CloudLightning,
		Earth
	} from 'lucide-svelte';
	import Locations from '$lib/components/Locations.svelte';
	import type { City } from '$lib/types';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
    import { createQuery } from '@tanstack/svelte-query';
	import Ticker from '$lib/components/Ticker.svelte';
    const today = new Date().toISOString().split('T')[0];

    const citiesQuery = createQuery({
        queryKey: ['cities'],
        queryFn: () => GetCitiesWeather(),
    })

	let { data }: { data: PageData } = $props();
	let today_temp = numberToWords(23);
	let show_locations_window = $state(false);
	let cached_cities = $my_cities;

	const GetCitiesWeather = async () => {
		const cities_names = cached_cities.map((city) => city.name);
		const params = new URLSearchParams({
			cities: cities_names.join(','),
			date: today
		});
		try {
			const res = await fetch(`/api/cities?${params}`);
			const data = await res.json();
			console.log(data, 'data from cities');
            return data;
		} catch (error) {
			console.error(error);
            return [];
		}
	};

	onMount(async () => {
		if (browser) {
			if (cached_cities.length == 0) {
                show_locations_window = true;
            }
		}
	});

	// console.log($citiesQuery, 'citiesQuery');

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
			<!-- END OF DATE -->
		</div>
	</div>
	<!-- WIDGETS -->
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
<!-- END OF WIDGETS -->
<Ticker cities={cached_cities} onOpenWindow={openLocationsWindow} />
{#if show_locations_window}
	<Locations
		onback={() => {
			show_locations_window = false;
		}}
		locations={cached_cities}
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

</style>
