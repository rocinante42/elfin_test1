
import { fetchWeather, type TodaysWeather} from '$lib/api/weather';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

function isMorning(date: string): boolean {
    const low_bound = dayjs(date).startOf('day').add(6, 'hour');
    const high_bound = dayjs(date).startOf('day').add(12, 'hour');

    return dayjs(date).isBetween(low_bound, high_bound);
}
function isNoon(date: string): boolean {
    const low_bound = dayjs(date).startOf('day').add(12, 'hour');
    const high_bound = dayjs(date).startOf('day').add(14, 'hour');

    return dayjs(date).isBetween(low_bound, high_bound);
}
function isAfternoon(date: string): boolean {
    const low_bound = dayjs(date).startOf('day').add(14, 'hour');
    const high_bound = dayjs(date).startOf('day').add(18, 'hour');

    return dayjs(date).isBetween(low_bound, high_bound);

}
function isNight(date: string): boolean {
    const low_bound = dayjs(date).startOf('day').add(18, 'hour');
    const high_bound = dayjs(date).startOf('day').add(24, 'hour');

    return dayjs(date).isBetween(low_bound, high_bound);
}

type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'night';

function filterByTimeOfDayAndGetMax(items: number[], dates: string[]): {[key in TimeOfDay]: number} {
    const morning: number[] = []
    const noon: number[] = []
    const afternoon: number[] = []
    const night: number[] = []

    for (let i = 0; i < dates.length; i++) {
        if (isMorning(dates[i])) {
            morning.push(items[i]);
        } else if (isNoon(dates[i])) {
            noon.push(items[i]);
        } else if (isAfternoon(dates[i])) {
            afternoon.push(items[i]);
        } else if (isNight(dates[i])) {
            night.push(items[i]);
        }
    }

    const maxMorning = Math.max(...morning);
    const maxNoon = Math.max(...noon);
    const maxAfternoon = Math.max(...afternoon);
    const maxNight = Math.max(...night);

    return {
        morning: maxMorning,
        noon: maxNoon,
        afternoon: maxAfternoon,
        night: maxNight
    }
}


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

        const day_rain = filterByTimeOfDayAndGetMax(weatherData.hourly.rain, weatherData.hourly.time);
        const day_showers = filterByTimeOfDayAndGetMax(weatherData.hourly.showers, weatherData.hourly.time);
        const day_snowfall = filterByTimeOfDayAndGetMax(weatherData.hourly.snowfall, weatherData.hourly.time);
        const day_cloudcover = filterByTimeOfDayAndGetMax(weatherData.hourly.cloud_cover, weatherData.hourly.time);


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
            cloudcover,
            morning: {
                rain: day_rain.morning,
                showers: day_showers.morning,
                snowfall: day_snowfall.morning,
                cloudcover: day_cloudcover.morning
            },
            noon: {
                rain: day_rain.noon,
                showers: day_showers.noon,
                snowfall: day_snowfall.noon,
                cloudcover: day_cloudcover.noon
            },
            afternoon: {
                rain: day_rain.afternoon,
                showers: day_showers.afternoon,
                snowfall: day_snowfall.afternoon,
                cloudcover: day_cloudcover.afternoon
            },
            night: {
                rain: day_rain.night,
                showers: day_showers.night,
                snowfall: day_snowfall.night,
                cloudcover: day_cloudcover.night
            }
        };


        return new Response(JSON.stringify(result));
    } catch (e) {
        return error(500, (e as Error).message);
    }

};
