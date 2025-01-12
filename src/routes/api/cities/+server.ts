import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

const get_coordinates = async (city: string) => {
    const uri = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    console.warn("GET /cities/server.ts get_coordinates uri", uri);

    const response = await fetch(uri);

    console.log("GET /cities/server.ts get_coordinates response", response);

    if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
    }

    const data = await response.json();
    return data;

}

// Gets the cities lat and lon given a city name
export const GET: RequestHandler = async({ url }) => {
    const city_name = url.searchParams.get('city_name');
    if (!city_name) {
        return error(400, 'Missing cities parameter');
    }

    try {
        const result = await get_coordinates(city_name);
        return new Response(JSON.stringify(result));
    } catch  {
        return error(500, 'Failed to fetch coordinates');
    }

};