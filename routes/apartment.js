const express = require('express');
const apartmentController = require('../controllers/apartmentController')
const { validateCreatApartment, validateSearch } = require('../validators/apartmentValidation')
const router = express.Router();
const checkRole = require('../middleware/checkRole')
const auth = require('../middleware/auth')

router.get('/', apartmentController.getAllApartment)
router.post('/', [auth, checkRole], validateCreatApartment, apartmentController.createApartment)
router.get('/search', validateSearch, apartmentController.searchApartments)
router.put('/:id', auth, apartmentController.updateApartment)
router.get('/:id/nearbyPlaces', apartmentController.getApartmentNearbyPlaces)
router.get('/agent/:id', apartmentController.getApartmentByAgent);
router.get('/:id', apartmentController.getApartmentById)
router.delete('/:id', auth, apartmentController.deleteApartment)



module.exports = router