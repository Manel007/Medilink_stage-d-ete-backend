import express from "express";
import UserModel from '../models/User.js';
//import { comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import{getPatientByUserId} from "../controllers/patientController.js"
const router = express.Router();
// Fonction pour générer un code MFA à 6 chiffres
const generateMfaCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const transporter1 = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
         user: 'medilink00@outlook.com',
          pass: 'Azertyuna1234.'
    },
    tls: {
        rejectUnauthorized: false 
    }
});
  
const sendMfaCodeByEmail = (email, code) => {
    const mailOptions = {
        from: 'medilink00@outlook.com',
        to: email,
        subject: 'MFA Code for Medilink Login',
        text: `Your MFA code for Medilink Login is: ${code}`
    };
  
    transporter1.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Endpoint pour envoyer le code MFA par e-mail
router.post('/send-mfacode', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier la présence des champs requis
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await UserModel.findOne({ email });

        // Vérifier si l'utilisateur existe
        if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });    

        // Générer un nouveau code MFA
        const mfaCodenew = generateMfaCode();
        sendMfaCodeByEmail(user.email, mfaCodenew);

        // Mettre à jour le code MFA dans la base de données
        try {
            const updatedUser = await UserModel.findOneAndUpdate(
                { email: email },
                { mfaCode: mfaCodenew },
                { new: true }
            );
            const showcode = updatedUser.mfaCode;
            res.status(200).json({ message: "MFA code has been sent via email. Check your inbox for verification", mfaCode: showcode });
        } catch (error) {
            console.error('Error updating MFA code:', error);
            return res.status(500).json({ error: "Error updating MFA code" });
        }
    } catch (error) {
        console.error('Error sending MFA code:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



// Endpoint pour le login avec MFA
router.post('/login-with-mfa', async (req, res) => {
  try {
    const { email, password, mfaCode } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMfaCodeValid = mfaCode=== user.mfaCode; 

    if (!isMfaCodeValid) {
        return res.status(400).json({ error: "Invalid MFA code" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

       // Generate JWT token with user's role
       const tokenPayload = {
        id: user._id,
        role: user.role // Include user's role in the JWT payload
     };
      const token = jwt.sign(tokenPayload,"mySuperSecretJWTKey123!");
      user.isActive=true
     user.lastLogin = new Date();
      await user.save();
      // Log the role extracted from the token
      console.log("isActive:",  user.isActive);
  
      // Return token and user data
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      console.error("Error in login method:", err.message); // Log the full error message
      res.status(500).json({ error: err.message });
    }
  
});
router.get('/patients/:id',getPatientByUserId);

export default router;