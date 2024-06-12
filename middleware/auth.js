import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import Medecin from "../models/Medecin.js";
import Laboratoire from "../models/Laboratoire.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Log the role extracted from the token
    console.log("Role:", verified.role);

    // Vérifiez le type d'utilisateur basé sur le champ 'role' dans le token vérifié
    if (verified.role === "patient") {
      const patient = await Patient.findOne({ utilisateur: verified.id });
      if (!patient) {
        throw new Error("Patient not found"); // Specific error message for patient not found
      }
      req.user = patient;
    } else if (verified.role === "medecin") {
      const medecin = await Medecin.findOne({ utilisateur: verified.id });
      if (!medecin) {
        throw new Error("Medecin not found"); // Specific error message for medecin not found
      }
      req.user = medecin
    } else if (verified.role === "laboratoire") {
      const laboratoire = await Laboratoire.findOne({ utilisateur: verified.id });
      if (!laboratoire) {
        throw new Error("laboratoire not found"); // Specific error message for medecin not found
      }
      req.user = laboratoire;

    } else {
      throw new Error(`Invalid user role: ${verified.role}`); // Log the invalid role
    }

    next();
  } catch (err) {
    console.error("Error in verifyToken middleware:", err.message); // Log the full error message
    res.status(500).json({ error: err.message });
  }
};
