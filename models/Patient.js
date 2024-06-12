// Modèle Patient
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    IdPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dossierMedical: [{
        IdDossier:{
            type: mongoose.Schema.Types.ObjectId,
        },
        analyses: {
            IdAnalyse:String,
            data: Buffer,
            contentType: String, 
            default: {}
        },
        medicaments: {
            type: String,
            default: {}
        }
    }],
    RendezVous: [{
        IdRendezVous: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        DateCreation: {
            type: Date,
            default: Date.now
        },
        IdLaboratoire: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Laboratoire',
            required: true
        },
        IdMedecin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medecin',
            required: true
        }
    }]
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
