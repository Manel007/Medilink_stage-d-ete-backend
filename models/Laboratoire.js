import mongoose from 'mongoose';

const rendezVousSchema = new mongoose.Schema({
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
    IdAnalyse: {
        type: mongoose.Schema.Types.ObjectId,
    },
    AnalyseNom: String,
    analyses: {
        data: Buffer,
        contentType: String,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending'
    }
});

const laboratoireSchema = new mongoose.Schema({
    nomLaboratoire: String,
    gouvernorat: String,
    municipalites: String,
    adresse: String,
    RendezVous: [rendezVousSchema]
});

// Instance method to confirm an appointment
laboratoireSchema.methods.confirmAppointment = async function (appointmentId) {
    const appointment = this.RendezVous.id(appointmentId);
    if (!appointment) {
        throw new Error('Appointment not found');
    }
    appointment.status = 'confirmed';
    await this.save();
    return appointment;
};

// Instance method to cancel an appointment
laboratoireSchema.methods.cancelAppointment = async function (appointmentId) {
    const appointment = this.RendezVous.id(appointmentId);
    if (!appointment) {
        throw new Error('Appointment not found');
    }
    appointment.status = 'canceled';
    await this.save();
    return appointment;
};

// Instance method to delete an appointment
laboratoireSchema.methods.deleteAppointment = async function (appointmentId) {
    const appointment = this.RendezVous.id(appointmentId);
    if (!appointment) {
        throw new Error('Appointment not found');
    }
    appointment.remove();
    await this.save();
    return appointment;
};

const Laboratoire = mongoose.model('Laboratoire', laboratoireSchema);
export default Laboratoire;
