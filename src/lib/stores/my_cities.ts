import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { City } from '$lib/types';

const defaultValue: City[] = [
	{ name: 'San Salvador', country: 'El Salvador', lat: 52.52, lon: 13.41, is_main: true },
];
let initialValue;

if (browser) {
	const possible_value = window.localStorage.getItem('my_cities');
	// check that possible_value is not null
	if (possible_value) {
		initialValue = JSON.parse(possible_value);
	} else {
		initialValue = defaultValue;
	}
}

const my_cities = writable<City[]>(initialValue);

my_cities.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('my_cities', JSON.stringify(value));
	}
});

export default my_cities;
