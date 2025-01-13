<script>
	import { weatherKeys } from '$lib/api/weather';
    	import {
		ThermometerSun,
		CloudSun,
		CloudFog,
		CloudRain,
		CloudLightning,
        Sun,
        CloudSnow,
        Cloudy,
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
        [weatherKeys[6]]: CloudSnow,
    }

    let weather = weatherKeys[0];
    if (rain > 0) {
        weather = weatherKeys[4];
    } else if (snow > 0) {
        weather = weatherKeys[6];
    } else if (cloud_cover > 0 && cloud_cover < 50) {
        weather = weatherKeys[1];
    } else if (cloud_cover >= 50 && cloud_cover < 90) {
        weather = weatherKeys[2];
    } else if (cloud_cover >= 90) {
        weather = weatherKeys[3];
    } else if (showers > 0) {
        weather = weatherKeys[5];
    }

</script>

<svelte:component this={weatherIcons[weather]} size="16" strokeWidth={1}></svelte:component> {weather} {appendix}
