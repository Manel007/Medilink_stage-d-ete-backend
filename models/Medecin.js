// Modèle Medecin
import mongoose from "mongoose";

const medecinSchema = new mongoose.Schema({
    IdMedecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Name:String,
    SurName:String,
    Disponibilite:String,
    specialite: String,
    numeroSerie: String,
    adresse: String,
    ville: String,
    gouvernorat: String,
    RendezVous: [{
        IdRendezVous: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        DateCreation: {
            type: Date,
            default: Date.now
        },
        IdPatient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
       
    }]
});

const Medecin = mongoose.model('Medecin', medecinSchema);
export default Medecin;
