// Model Pharmacie
import mongoose from 'mongoose';

const pharmacieSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        min: 2,
        max: 100,
    },
    localisation: {
        type: String,
        required: true,
    },
    numeroTelephone: {
        type: String,
        required: true,
    },
    horairesOuverture: {
        type: String,
        required: true,
    },

});

const Pharmacie = mongoose.model('Pharmacie', pharmacieSchema);
export default Pharmacie;
