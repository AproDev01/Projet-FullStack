import mongoose from "mongoose";

/*
 * Schéma pour enregistrer les actions effectuées dans le système (logs d'activité)
 * Chaque document représente une action faite par un utilisateur (ajout, modification, suppression, etc.)
 */
const logSchema = new mongoose.Schema({
  // Identifiant de l’utilisateur qui a effectué l’action
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  // Type d’action réalisée (ex : ajout, modification, suppression)
  actionType: {
    type: String,
    enum: ["ajout", "modification", "suppression", "consultation"], // on limite les valeurs possibles
    required: true,
  },
  // Identifiant de l’étudiant concerné par l’action
  etudiantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Etudiant",
    default: null,
  },

  // Adresse IP de l’utilisateur qui a déclenché l’action
  ipAddress: {
    type: String,
    default: null,
  },
  // Date et heure exactes de l’action (timestamp)
  timestamp: {
    type: Date,
    default: Date.now, // Mongoose remplit automatiquement la date actuelle
  },
});

// On exporte le modèle "Log" basé sur ce schéma
export default mongoose.model("JournalAction", logSchema);
