/*import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET;

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.redirect("/home-no-token");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
}
*/
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET || "default_secret_key"; // Valeur de secours

export function verifyToken(req, res, next) {
  try {
    // Récupération du token depuis le header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token manquant ou non autorisé" });
    }

    // Vérification et décodage du token
    const decoded = jwt.verify(token, SECRET_KEY);

    // On stocke les infos utilisateur dans req.user pour les utiliser dans les contrôleurs (logs, etc.)
    req.user = {
      id: decoded.id || decoded._id || null,
      nom: decoded.nom || decoded.username || decoded.email || "inconnu",
    };

    next();
  } catch (error) {
    console.error("Erreur de vérification du token:", error.message);
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
}
