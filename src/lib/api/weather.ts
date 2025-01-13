export interface WeatherData {
	hourly: {
		time: string[];
		temperature_2m: number[];
        apparent_temperature: number[];
        rain: number[];
        showers: number[];
        snowfall: number[];
        cloud_cover: number[];
	};
    current: {
        time: number,
        interval: number,
        temperature_2m: number,
        apparent_temperature: number,
        precipitation: number,
        rain: number,
        showers: number,
        snowfall: number,
        cloud_cover: number,
    },
}

interface TimeOfDayReport {
    rain: number;
    showers: number;
    snowfall: number;
    cloudcover: number;
}
export interface TodaysWeather {
	current_temp: number;
    feels_like: number;
    lat: number;
    lon: number;
    city_name: string;
    country: string;
    rain: number;
    showers: number;
    snowfall: number;
    cloudcover: number;
    morning: TimeOfDayReport;
    noon: TimeOfDayReport;
    afternoon: TimeOfDayReport;
    night: TimeOfDayReport;
}

export const weatherKeys = [
    'Clear sky',
    'Partly cloudy',
    'Mostly cloudy',
    'Cloudy',
    'Stormy',
    'Rainy',
    'Snowy',
]

export const fetchWeather = async (lat: number, lon: number) => {

	// const weather_api = 'https://api.open-meteo.com/v1/forecast';
    const weather_api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,cloud_cover&hourly=temperature_2m,apparent_temperature,rain,showers,snowfall,cloud_cover&forecast_days=1`

	try {
		const responses = await fetch(weather_api);
		const data = await responses.json();
        return data as WeatherData;
	} catch (e) {
		console.error(e);
		throw new Error('Failed to fetch weather data');
	}
};
