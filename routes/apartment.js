const express = require('express');
const apartmentController = require('../controller/apartmentController')
const { validateCreatApartment, validateSearch } = require('../validation/apartmentValidation')
const router = express.Router();

router.get('/', apartmentController.getAllApartment)
router.post('/', validateCreatApartment, apartmentController.createApartment)
router.get('/search', validateSearch, apartmentController.searchApartments)
router.put('/:id', apartmentController.updateApartment)
router.get('/:id/nearbyPlaces', apartmentController.getApartmentNearbyPlaces)
router.get('/:id', apartmentController.getApartmentById)
router.delete('/:id', apartmentController.deleteApartment)



module.exports = router