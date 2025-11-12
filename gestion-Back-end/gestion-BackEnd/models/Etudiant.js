import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const etudiantSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matiere: { type: [String], default: [] },
    photoUrl: { type: String }
  },
  { timestamps: true }
);

etudiantSchema.plugin(AutoIncrement, { inc_field: "id" });

const Etudiant = mongoose.model("Etudiant", etudiantSchema);
export default Etudiant;
