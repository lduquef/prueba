import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { userModel } from "./user.js";

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  presupuesto: { type: Number, required: true },
  fechaInicio: { type: Date, required: false },
  fechaFin: { type: Date, required: false },
  estado: { type: String, Enum: ["ACTIVO", "INACTIVO"], default: "INACTIVO" },
  fase: {
    type: String,
    Enum: ["INICIADO", "DESARROLLO", "TERMINADO", "NULO"],
    default: "NULO",
  },
  lider: { type: Schema.Types.ObjectId, ref: userModel },
  objetivosGenerales: { type: String, default: " " },
  objetivosEspecificos: { type: String, default: " " },
  apruebaCreacion: { type: Boolean, default: false },
});
const projectModel = model("proyecto", projectSchema);

export { projectModel };
