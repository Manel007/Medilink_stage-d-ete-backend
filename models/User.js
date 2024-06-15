import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
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
    role: {
        type: String,
   
        enum: ['patient', 'medecin','laboratoire'],
    },
    picturePath:{type:String},
    Friends: {
        type: Array,
        default: []
    },
    medecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medecin'
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
  },
  Laboratoire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratoire'
},
    isActive: {
        type:Boolean,
        default:false
    
    } ,  
    lastLogin:Date,
    lastLogout:Date,
    lastSavedPostCreatedAt: {
        type: Date,
        default: null // You can set any default value you prefer
      },
   isAdmin: {
    type:Boolean,
    default:false

} , 
mfaCode: {
    type: String,
    
},
    });






const User = mongoose.model("User", userSchema);
export default User;
