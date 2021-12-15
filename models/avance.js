import mongoose from 'mongoose';
import { projectModel } from "./projects.js";
import {userModel} from "./user.js";

const { Schema, model } = mongoose;

const avanceSchema  = new mongoose.Schema({
    proyecto :{
        type:Schema.Types.ObjectId,
        ref:projectModel, 
        required: true,
    },  
    estudiante: {           
        type: Schema.Types.ObjectId , 
        ref: userModel, 
        required: true,
    },
    descripcion:{
        type:String, 
        required: true,
    },
    observaciones:
    {
        type:String,     
    },
    
    fechaAvance: {
        type:Date,
        required: true,
    },
    fechaObservacion: {
        type:Date, 

    },
})

const avanceModel = model("avance",avanceSchema)

export {avanceModel}
