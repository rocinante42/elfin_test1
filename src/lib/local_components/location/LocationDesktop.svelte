<script lang="ts">
	import type { City } from '$lib/types';
	// @ts-ignore
	import AutoComplete from 'simple-svelte-autocomplete';
	import { X, Plus, Trash } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import my_cities from '$lib/stores/my_cities';
	const { onback, locations, onCitySelect } = $props<{
		onback: () => void;
		locations: City[];
		onCitySelect: (location: City) => void;
	}>();
	type AddingLocationState = 'idle' | 'adding';
	let addingLocationState: AddingLocationState = $state('idle');

	function addLocation() {
		console.log('add location');
		addingLocationState = 'adding';
	}

	function cancelAddLocation() {
		addingLocationState = 'idle';
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onback();
		}
	}

	interface CitySuggestion {
		name: string;
		country: string;
		latitude: number;
		longitude: number;
	}

	let fetching = $state(false);
	let selected_city: CitySuggestion | undefined = $state();

	async function handleCitySelection(city: CitySuggestion) {
		if (!city) {
			return;
		}

		let lats: string[] = [];
		let lons: string[] = [];

        let new_city = {
				name: city.name,
				country: city.country,
				lat: city.latitude,
				lon: city.longitude,
				is_main: false,
			}

		let current_cities: City[] = [
			...$my_cities,
			new_city
		];

		current_cities.forEach((city) => {
			lats.push(String(city?.lat));
			lons.push(String(city?.lon));
		});

        cancelAddLocation();

        // my_cities.update((cities) => [...cities, new_city]);
        // selected_city = undefined;

		const uri = `/api/weather/cities?lats=${lats.join(',')}&lons=${lons.join(',')}`;

		const response = await fetch(uri);
		const data = await response.json();

		data.forEach((city: { current: { temperature_2m: number } }, index: number) => {
			current_cities[index].temp = city.current.temperature_2m;
		});

		my_cities.set(current_cities);

        selected_city = undefined;
	}

	async function searchFunction(search: string) {
		try {
			fetching = true;
			const res = await fetch(`/api/cities?city_name=${search}`);
			const data = await res.json();
			console.log(data.results, 'data');
			return data.results;
		} catch (error) {
			console.error(error);
		} finally {
			fetching = false;
		}
	}
</script>


<div
	class="colored-bg-locations h-full w-full overflow-y-auto"
>
	<div class="flex flex-col pt-6">
		<button class="pl-6" onclick={onback}><X size={26} strokeWidth={1} /></button>
		<div class="flex flex-row items-center justify-between px-6 align-middle">
			<div class="pb-4 pt-8 text-[48px]">Locations</div>
			{#if addingLocationState == 'idle'}
				<button
					onclick={addLocation}
					class="h-fit translate-y-2 rounded-full border border-black p-3"><Plus /></button
				>
			{:else}
				<button
					onclick={cancelAddLocation}
					class="h-fit translate-y-2 rounded-full border border-black p-3"><X /></button
				>
			{/if}
		</div>
		{#if addingLocationState == 'adding'}
			<div class="flex w-full flex-row bg-transparent px-4 py-2">
				<AutoComplete
					tabindex="0"
					placeholder="City Name"
					{searchFunction}
					bind:selectedItem={selected_city}
					labelFieldName="name"
					showLoadingIndicator={true}
					delay={300}
					localFiltering={false}
					onChange={handleCitySelection}
					className="bg-transparent w-full"
					inputClassName="bg-transparent border-b border-black w-full p-1 items-center align-middle placeholder-black"
					dropdownClassName="bg-transparent"
					noInputStyles={true}
				>
					<div slot="item" class="bg-transparent" let:item let:label>
						{@html label}<span>, {item.admin1}, {item.country}</span>
					</div>
				</AutoComplete>
			</div>
		{/if}
		<div class="overflow-y-auto max-h-[90%]">
			{#each locations as location}
				<div
					role="button"
					tabindex="0"
					onclick={() => {
						onCitySelect(location);
						onback();
					}}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') onCitySelect(location);
					}}
					in:fly={{ duration: 200, x: 200 }}
					out:fly={{ duration: 200, x: -200 }}
					class="flex w-full flex-row justify-between border-t border-solid border-black px-6 py-6 text-lg font-[500]"
				>
					<div class="flex">{location.name}, {location.country}</div>
					
					<div class="flex gap-4">
                        {#if location.temp}
                        <div class="flex">{location.temp}° </div>
                        {/if}
						<button
							onclick={(event) => {
								// event.preventDefault();
								event.stopPropagation();
								my_cities.update((cities) => cities.filter((city) => city.lat !== location.lat && city.lon !== location.lon));
							}}
							class="h-fit"
						>
							<Trash strokeWidth={1} />
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.colored-bg-locations {
		background-image: radial-gradient(circle at top right, #ffff 1%, #e2ff1a 99%);
	}

	:global(.autocomplete-list-item) {
		background-color: #e2ff1a;
	}

	:global(.autocomplete-list) {
		background-color: #e2ff1a !important;
	}
</style>
