import { projectModel } from "../models/projects.js";
import { userModel } from "../models/user.js";
import { solicitudModel } from "../models/solicitud.js";
import { avanceModel } from "../models/avance.js";

const resolvers = {
  Query: {
    listarUsuarios: async (parent, args) => {
      const usuarios = await userModel.find();
      return usuarios;
    },
    consultarUsuario: async (parent, args) => {
      const usuario = await userModel.findOne({ _id: args._id });
      return usuario;
    },
    validarUsuario: async (parent, args) => {
      try {
        const usuario = await userModel.findOne({
          correo: args.correo,
          contrasena: args.contrasena,
        });
        return usuario;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    listarUsuariosEstudiantes: async (parent, args) => {
      const usuario = await userModel.find({ rol: "ESTUDIANTE" });
      return usuario;
    },
    listarProyectos: async (parent, args) => {
      try {
        const proyectos = await projectModel.find().populate("lider");
        return proyectos;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    consultarProyecto: async (parent, args) => {
      try {
        const proyecto = await projectModel
          .findOne({ _id: args.id })
          .populate("lider");
        return proyecto;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    consultarProyectosLider: async (parent, args) => {
      try {
        const proyectos = await projectModel
          .find({ lider: args.idLider })
          .populate("lider");
        return proyectos;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    consultarProyectosEstudiante: async (parent, args) => {
      let proyectoIds;
      try {
        // consulta las solicitudes del estudiante que se encuentren aceptadas
        const solicitudes = await solicitudModel.find({
          estudiante: args.idEstudiante,
          estado: "ACEPTADA",
        });

        if (solicitudes) {
          // rescata los ids de los proyectos asociados a las solicitudes que encontró
          proyectoIds = solicitudes
            ? solicitudes.map((sol) => sol.proyecto)
            : [];
          // consulta la información de cada proyecto que encontró
          const proyectos =
            proyectoIds.length > 0
              ? await projectModel
                  .find({ _id: { $in: proyectoIds } })
                  .populate("lider")
              : [];
          return proyectos;
        } else {
          throw new Error(
            "No existen solicitudes aceptadas para el estudiante indicado"
          );
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    listarAvancesProyecto: async (parent, args) => {
      const avances = await avanceModel
        .find({ proyecto: args.idProyecto })
        .populate("proyecto")
        .populate("estudiante");
      return avances;
    },
    consultarSolicitudes: async (parent, args) => {
      const solicitudes = await solicitudModel
        .find()
        .populate("proyecto")
        .populate("estudiante");
      return solicitudes;
    },
  },

  Mutation: {
    crearUsuario: async (parent, args) => {
      try {
        console.log("estoy ejecutando una creación");
        const usuarioCreado = await userModel.create({
          nombre: args.nombre,
          apellido: args.apellido,
          identificacion: args.identificacion,
          correo: args.correo,
          contrasena: args.contrasena,
          rol: args.rol,
        });
        // verifica si se ingreso un estado y modifica el de defecto
        // if (Object.keys(args).includes("estado")) {
        //   usuarioCreado.estado = args.estado;
        // }
        return usuarioCreado;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    actualizarUsuario: async (parent, args) => {
      try {
        const edicionUsuario = await userModel.findByIdAndUpdate(args._id, {
          _id: args._id,
          nombre: args.nombre,
          apellido: args.apellido,
          identificacion: args.identificacion,
          correo: args.correo,
          contrasena: args.contrasena,
          rol: args.rol,
          estado: args.estado,
        });
        return edicionUsuario;
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    crearProyecto: async (parent, args) => {
      try {
        const usuariolider = await userModel.findOne({
          _id: args.input.idLider,
        });
        if (usuariolider != null) {
          const proyectoCreado = await projectModel.create({
            nombre: args.input.nombre,
            lider: usuariolider._id,
            objetivosGenerales: args.input.objetivosGenerales,
            objetivosEspecificos: args.input.objetivosEspecificos,
            presupuesto: args.input.presupuesto,
            fase: "INICIADO",
            estado: "INACTIVO",
            apruebaCreacion: false,
          });

          const proyecto = await projectModel
            .findOne({
              nombre: args.input.nombre,
              lider: args.input.idLider,
            })
            .populate("lider");

          return proyecto;
        } else {
          throw new Error(
            "Al consultar el usuario líder indicado no hubo resultados"
          );
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    autorizaCreacionProyecto: async (parent, args) => {
      try {
        const editar = await projectModel.findByIdAndUpdate(args.id, {
          apruebaCreacion: true,
        });
        const proyecto = await projectModel
          .findOne({
            _id: args.id,
          })
          .populate("lider");
        return proyecto;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    actualizarProyecto: async (parent, args) => {
      try {
        const editar = await projectModel.findByIdAndUpdate(args.input._id, {
          nombre: args.input.nombre,
          objetivosGenerales: args.input.objetivosGenerales,
          objetivosEspecificos: args.input.objetivosEspecificos,
          presupuesto: args.input.presupuesto,
        });
        const proyecto = await projectModel
          .findOne({
            _id: args.input._id,
          })
          .populate("lider");
        return proyecto;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    actualizarEstadoProyecto: async (parent, args) => {
      try {
        const editar = await projectModel.findByIdAndUpdate(args.input._id, {
          estado: args.input.estado,
          fechaInicio: args.input.fechaInicio,
        });
        const proyecto = await projectModel
          .findOne({
            _id: args.input._id,
          })
          .populate("lider");
        return proyecto;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    actualizarFaseProyecto: async (parent, args) => {
      try {
        const editar = await projectModel.findByIdAndUpdate(args.input._id, {
          fase: args.input.fase,
        });
        const proyecto = await projectModel
          .findOne({
            _id: args.input._id,
          })
          .populate("lider");
        return proyecto;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    crearAvanceProyecto: async (parents, args) => {
      await avanceModel.create({
        proyecto: args._idProyecto,
        estudiante: args._idEstudiante,
        descripcion: args.descripcion,
        fechaAvance: args.fechaAvance,
      });
      const avance = await avanceModel
        .findOne({
          proyecto: args._idProyecto,
          estudiante: args._idEstudiante,
        })
        .populate("proyecto")
        .populate("estudiante");
      console.log(avance);
      return avance;
    },

    actualizarAvanceProyecto: async (parents, args) => {
      try {
        await avanceModel.findByIdAndUpdate(args._idAvance, {
          descripcion: args.descripcion,
          fechaAvance: args.fechaAvance,
        });
        const avance = await avanceModel
          .findOne({
            _id: args._idAvance,
          })
          .populate("proyecto")
          .populate("estudiante");
        return avance;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    actualizarObservacionProyecto: async (parents, args) => {
      try {
        await avanceModel.findByIdAndUpdate(args._idAvance, {
          observaciones: args.observaciones,
          fechaObservacion: args.fechaObservacion,
        });
        const avance = await avanceModel
          .findOne({
            _id: args._idAvance,
          })
          .populate("proyecto")
          .populate("estudiante");
        return avance;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    crearSolicitud: async (parent, args) => {
      const crearSolicitud = await solicitudModel.create({
        estado: args.estado,
        proyecto: args.proyecto,
        estudiante: args.estudiante,
        fechaIngreso: Date.now(),
      });
      const solicitud = await solicitudModel
        .findOne({
          proyecto: args.proyecto,
          estudiante: args.estudiante,
        })
        .populate("proyecto")
        .populate("estudiante");
      return solicitud;
    },

    actualizarEstadoSolicitud: async (parent, args) => {
      try {
        const solicitudAprobada = await solicitudModel
          .findByIdAndUpdate(args._id, {
            estado: args.estado,
          })
          .populate("proyecto")
          .populate("estudiante");
        return solicitudAprobada;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};
export { resolvers };
