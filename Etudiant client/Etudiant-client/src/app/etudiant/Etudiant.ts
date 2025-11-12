export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  photo: string;
  matiere:string[];
  //matiere: Array<string>;
  createdAt: Date;
  photoUrl?: string; 
}
