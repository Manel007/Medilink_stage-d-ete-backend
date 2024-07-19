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



// Route to get doctors by specialty
router.get('/medecins/specialite/:specialite', async (req, res) => {
    const { specialite } = req.params;

    try {
        const medecins = await Medecin.find({ specialite });
        res.status(200).send(medecins);
    } catch (error) {
        console.error('Error fetching doctors by specialty:', error);
        res.status(500).send('Failed to fetch doctors by specialty');
    }
});
// Endpoint pour rechercher des médecins en fonction des critères
router.get('/search', async (req, res) => {
    try {
      const { specialite, adresse, gouvernorat, disponibilite,Name } = req.query;
      const query = {};
  
      if (specialite) query.specialite = { $regex: specialite, $options: 'i' }; // recherche insensible à la casse
      if (adresse) query.adresse = { $regex: adresse, $options: 'i' }; // recherche insensible à la casse
      if (gouvernorat) query.gouvernorat = { $regex: gouvernorat, $options: 'i' }; // recherche insensible à la casse
      if (Name) query.Name = { $regex: Name, $options: 'i' }; // recherche insensible à la casse

      if (disponibilite) query.disponibilite = disponibilite === 'Available';
  
      const medecins = await Medecin.find(query);
      res.json(medecins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

export default router;
