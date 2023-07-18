const axios = require('axios');
const redisClient = require('../redisClient');

const fetchNearByPlaces = async (lat, lng, type) => {
    const key = `Places:${lat}:${lng}:${type}`;

    try {
        let data = await redisClient.get(key);

        if (data !== null) {
            // Data is cached in Redis, return this data
            return JSON.parse(data);
        } else {
            // Data is not cached in Redis, make the API call
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
                params: {
                    location: `${lat},${lng}`, // pass the latitude and longitude of the apartment
                    radius: 500, // define the radius to search within
                    type: type, // pass the type of places you want to search for
                    key: process.env.GOOGLE_PLACES_API_KEY,// replace this with your Places API key
                }
            })
            console.log('Google Places API Response:', response.data);
            // Cache the API response in Redis with an expiry of 1 hour
            await redisClient.set(key, JSON.stringify(response.data.results), 'EX', 3600);

            return response.data.results;
        }
    } catch (error) {
        console.error("Error while fetching nearby places: ", error);
        throw new Error(error.message);
    }
}



const getFilteredPlaces = async (lat, lng, types) => {
    const placesResponses = await Promise.all(types.map(type => fetchNearByPlaces(lat, lng, type)));
    const places = [].concat(...placesResponses);

    return places.map(place => {
        const mapUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
        return {
            name: place.name,
            rating: place.rating,
            vicinity: place.vicinity,
            place_id: place.place_id,
            types: place.types,
            mapUrl: mapUrl,
        };
    });
}

const getFilteredAndCategorizedPlaces = async (lat, lng, types) => {
    const placesResponses = await Promise.all(types.map(type => fetchNearByPlaces(lat, lng, type)));
    const places = [].concat(...placesResponses);

    return places.reduce((categorizedPlaces, place) => {
        const mapUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

        // Determine the category of the place
        let category = types.find(type => place.types.includes(type));

        // Add the place to the appropriate category
        if (!categorizedPlaces[category]) {
            categorizedPlaces[category] = [];
        }
        place.mapUrl = mapUrl;
        categorizedPlaces[category].push(place);

        return categorizedPlaces;
    }, {});
}


module.exports = {
    fetchNearByPlaces,
    getFilteredPlaces,
    getFilteredAndCategorizedPlaces
}