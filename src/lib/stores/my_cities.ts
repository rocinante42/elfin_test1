import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { City } from '$lib/types';

const defaultValue: City[] = [
	{ name: 'San Salvador', country: 'El Salvador', lat: 13.68935, lon: -89.18718, is_main: true, temp: 30 },
];
let initialValue;

if (browser) {
	const possible_value = window.localStorage.getItem('my_cities');
	// check that possible_value is not null
	if (possible_value && JSON.parse(possible_value).length > 0) {
		initialValue = JSON.parse(possible_value);
	} else {
		initialValue = defaultValue;
	}
}

const my_cities = writable<City[]>(initialValue);

export const syncCities = async (cities: City[]) => {

        const lats: string[] = [];
		const lons: string[] = [];
		const current_cities: City[] = [
			...cities,
		];
		current_cities.forEach((city) => {
			lats.push(String(city?.lat));
			lons.push(String(city?.lon));
		});
        const uri = `/api/weather/cities?lats=${lats.join(',')}&lons=${lons.join(',')}`;
		const response = await fetch(uri);
		const data = await response.json();

        if (Array.isArray(data)) {
            data.forEach((city: { current: { temperature_2m: number } }, index: number) => {
                current_cities[index].temp = city.current.temperature_2m;
            });
        } else {
            current_cities[0].temp = data.current.temperature_2m;
        }
		my_cities.set(current_cities);
}

my_cities.subscribe(async (value) => {
    console.log('my_cities', value);
	if (browser) {
		window.localStorage.setItem('my_cities', JSON.stringify(value));
	}
});

export default my_cities;
