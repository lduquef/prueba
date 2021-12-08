
import mongoose from 'mongoose'
const baseData = 'mongodb+srv://admin:1234@administracion.fjnmf.mongodb.net/database?retryWrites=true&w=majority';
const conectarBD = async ()=> {
    return await mongoose
    .connect(baseData)
    .then(()=>{
        console.log('conexion exitosa');
     })
    .catch((e)=>{
            console.error('Error conectando bd',e)
     })
}

export default conectarBD