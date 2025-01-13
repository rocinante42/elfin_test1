
import { fetchWeather, type TodaysWeather} from '$lib/api/weather';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

function findClosestDate(input: Date, sample: string[]): string | null {
    if (sample.length === 0) {
      return null; // Return null if the sample list is empty
    }
  
    // Convert input date to its timestamp for easier calculations
    const inputTime = input.getTime();
  
    // Use reduce to find the closest date
    const closestDate = sample.reduce((closest, current) => {
      const closestTime = new Date(closest).getTime();
      const currentTime = new Date(current).getTime();
  
      return Math.abs(currentTime - inputTime) < Math.abs(closestTime - inputTime)
        ? current
        : closest;
    });
    console.log("findClosestDate closestDate", new Date(closestDate).toISOString());
    return closestDate;
  }


// Gets the cities weather information given a pair of coordinates lat-lon
export const GET: RequestHandler = async ({ url }) => {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');
    const city_name = url.searchParams.get('city_name');
    const country = url.searchParams.get('country');


	if (!lat || !lon || !city_name || !country) {
		return error(400, 'Missing location parameter');
	}
    console.log("GET /weather/server.ts lat", lat);
    console.log("GET /weather/server.ts lon", lon);

    try {
        const weatherData = await fetchWeather(Number(lat), Number(lon));

        const now = new Date();
        const closestTime = findClosestDate(now, weatherData.hourly.time);
        if (!closestTime) {
            throw new Error('No weather data available');
        }
        // const index = weatherData.hourly.time.indexOf(closestTime);
        // console.log("found index is: ", index);
        // const current_temp = weatherData.hourly.temperature_2m[index];
        // const feels_like = weatherData.hourly.apparent_temperature[index];
        // const rain = weatherData.hourly.rain[index];
        // const showers = weatherData.hourly.showers[index];
        // const snowfall = weatherData.hourly.snowfall[index];
        // const cloudcover = weatherData.hourly.cloud_cover[index];

        const current_temp = weatherData.current.temperature_2m;
        const feels_like = weatherData.current.apparent_temperature;
        const rain = weatherData.current.precipitation;
        const showers = weatherData.current.showers;
        const snowfall = weatherData.current.snowfall;
        const cloudcover = weatherData.current.cloud_cover;


        const result: TodaysWeather = {
            current_temp,
            feels_like,
            lat: Number(lat),
            lon: Number(lon),
            city_name,
            country,
            rain,
            showers,
            snowfall,
            cloudcover
        };


        return new Response(JSON.stringify(result));
    } catch (e) {
        return error(500, (e as Error).message);
    }

};
