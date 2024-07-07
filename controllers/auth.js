import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Medecin from "../models/Medecin.js";
import Laboratoire from "../models/Laboratoire.js";
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
      user: 'medilink00@outlook.com',
      pass: 'Azertyuna1234.'
  },
  tls: {
      rejectUnauthorized: false // Trust the self-signed certificate
  }
});



export const registerUser = async (req, res) => {
  const {
     
      firstname,
      lastname,
      email,
      password,
      role,
      picturePath,
      specialite, // Pour le médecin
      numeroSerie, // Pour le médecin
      adresse, // Pour le médecin
      ville, // Pour le médecin
      gouvernorat, // Pour le médecin
      dossierMedical, // Pour le patient
      nomLaboratoire,
      municipalites, 
       PhoneNumber,
       Gender,
      Height,
      Weight,
      BloodType,
      Address,
      Birthdate, 
     residence_type, // Pour le patient
      work_type, // Pour le patient
      marital_status, // Pour le patient
      cigsPerDay, // Pour le patient
      Pregnancies, // Pour le patient
      smoking_status // Pour le patient
  } = req.body;


  try {
    const hashedPassword = await bcrypt.hash(password ,10);
    console.log("2")
    const formattedFirstname = role === "medecin" ? `Dr. ${firstname}` : firstname;
 
      // Créer un nouvel utilisateur
 // Inside the registerUser function
const newUser = await User.create({
  firstname:formattedFirstname,
  lastname,
  email,
  password: hashedPassword,
  role,
  picturePath
});
console.log("3")
if (!password) {
  return res.status(400).json({ error: 'Password is required.' });
}
      let newRecord;
      if (role === 'medecin') {
          // Si le rôle est médecin, créer un nouveau médecin avec l'ID de l'utilisateur
          newRecord = await Medecin.create({
              IdMedecin: newUser._id,
              specialite,
              numeroSerie,
              adresse,
              ville,
              gouvernorat
          });
          console.log("4")
      } else if (role === 'patient') {
          // Si le rôle est patient, créer un nouveau patient avec l'ID de l'utilisateur
          newRecord = await Patient.create({
              IdPatient: newUser._id,
              firstname,
              lastname,
              email,
              password,
              dossierMedical,
              PhoneNumber,
              Gender,
             Height,
             Weight,
             BloodType,
             Address,
             Birthdate, 
             residence_type,
             work_type,
             marital_status,
             cigsPerDay,
             Pregnancies,
             smoking_status
          });
      }else if(role === 'laboratoire'){
        newRecord = await Laboratoire.create({
    
        IdLaboratoire: newUser._id,
        nomLaboratoire,
        gouvernorat,
        municipalites,
        adresse,
      });
      }  else {
          // Si le rôle n'est ni patient ni médecin, retourner une erreur
          return res.status(400).json({ error: 'Le rôle spécifié n\'est pas valide.' });
      }
       // Envoi de l'email de bienvenue
  const mailOptions = {
    from: 'medilink00@outlook.com',
    to: email,
     subject: 'Bienvenue chez MediLink',
      text: `Bonjour ${formattedFirstname},\n\nBienvenue chez MediLink! Nous sommes ravis de vous compter parmi nous.\n\nCordialement,\nL'équipe MediLink`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    } else {
      console.log('Email envoyé : ' + info.response);
    }
  });



      res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser, record: newRecord });
   

  } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error.message);
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.', message: error.message });

  }
}; 
/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("password",password)
    const user = await User.findOne({ email: email });
  
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

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
};
export const logout = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: "No authentication token, authorization denied." });

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user by ID and set isActive to false
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    user.isActive = false;
    user.lastLogout = new Date();
    await user.save();

    res.status(200).json({ msg: "User logged out successfully." });
  } catch (err) {
    console.error("Error in logout method:", err.message); // Log the full error message
    res.status(500).json({ error: err.message });
  }
};
