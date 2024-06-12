import Laboratoire from "../models/Laboratoire.js";


export const confirmAppointment = async (req, res) => {
    const { laboratoireId, appointmentId } = req.params;
    
    try {
    
      const laboratoire = await Laboratoire.findById(laboratoireId);
      if (!laboratoire) {
        return res.status(404).json({ message: 'Laboratoire not found' });
      }
      const appointment = await laboratoire.confirmAppointment(appointmentId);
      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteAppointment = async (req, res) => {
    const { laboratoireId, appointmentId } = req.params;
    
    try {
      const laboratoire = await Laboratoire.findById(laboratoireId);
      if (!laboratoire) {
        return res.status(404).json({ message: 'Laboratoire not found' });
      }
      const appointment = await laboratoire.deleteAppointment(appointmentId);
      res.status(200).json({ message: 'Appointment deleted', appointment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };