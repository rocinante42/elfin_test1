import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { TodaysWeather } from '$lib/api/weather';


let initialValue;

if (browser) {
    const possible_value = window.localStorage.getItem('todays_weather');
    // check that possible_value is not null
    if (possible_value) {
        initialValue = JSON.parse(possible_value);
    } else {
        initialValue = undefined;
    }
}

const todays_weather = writable<TodaysWeather>(initialValue);

todays_weather.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('todays_weather', JSON.stringify(value));
    }
});

export default todays_weather;