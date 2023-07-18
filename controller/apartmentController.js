const Apartment = require('../models/apartment')
const axios = require('axios');
const { fetchNearByPlaces, getFilteredPlaces,
    getFilteredAndCategorizedPlaces } = require('../utility/mapApi')

const { validationResult } = require('express-validator')

exports.getAllApartment = async (req, res) => {
    try {
        const apartment = await Apartment.find();
        res.status(200).send({ apartment })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: "Error retrieving apartment from database" })
    }

}

exports.getApartmentById = async (req, res) => {
    try {
        const apartment = await Apartment.findById(req.params.id);
        if (!apartment) {
            return res.status(404).json({ error: "Apartment not found" })
        }

        res.status(200).send({ apartment })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}



exports.getApartmentNearbyPlaces = async (req, res) => {
    try {
        const apartment = await Apartment.findById(req.params.id);
        if (!apartment) {
            return res.status(404).json({ error: "Apartment not found" })
        }

        let nearbyPlaces;
        const types = ['restaurant', 'supermarket', 'gym']; // These can also be dynamic if needed

        if (req.query.filter && req.query.categorize) {
            nearbyPlaces = await getFilteredAndCategorizedPlaces(apartment.location.coordinates[1], apartment.location.coordinates[0], types);
        } else if (req.query.filter) {
            nearbyPlaces = await getFilteredPlaces(apartment.location.coordinates[1], apartment.location.coordinates[0], types);
        } else {
            nearbyPlaces = await fetchNearByPlaces(apartment.location.coordinates[1], apartment.location.coordinates[0], 'point_of_interest');
        }

        if (nearbyPlaces && nearbyPlaces.length > 0) {
            apartment.nearbyPlaces = nearbyPlaces
        }

        res.status(200).send({ apartment, nearbyPlaces })
    } catch (error) {
        console.error('Error fetching nearby places:', error.message);
        res.status(500).send({ error: error.message })
    }
}

exports.searchApartments = async (req, res) => {
    try {
        const { city, maxPrice, minPrice, bedrooms } = req.query;

        // Construct the query object
        let queryObj = {};
        if (city) queryObj.city = city;
        if (maxPrice || minPrice) {
            queryObj.price = {};
            if (minPrice) queryObj.price.$gte = minPrice; // $gte stands for 'greater than or equal'
            if (maxPrice) queryObj.price.$lte = maxPrice; // $lte stands for 'less than or equal'
        }

        if (bedrooms) queryObj.bedrooms = bedrooms;

        //Query the database
        const apartment = await Apartment.find(queryObj);
        res.status(200).send({ apartment })

    } catch (error) {
        console.error(error)
        res.status(500).send({ error: "Error searching for apartments" })
    }
}


exports.createApartment = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { type, image, city, price, description, available, bedrooms, bathrooms, petPolicy, amenities, formattedAddress } = req.body
    try {
        // Make a GET request to the Google Geocoding API
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: formattedAddress, // pass the address from the request
                key: process.env.GOOGLE_GEOCODING_API_KEY, // replace this with your API key
            }
        });

        // If the response has results
        if (response.data.results && response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;

            // Create new apartment
            const newApartment = new Apartment({
                type,
                image,
                location: {
                    type: 'Point',
                    coordinates: [lng, lat], // Note: GeoJSON uses longitude, latitude order
                    formattedAddress,
                    city
                },
                price,
                description,
                available,
                bedrooms,
                bathrooms,
                petPolicy,
                amenities,
            });

            const apartment = await newApartment.save();
            res.status(201).json(apartment);

        } else {
            // No results for the address
            res.status(400).json({ error: 'Could not find coordinates for the provided address.' });
        }
    } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({ error: "Error creating apartment" })
    }

}

exports.updateApartment = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: 'Request body is missing' })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    const fields = ["type", "image", "city", "price", "description", "available", "bedrooms", "bathrooms", "petPolicy", "amenities", "formattedAddress"];

    fields.forEach(field => {
        if (req.body[field]) updateData[field] = req.body[field];
    });

    try {
        // Find the apartment first
        const apartment = await Apartment.findById(req.params.id);

        if (!apartment) {
            return res.status(404).send({ error: 'Apartment not found' });
        }

        // Check if the logged-in user (agent) is the same as the one who created the apartment
        if (req.user._id.toString() !== apartment.agent.toString()) {
            return res.status(403).send({ error: 'You do not have permission to update this apartment' });
        }

        const updatedApartment = await Apartment.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).send(updatedApartment);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }

}

exports.deleteApartment = async (req, res) => {
    try {
        const apartment = await Apartment.findById(req.params.id)
        if (!apartment) {
            return res.status(404).json({ error: "Apartment not found" })
        }

        if (req.user._id.toString() !== apartment.agent.toString()) {
            return res.status(403).send({ error: 'You do not have permission to delete this apartment' })
        }

        await Apartment.findByIdAndDelete(req.params.id)
        res.status(200).send({ message: "Apartment deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "Error deleting apartment" })
    }
}