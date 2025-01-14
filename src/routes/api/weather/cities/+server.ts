import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const lats = url.searchParams.get('lats');
        const lons = url.searchParams.get('lons');
    
        const uri = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m&forecast_days=1`

        console.log("GET /weather/cities/server.ts uri", uri);

        const response = await fetch(uri);
        const data = await response.json();
        return new Response(JSON.stringify(data));

    } catch (e) {
        return error(500, (e as Error).message);
    }
   
}