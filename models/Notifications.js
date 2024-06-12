const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    IdPatient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Référence au modèle Patient
    required: true,
  },
  type: {
    type: String,
    enum: ['rappel_rendez_vous', 'resultat_test'],
    required: true,
  },
  message: {
    type: String, // Doit être une chaîne de caractères
    required: true,
  },
  upcomingRendezvous: {
    type: Date, // Date du prochain rendez-vous
    required: false,
  },
  datetestResult: {
    type: Date, // Résultats des tests
    required: false,
  },
 
  isRead: {
    type: Boolean,
    default: false, // Valeur par défaut    //to check whether the notification has been read by the patient or not
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
