export interface User {
    id?: string | number;     // Optionnel, généré par le back-end
  nom: string;
  prenom: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}