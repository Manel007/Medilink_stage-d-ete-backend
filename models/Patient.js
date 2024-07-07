// Modèle Patient
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    IdPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstname: {
        type: String,
    require:true,
        min: 2,
        max: 50,
    },
    lastname: {
        type: String,
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        min: 5,
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
        },   }],
        PhoneNumber:{
            type: Number,
        },
        Gender:{
            type:String,
        },
        Height:{
            type:String,
        },
        Weight:{
            type:String,
        },
        BloodType:{
            type:String,
        },
        Address: {
            type: String,
        },
        Birthdate:{
         type: Date,
        },
        residence_type:{
            type: String,
        },
        work_type :{
            type: String,
        },
        marital_status:{
            type: String,
        },
        Pregnancies:{
            type: Number,
        },
        smoking_status:{
            type: String,
        },
        cigsPerDay:{
            type: Number,
        },
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
