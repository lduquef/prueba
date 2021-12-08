import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema({
    correo:{
        type:String,
        requied:true,
        validate:{
            validator: async (email)=>{
                if(email.includes("@") && email.includes(".")){
                    return true;
                }else{
                    return false;
                }
            },
            message: "correo no valido ",
        },
    },
    identificacion:{
        type:String,
        require:true,
        unique:true,
    },
    nombre:{
        type:String,
        require:true,
    },
    apellido:{
        type:String,
        require:true,
    },
    rol:{
        type:String,
        require:true,
        enum:['ESTUDIANTE', 'LIDER', 'ADMINISTRADOR'],
    },
    estado:{
        type:String,
        enum:['PENDIENTE', 'AUTORIZADO', 'NO_AUTORIZADO'],
        default: 'PENDIENTE',
    },
    contrasena:{
        type:String,
        require:true,
    }
}
);
const userModel = model("user",userSchema);
export {userModel};