import Patient from "../models/Patient.js";
import Medecin from "../models/Medecin.js";
import User from "../models/User.js";
import Laboratoire from "../models/Laboratoire.js";
import Pharmacie from "../models/Pharmacie.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user;
 
      user = await User.findById(id);
 
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.Friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstname, lastname, picturePath }) => {
        return { _id, firstname, lastname, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.Friends.includes(friendId)) {
      user.Friends = user.Friends.filter((id) => id !== friendId);
      friend.Friends = friend.Friends.filter((id) => id !== id);
    } else {
      user.Friends.push(friendId);
      friend.Friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.Friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath }) => {
        return { _id, firstName, lastName,  picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const ModifieProfil = async (req, res) => {
  const { role, id } = req.params;
  let Model;

  switch (role) {
    case 'medecin':
      Model = Medecin;
      break;
    case 'patient':
      Model = Patient;
      break;
    case 'laboratory':
      Model = Laboratoire;
      break;
    case 'pharmacy':
      Model = Pharmacy;
      break;
    default:
      return res.status(400).json({ message: 'Invalid user role' });
  }

  try {
    const updatedUser = await Model.findOneAndUpdate(
      { [`Id${role.charAt(0).toUpperCase() + role.slice(1)}`]: id },
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `${role} not found` });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating ${role}:`, error);
    res.status(500




    ).json({ message: 'Internal server error' });
  }
};

export const RemoveProfile =async (req,res)=>
  {
    const { id } = req.params;

   const result = await User.deleteOne({ _id:id});
  
    res.sendStatus(200); 
  };
  
  export const getAllMedecinUsers = async (req, res) => {
    try {
      const medecins = await Medecin.find().populate({
        path: '_id',
        select: 'firstname lastname picturePath' // Select only the required fields
      });;
      const medecinUsers = await Promise.all(
        medecins.map(async (medecin) => {
          const user = await User.findById(medecin.IdMedecin);
          return { ...medecin._doc, user };
        })
      );
      res.status(200).json(medecinUsers);
    } catch (error) {
      console.error('Error fetching medecin users:', error.message);
      res.status(500).json({ error: 'Error fetching medecin users', message: error.message });
    }
  };
export const getMedecinUser = async (req, res) => {
  try {
    const { id } = req.params;
    const medecinUser = await Medecin.findOne({ IdMedecin: id });
    if (!medecinUser) {
      return res.status(404).json({ error: "Medecin user not found" });
    }
    res.status(200).json(medecinUser);
  } catch (error) {
    console.error('Error fetching medecin user:', error.message);
    res.status(500).json({ error: 'Error fetching medecin user', message: error.message });
  }
};
export const getLabsUsers = async (req, res) => {
  try {

    const laboratoires = await Laboratoire.find();
    res.status(200).json(laboratoires);
    if (!laboratoires) {
      return res.status(404).json({ error: "Laboratoire user not found" });
    }
    console.log(laboratoires)
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error });
  }
};
export const getLabsUser = async (req, res) => {
  try {
const {userId}=req.params
    const laboratoires = await Laboratoire.findOne({ IdLaboratoire: userId });
    res.status(200).json(laboratoires);
    if (!laboratoires) {
      return res.status(404).json({ error: "Laboratoire user not found" });
    }
    console.log(laboratoires)
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error });
  }
};
export const addLabAppoint = async (req, res) => {
  const {  ID } = req.params;
  const {userId} =req.body
console.log(userId)
  try {
      // Création du rendez-vous
      const rendezVous = {
          IdLaboratoire: ID,
          IdPatient: userId,
          
      };

      // Ajouter le rendez-vous au patient
      const updatedPatient = await Patient.findOneAndUpdate(
          { IdPatient: userId },
          { $push: { RendezVous: rendezVous } },
          { new: true }
      ).populate('RendezVous.IdLaboratoire');

      // Si le patient n'existe pas
      if (!updatedPatient) {
          return res.status(404).json({ message: 'Patient not found' });
      }

      // Ajouter le rendez-vous au laboratoire
      const updatedLaboratoire = await Laboratoire.findOneAndUpdate(
          { _id: ID },
          { $push: { RendezVous: rendezVous } },
          { new: true }
      );

      // Si le laboratoire n'existe pas
      if (!updatedLaboratoire) {
          return res.status(404).json({ message: 'Laboratory not found' });
      }

      // Envoyer la réponse
      res.status(200).json({ updatedPatient, updatedLaboratoire });
  } catch (error) {
      console.error('Error adding rendez-vous:', error);
      res.status(500).json({ message: 'Error adding rendez-vous' });
  }
};
export const addMedAppoint = async (req, res) => {
  const {  ID } = req.params;
  const {userId} =req.body
console.log(userId)
  try {
      // Création du rendez-vous
      const rendezVous = {
          IdMedecin: ID,
          IdPatient: userId,
          
      };

      // Ajouter le rendez-vous au patient
      const updatedPatient = await Patient.findOneAndUpdate(
          { IdPatient: userId },
          { $push: { RendezVous: rendezVous } },
          { new: true }
      ).populate('RendezVous.IdMedecin');

      // Si le patient n'existe pas
      if (!updatedPatient) {
          return res.status(404).json({ message: 'Patient not found' });
      }

      // Ajouter le rendez-vous au laboratoire
      const updatedMedecin = await Medecin.findOneAndUpdate(
          { IdMedecin: ID },
          { $push: { RendezVous: rendezVous } },
          { new: true }
      );

      // Si le laboratoire n'existe pas
      if (!updatedMedecin) {
          return res.status(404).json({ message: 'Medecin not found' });
      }

      // Envoyer la réponse
      res.status(200).json({ updatedPatient, updatedMedecin });
  } catch (error) {
      console.error('Error adding rendez-vous:', error);
      res.status(500).json({ message: 'Error adding rendez-vous' });
  }
};






export const searchByName = async (req, res) => {
  try {
    const { name } = req.params;
    const regex = new RegExp(name, 'i'); // case-insensitive search

    // Search for patients
    const patients = await Patient.find({
      $or: [{ firstname: regex }, { lastname: regex }]
    });

    // If patients found, return them
    if (patients.length > 0) {
      return res.status(200).json(patients);
    }

    // Search for doctors
    const doctors = await Medecin.find({
      $or: [{ Name: regex }, { SurName: regex }]
    });

    // If doctors found, return them
    if (doctors.length > 0) {
      return res.status(200).json(doctors);
    }

    // Search for laboratories
    const laboratories = await Laboratoire.find({ nomLaboratoire: regex });

    // If laboratories found, return them
    if (laboratories.length > 0) {
      return res.status(200).json(laboratories);
    }

    // Search for pharmacies
    const pharmacies = await Pharmacie.find({ nom: regex });

    // If pharmacies found, return them
    if (pharmacies.length > 0) {
      return res.status(200).json(pharmacies);
    }

    // If no matches found
    res.status(404).json({ message: 'No matches found' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};








// Assuming you have imported your Patient model

export const fetchPatients = async (req, res) => {
  const { patientIds } = req.params;

  if (!patientIds || !Array.isArray(patientIds)) {
    return res.status(400).json({ msg: 'Invalid patientIds provided' });
  }

  try {
    const patients = await Patient.find({ _id: { $in: patientIds } });

    if (!patients) {
      return res.status(404).json({ msg: 'Patients not found' });
    }

    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
export const fetch=()=>
  {
    const { value } = req.params;
    const filteredUsers = users.filter(user => user.firstname.toLowerCase().includes(value.toLowerCase()));
    res.status(200).json(filteredUsers);
  }

  export const updateUserProfile = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (req.file) {
        user.picturePath = req.file.filename; // Save the filename or the file path as needed
      }
  
      await user.save();
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }