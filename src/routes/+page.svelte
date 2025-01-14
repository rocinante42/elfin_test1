<!-- // TODO: Scroll on location visible background FIX!!!!!!! -->
<script lang="ts">
	import { getCountryEmoji, normalizeTemperature, numberToWords } from '$lib/local_utils';
	import { browser } from '$app/environment';
	import my_cities, { syncCities } from '$lib/stores/my_cities';
	import todays_weather from '$lib/stores/today';
	import { ThermometerSun, CloudSun, CloudFog, CloudRain, CloudLightning } from 'lucide-svelte';
	import Locations from '$lib/local_components/location/Locations.svelte';
	import type { City } from '$lib/types';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Ticker from '$lib/local_components/Ticker.svelte';
	import type { TodaysWeather } from '$lib/api/weather';
	import Legend from '$lib/local_components/Legend.svelte';

	// Ideally I'd poll the date every hour or 5 minutes or so... but this will work for now
	let date = new Date();
	let day = date.getDate();
	let day_name = date.toLocaleDateString('en-US', { weekday: 'long' });
	let month_name = date.toLocaleDateString('en-US', { month: 'long' });
	let later_today = ['morning', 'noon', 'afternoon', 'night'];
	let hour = date.getHours();
	if (hour >= 12) {
		later_today = ['noon', 'afternoon', 'night'];
	}
	if (hour >= 14) {
		later_today = ['afternoon', 'night'];
	}
	if (hour >= 18) {
		later_today = ['night'];
	}

	function laterTodayContains(time: string) {
		return later_today.findIndex((t) => t === time) !== -1;
	}

	let main_city: City = $state($my_cities?.filter((c) => c.is_main)[0]);
	function setMainCity(city: City) {
		main_city = city;
	}

	let show_locations_window = $state(false);

	const GetCityWeather = async (main_city: City): Promise<TodaysWeather | null> => {
		const params = new URLSearchParams({
			lat: String(main_city.lat),
			lon: String(main_city.lon),
			city_name: main_city.name,
			country: main_city.country
		});
		try {
			const res = await fetch(`/api/weather?${params}`);
			const data = await res.json();
			console.log(data, 'data from city');
			return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	onMount(async () => {
		if (browser) {
			if ($my_cities.length == 0) {
				show_locations_window = true;
			}
		}

		const todays = await GetCityWeather(main_city);
		if (todays) {
			todays_weather.set(todays);
		}

		// update cities data
		syncCities($my_cities);
	});

	$effect(() => {
		if (main_city) {
			GetCityWeather(main_city).then((data) => {
				if (data) {
					todays_weather.set(data);
				}
			});
		}
	});

	function openLocationsWindow() {
		show_locations_window = true;
	}
</script>

{#if show_locations_window}
	<Locations
		onback={() => {
			show_locations_window = false;
		}}
		locations={$my_cities}
		onCitySelect={setMainCity}
	/>
{/if}
<div class="flex flex-row">
<div class="container-main flex h-full min-h-[100vh] w-full flex-col bg-elfin_yellow font-sans">
	{#if $todays_weather}
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
					<div class="font-semibold">
						{getCountryEmoji($todays_weather.country || '')}
						{$todays_weather.city_name}, {$todays_weather.country}
					</div>
					<div class="font-thin">{$todays_weather.lat}° N {$todays_weather.lon}° E</div>
				</button>
				<!-- END OF LOCATION -->

				<!-- TEMPERATURE -->
				<div
					class="mt-32 text-left font-sans text-[80px] font-[300] leading-[80px] tracking-[-2px]"
				>
					<div class="flex flex-row">
						<div class="">
							{$todays_weather.current_temp &&
								numberToWords(Math.floor($todays_weather.current_temp))}<span class="font-[100]"
								>°</span
							>
						</div>
					</div>
				</div>
				<!-- END OF TEMPERATURE -->

				<!-- DATE -->
				<div class="mt-6 flex items-center gap-2 align-middle text-[20px] font-extralight">
					{day_name}
					<span class="flex h-[1px] flex-grow bg-black"></span>
					{month_name}
					{day}
				</div>
				<!-- END OF DATE -->
			</div>
		</div>
		<!-- WIDGETS -->
		<div class="flex flex-row w-full h-full md:h-[50vh] lg:h-[50vh]">
			<div class="flex flex-col w-full h-full">
				<div class="flex w-full flex-row border-t border-solid border-black py-6 pl-6">
					<div class="right-now flex w-full text-[20px]">Right Now</div>
					<div class="flex w-full flex-col">
						<div class="flex w-full flex-row items-center gap-2 text-[18px] font-extralight">
							<ThermometerSun size="16" strokeWidth="1" />
							<span class=""
								>Feels like {$todays_weather &&
									normalizeTemperature($todays_weather.feels_like, 0)}</span
							>
						</div>
						<div class="flex w-full flex-row items-center gap-2 text-[18px] font-extralight">
							<Legend
								rain={$todays_weather.rain}
								snow={$todays_weather.snowfall}
								cloud_cover={$todays_weather.cloudcover}
								showers={$todays_weather.showers}
							/>
						</div>
					</div>
				</div>
				{#if $todays_weather.afternoon && $todays_weather.night && $todays_weather.morning && $todays_weather.noon}
					<div class="flex w-full flex-row border-t border-solid border-black py-6 pl-6">
						<div class="right-now flex w-full text-[20px]">Later Today</div>
						<div class="flex w-full flex-col">
							<div
								class="flex w-full flex-row items-center gap-2 align-middle text-[18px] font-extralight"
							>
								<Legend
									rain={$todays_weather.morning.rain}
									snow={$todays_weather.morning.snowfall}
									cloud_cover={$todays_weather.morning.cloudcover}
									showers={$todays_weather.morning.showers}
									appendix="morning"
								/>
							</div>
							<div
								class="flex w-full flex-row items-center gap-2 align-middle text-[18px] font-extralight"
							>
								<Legend
									rain={$todays_weather.noon.rain}
									snow={$todays_weather.noon.snowfall}
									cloud_cover={$todays_weather.noon.cloudcover}
									showers={$todays_weather.noon.showers}
									appendix="noon"
								/>
							</div>
							<div
								class="flex w-full flex-row items-center gap-2 align-middle text-[18px] font-extralight"
							>
								<Legend
									rain={$todays_weather.afternoon.rain}
									snow={$todays_weather.afternoon.snowfall}
									cloud_cover={$todays_weather.afternoon.cloudcover}
									showers={$todays_weather.afternoon.showers}
									appendix="afternoon"
								/>
							</div>
							<div
								class="flex w-full flex-row items-center gap-2 align-middle text-[18px] font-extralight"
							>
								<Legend
									rain={$todays_weather.night.rain}
									snow={$todays_weather.night.snowfall}
									cloud_cover={$todays_weather.night.cloudcover}
									showers={$todays_weather.night.showers}
									appendix="night"
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>

			
		</div>
        
	{/if}
</div>
<div class="invisible max-w-0 md:max-w-full lg:max-w-full md:w-full lg:w-full md:visible lg:visible border-t border-solid border-black border-l">
    <Locations
        onback={() => {
            show_locations_window = false;
        }}
        locations={$my_cities}
        onCitySelect={setMainCity}
    />
</div>
</div>

<!-- END OF WIDGETS -->
<Ticker cities={$my_cities} onOpenWindow={openLocationsWindow} />

<style>
	.colored-bg {
		background-image: radial-gradient(
			circle at top right in hsl shorter hue,
			#e2ff1a 1%,
			#ffff 99%
		);
	}
</style>
