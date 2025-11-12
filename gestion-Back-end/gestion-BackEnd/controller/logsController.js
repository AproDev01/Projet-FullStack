import Log from "../models/Log.js";

// Récupérer tous les logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
    .populate("userId", "nom email") // <-- ici on récupère seulement les champs "nom" et "email"
    .populate("etudiantId", "nom prenom") // <-- si tu veux aussi les infos de l'étudiant
    .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const add = async (req, res) => {
  try {
    const {userId,ipAddress, actionType, etudiantId } = req.body;
    if (!actionType || !etudiantId) {
      return res.status(400).json({ message: "actionType et etudiantId sont requis" });
    }
    const newLog = await Log.create({
      userId,
      actionType,
      etudiantId,
      ipAddress,
    });
    res.status(201).json({ message: "Log créé avec succès", log: newLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};