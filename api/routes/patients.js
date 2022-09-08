const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const cache_single = require('../middleware/cache-single');

const PatientsController = require('../controllers/patients');

router.get('/', checkAuth, PatientsController.get_all_patients)

router.post('/', checkAuth, PatientsController.create_patient)

router.get('/:patientId', checkAuth, cache_single, PatientsController.get_single_patient)

router.patch('/:patientId', checkAuth, PatientsController.update_patient)

router.delete('/:patientId', checkAuth, PatientsController.delete_patient)

module.exports = router;