<script lang="ts">
	import { weatherKeys } from '$lib/api/weather';
	import {
		ThermometerSun,
		CloudSun,
		CloudFog,
		CloudRain,
		CloudLightning,
		Sun,
		CloudSnow,
		Cloudy
	} from 'lucide-svelte';

	export let rain = 0;
	export let snow = 0;
	export let cloud_cover = 0;
	export let showers = 0;
	export let appendix = '';

	const weatherIcons = {
		[weatherKeys[0]]: Sun,
		[weatherKeys[1]]: CloudSun,
		[weatherKeys[2]]: Cloudy,
		[weatherKeys[3]]: Cloudy,
		[weatherKeys[4]]: CloudLightning,
		[weatherKeys[5]]: CloudRain,
		[weatherKeys[6]]: CloudSnow
	};

	function get_weather_icon(rain: number, snow: number, cloud_cover: number, showers: number) {
		let weather = weatherKeys[0];
		if (cloud_cover > 0 && cloud_cover < 50) {
			weather = weatherKeys[1];
		} 
        if (cloud_cover >= 50 && cloud_cover < 90) {
			weather = weatherKeys[2];
		} 
        if (cloud_cover >= 90) {
			weather = weatherKeys[3];
		} 
        if (snow > 0) {
			weather = weatherKeys[6];
		} 
        if (rain > 0) {
			weather = weatherKeys[4];
		} 
        if (showers > 0) {
			weather = weatherKeys[5];
		}
		return weather;
	}
</script>

<svelte:component
	this={weatherIcons[get_weather_icon(rain, snow, cloud_cover, showers)]}
	size="16"
	strokeWidth={1}
></svelte:component>
{get_weather_icon(rain, snow, cloud_cover, showers)}
{appendix}
