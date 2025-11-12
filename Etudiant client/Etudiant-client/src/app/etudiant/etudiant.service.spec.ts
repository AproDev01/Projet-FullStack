import { TestBed } from '@angular/core/testing';
import { EtudiantService } from './etudiant.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Etudiant } from './Etudiant';

const mockEtudiant: Etudiant = {
    id: 1,
    nom: 'Doe',
    prenom: 'John',
    email: 'john@example.com',
    photo: 'p1.jpg',
    matiere: ['Math'],
    createdAt: new Date()
  };


describe('EtudiantService', () => {
  let service: EtudiantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EtudiantService]
    });

    service = TestBed.inject(EtudiantService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'fake-token'); // pour les headers Authorization
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu’aucune requête n’est en attente
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all etudiants', () => {
    service.getEtudiants().subscribe((etudiants) => {
      expect(etudiants.length).toBe(1);
      expect(etudiants[0].nom).toBe('Doe');
    });

    const req = httpMock.expectOne('http://localhost:3000/etudiants');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush([mockEtudiant]);
  });

  it('should get etudiant by id', () => {
    service.getEtudiantById(1).subscribe((etudiant) => {
      expect(etudiant.nom).toBe('Doe');
    });

    const req = httpMock.expectOne('http://localhost:3000/etudiants/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockEtudiant);
  });

  it('should update etudiant', () => {
    const updated = { ...mockEtudiant, nom: 'Smith' };
    service.updateEtudiant(1, updated).subscribe((etudiant) => {
      expect(etudiant.nom).toBe('Smith');
    });

    const req = httpMock.expectOne('http://localhost:3000/etudiants/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('should add etudiant', () => {
    service.addEtudiant(mockEtudiant).subscribe((etudiant) => {
      expect(etudiant.nom).toBe('Doe');
    });

    const req = httpMock.expectOne('http://localhost:3000/etudiants');
    expect(req.request.method).toBe('POST');
    req.flush(mockEtudiant);
  });

  it('should delete etudiant', () => {
    service.deleteEtudiant(1);
    const req = httpMock.expectOne('http://localhost:3000/etudiants/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
