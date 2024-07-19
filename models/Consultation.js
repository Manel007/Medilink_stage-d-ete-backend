import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
    IdMedecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medecin',
        required: true
    },
    IdPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    DateConsultation: {
        type: Date,
        required: true
    },
    NomMedecin: {
        type: String
    },
    Speciality: {
        type: String
    },
    description:{
        type: String,
        required:true
      },
   
    DateCreation: {
        type: Date,
        default: Date.now
    }
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
