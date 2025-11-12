  import Etudiant from "../models/Etudiant.js";
  import { io } from "../index.js";
  import Log from "../models/Log.js";

  export async function getAllEtudinats(req, res, next) {
    /*
    //recuperer les etudiants sans pagenation
    try {
      const etudiants = await Etudiant.find({}, { _id: 0 });
      if (etudiants.length < 0) {
        res.status(200).json({
          message: "Aucun etudiant trouvé",
        });
      } else {
        res.status(200).json(etudiants);
      }
    } catch (error) {
      next(error);
    }*/
    try {
      // Récupération des paramètres de pagination envoyés par le frontend
      const page = parseInt(req.query.page) || 1; // Page actuelle (par défaut 1)
      const limit = parseInt(req.query.limit) || 5; // Nombre d'étudiants par page (par défaut 5)
      const skip = (page - 1) * limit;
      //filter
      const name = req.query.name;
      let filter = {}; //filter vide =retourne tous les etudiants

      // Récupérer les étudiants pour cette page

      //const etudiants = await Etudiant.find({}, { _id: 0 })// sans filter
      if (name) {
        //ajout du filtre sur email
        filter.nom = { $regex: name, $options: "i" };
      }
      const etudiants = await Etudiant.find(filter)
        .sort({ id: 1 }) //trie par ID
        .skip(skip) //saute les étudiants précédents
        .limit(limit); // limite à 5 étudiants par page

      // Compter le nombre total d'étudiants
      const totalEtudiants = await Etudiant.countDocuments(filter);

      // Envoyer la réponse
      res.status(200).json({
        total: totalEtudiants,
        page,
        pages: Math.ceil(totalEtudiants / limit),
        etudiants,
      });
    } catch (error) {
      next(error);
    }
  }

  export async function getEtudinatById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const etudiant = await Etudiant.findOne({ id: id });

      /*
      await Log.create({
      userId: req.user ? req.user.id : "inconnu",
      actionType: "consultation",
      etudiantId: etudiant ? etudiant._id : null,
      ipAddress: req.ip,
    });*/


      res.status(200).json(etudiant);
    } catch (error) {
      next(error);
    }
  }

  export async function addEtudiant(req, res, next) {
    try {
      const newEtudiant = req.body;
      const etudiantCree = await Etudiant.create(newEtudiant);
      /*
    await Log.create({
      userId: req.user ? req.user.id : "inconnu",
      actionType: "ajout",
      etudiantId: etudiantCree._id,
      ipAddress: req.ip,
    });*/
      // Notifie tous les clients que l'étudiant a été ajouté
      io.emit("etudiantAdded",  {nom: etudiantCree.nom,
        prenom: etudiantCree.prenom});

      res.status(201).json(etudiantCree);
    } catch (error) {
      next(error);
    }
  }
  export const uploadFile = async (req, res) => {
    try {
       console.log("req.body:", req.body);
    console.log("req.file:", req.file);
      const { id, nom, prenom, email, matiere } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier reçu" });
      }

      const photoUrl = `http://localhost:3000/uploads/${req.file.filename}`;

      // Créer le nouvel étudiant
      const newStudent = { id, nom, prenom, email, matiere, photoUrl };
      const Etu = new Etudiant(newStudent);
      await Etu.save();

      /* Journalisation
    await Log.create({
      userId: req.user ? req.user.id : "inconnu",
      actionType: "ajout",
      etudiantId: Etu._id,
      ipAddress: req.ip,
    });*/

      res.status(200).json({
        message: "Étudiant ajouté avec succès",
        student: Etu
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  export async function updateEtudiant(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const updatedEtudiant = req.body;
      const etudiantApres = await Etudiant.findOne({ id: id });
      await Etudiant.updateOne({ id: id }, updatedEtudiant);
       /*  Journalisation
    await Log.create({
      userId: req.user ? req.user.id : "inconnu",
      actionType: "modification",
      etudiantId: etudiantAvant._id,
      ipAddress: req.ip,
    });*/

      io.emit("etudiantUpdated", {
        nom: etudiantApres.nom,
        prenom: etudiantApres.prenom,
      });
      res.status(200).json(updatedEtudiant);
    } catch (error) {
      next(error);
    }
  }

  export async function deleteEtudiant(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const etudiant = await Etudiant.findOne({ id: id });

      await Etudiant.deleteOne({ id: id });
      /*  Journalisation
   await Log.create({
      userId: req.user ? req.user.id : "inconnu",
      actionType: "suppression",
      etudiantId: etudiant._id,
      ipAddress: req.ip,
    }); */
      //  Notifie tous les clients que l'étudiant a été supprimé
      io.emit("etudiantDeleted", { nom: etudiant.nom, prenom: etudiant.prenom });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
