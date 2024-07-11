import express from 'express';
import Consultation from '../models/Consultation.js'; // Chemin vers votre modèle Consultation
import Medecin from '../models/Medecin.js'; 

const router = express.Router();

router.post('/consultation', async (req, res) => {
    try {
        const consultation = new Consultation(req.body);
        await consultation.save();
        res.status(201).send(consultation);
    } catch (error) {
        console.error('Error creating consultation:', error);
        res.status(500).send('Failed to create consultation');
    }
});
// Route to get all interview events for a specific patientid
router.get('/consultation/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const interviewEvents = await InterviewEvent.find({ IdPatient: pid });
        res.send(interviewEvents);
    } catch (error) {
        console.error('Error fetching interview events:', error);
        res.status(500).send('Failed to fetch interview events');
    }
});
// Route to get all doctors
router.get('/medecins', async (req, res) => {
    try {
        const medecins = await Medecin.find();
        res.status(200).send(medecins);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send('Failed to fetch doctors');
    }
});
// Route to get all consultations for a specific patient
router.get('/consultations/patient/:patientId', async (req, res) => {
    const { patientId } = req.params;

    try {
        const consultations = await Consultation.find({ IdPatient: patientId });
        res.status(200).send(consultations);
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).send('Failed to fetch consultations');
    }
});
export default router;
