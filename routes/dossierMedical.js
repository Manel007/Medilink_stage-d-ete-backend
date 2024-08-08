/*import express from "express";
import Patient from "../models/Patient.js";
import multer from 'multer';
import User from "../models/User.js"
import path from "path";
import { fileURLToPath } from 'url';

// Needed to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dmuploads/') // Destination directory for uploaded files
  },
  
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // File naming convention
  }
});
const upload = multer({ storage: storage });


const router = express.Router();

router.post('/uploadMedicalRecord/:userId', upload.single('dossierMedical'), async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log('User ID:', userId);
  
      // Trouver l'utilisateur par ID
      let user = await User.findById(userId);
      console.log('User:', user);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extraire l'email de l'utilisateur
      const userEmail = user.email;
      console.log('User Email:', userEmail);
  
      // Trouver le patient par email
      let patient = await Patient.findOne({ email: userEmail });
      console.log('Patient:', patient);
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
  
      // Vérifier si un fichier a été uploadé
      if (!req.file) {
        return res.status(400).json({ error: 'No medical record file uploaded' });
      }
  
      // Mettre à jour le champ dossierMedical avec le chemin du fichier uploadé
      patient.dossierMedical = req.file.path;
      console.log('patient dossierMedical:', patient.dossierMedical);
  
      // Sauvegarder le patient mis à jour
      patient = await patient.save();
  
      return res.status(200).json({ message: 'Medical record uploaded successfully', patient });
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Get Medical Record Route
router.get('/dossierMedical/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log('User ID:', userId);
  
      // Find the user by ID
      let user = await User.findById(userId);
      console.log('User:', user);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract user's email
      const userEmail = user.email;
      console.log('User Email:', userEmail);
  
      // Find the patient by email
      let patient = await Patient.findOne({ email: userEmail });
      console.log('Patient:', patient);
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
  
      // Check if the patient has a medical record
      if (!patient.dossierMedical) {
        return res.status(404).json({ error: 'No medical record found for the patient' });
      }
  
      // Send the medical record file
      const medicalRecordPath = path.join(__dirname, '..', patient.dossierMedical);
      res.sendFile(medicalRecordPath);
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;*/


/*
import express from "express";
import Patient from "../models/Patient.js";
import multer from 'multer';
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from 'url';
import archiver from 'archiver';
// Needed to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dmuploads/') // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // File naming convention
  }
});
const upload = multer({ storage: storage });

// Allow multiple file uploads
const router = express.Router();
// Get Medical Records Route
router.get('/dossierMedical/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      console.log('User ID:', userId);

      // Find the user by ID
      let user = await User.findById(userId);
      console.log('User:', user);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Extract user's email
      const userEmail = user.email;
      console.log('User Email:', userEmail);

      // Find the patient by email
      let patient = await Patient.findOne({ email: userEmail });
      console.log('Patient:', patient);

      if (!patient) {
          return res.status(404).json({ error: 'Patient not found' });
      }

      // Check if the patient has any medical records
      if (!patient.dossierMedical || patient.dossierMedical.length === 0) {
          return res.status(404).json({ error: 'No medical records found for the patient' });
      }

      // Create a ZIP archive
      const zip = archiver('zip');
      res.attachment('medical_records.zip'); // The name of the ZIP file sent to the client

      zip.pipe(res);

      // Add each file to the ZIP archive
      patient.dossierMedical.forEach(file => {
          const filePath = path.join(__dirname, '..', file);
          zip.file(filePath, { name: path.basename(file) });
      });

      // Finalize the ZIP file
      await zip.finalize();
  } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});
export default router;
*/




import express from "express";
import Patient from "../models/Patient.js";
import multer from 'multer';
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

// Needed to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dmuploads/') // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // File naming convention
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

// Get Medical Records Route
router.get('/dossierMedical/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract user's email
    const userEmail = user.email;

    // Find the patient by email
    let patient = await Patient.findOne({ email: userEmail });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if the patient has any medical records
    if (!patient.dossierMedical || patient.dossierMedical.length === 0) {
      return res.status(404).json({ error: 'No medical records found for the patient' });
    }

    // Send list of medical records with paths
    const files = patient.dossierMedical.map(file => ({
      filename: path.basename(file),
      path: file
    }));

    res.json({ files });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Download a specific medical record
router.get('/downloadMedicalRecord/:userId/:filename', async (req, res) => {
  try {
    const userId = req.params.userId;
    const filename = req.params.filename;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userEmail = user.email;

    let patient = await Patient.findOne({ email: userEmail });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const filePath = path.join(__dirname, '..', 'dmuploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
