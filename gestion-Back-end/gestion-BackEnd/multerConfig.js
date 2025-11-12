import multer from "multer";
import path from "path";

// Définir le stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Dossier de destination
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nom unique
    const {id,nom}=req.body;
    const ext=path.extname(file.originalname);
    const fileName=`${id}-${nom}${ext}`;
    cb(null,fileName);
  }
});
const upload=multer({storage:storage});

export default upload;