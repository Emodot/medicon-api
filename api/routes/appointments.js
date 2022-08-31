const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const AppointmentsController = require('../controllers/appointments');

router.get('/', checkAuth, AppointmentsController.get_all_appointments)

router.post('/', checkAuth, AppointmentsController.create_appointments)

router.get('/:appointmentId', checkAuth, AppointmentsController.get_single_appointment)

router.patch('/:appointmentId', checkAuth, AppointmentsController.update_single_appointment)

router.delete('/:appointmentId', checkAuth, AppointmentsController.delete_single_appointment)

module.exports = router;