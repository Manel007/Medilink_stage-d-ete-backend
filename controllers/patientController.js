import Patient from '../models/Patient.js';
import User from '../models/User.js';
import mongoose from 'mongoose';  // Assurez-vous que mongoose est importé

// Fonction pour obtenir un patient par son ID
/*
export const getPatientById = async (req, res) => {
    try {
        const IdPatient = req.params.IdPatient; 

        const patient = await User.findById(IdPatient);
        if (!patient) {
          return res.status(404).json({ error: "Patient not found" });
        }
        res.status(200).json({ patient });
      } catch (error) {
        console.error("Error fetching Patient:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    };


*/

/*
export const getPatientByUserId = async (req, res) => {
    try {
    const { id } = req.params; // Extraire l'ID de l'utilisateur des paramètres de la requête
    // Valider le format de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid User ID" });
    }
    // Trouver l'utilisateur par ID
    const user = await User.findById(id);
    // Vérifier si l'utilisateur existe
    if (!user) {
    return res.status(404).json({ error: "User not found" });
    }
    // Extraire l'email de l'utilisateur
    const userEmail = user.email;
    // Envoyer les données du patient en réponse
    res.status(200).json(userEmail);
    } catch (error) {
    console.error("Error fetching Patient:", error);
    return res.status(500).json({ error: "Internal Server Error" });
    }
    };

*/












export const getPatientByUserId = async (req, res) => {
    try {
    const { id } = req.params; // Extraire l'ID de l'utilisateur des paramètres de la requête
    // Valider le format de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid User ID" });
    }
    // Trouver l'utilisateur par ID
    const user = await User.findById(id);
    // Vérifier si l'utilisateur existe
    if (!user) {
    return res.status(404).json({ error: "User not found" });
    }
    // Extraire l'email de l'utilisateur
    const userEmail = user.email;
      // Trouver le patient par l'email de l'utilisateur
      const patient = await Patient.findOne({userEmail })
      
  // Vérifier si le patient existe
  if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
  }
  // Envoyer les données du patient en réponse
  res.status(200).json(patient);
} catch (error) {
  console.error("Error fetching Patient:", error);
  return res.status(500).json({ error: "Internal Server Error" });
}
};