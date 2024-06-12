import express from 'express';
import { confirmAppointment, deleteAppointment } from '../controllers/appointment.js';



const router = express.Router();

// Route to confirm an appointment
router.patch('/:laboratoireId/appointments/:appointmentId/confirm',confirmAppointment );

// Route to delete an appointment
router.delete('/:laboratoireId/appointments/:appointmentId',deleteAppointment );

export default router;
