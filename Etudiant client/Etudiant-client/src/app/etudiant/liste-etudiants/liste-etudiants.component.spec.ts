import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { ListeEtudiantsComponent } from './liste-etudiants.component';
import { EtudiantService } from '../etudiant.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Etudiant } from '../Etudiant';
import { NavbarComponent } from '../navbar/navbar.component';

// Création du mock
const mockEtudiants: Etudiant[] = [
  {
    id: 1,
    nom: 'Doe',
    prenom: 'John',
    email: 'john@example.com',
    matiere: ['Physique'],
    photo: 'p1.jpg',
    createdAt: new Date(),
  },
  {
    id: 2,
    nom: 'Smith',
    prenom: 'Jane',
    email: 'jane@example.com',
    matiere: ['math'],
    photo: 'p2.jpg',
    createdAt: new Date(),
  },
  {
    id: 3,
    nom: 'Martin',
    prenom: 'Paul',
    email: 'paul@example.com',
    matiere: ['Chimie'],
    photo: 'p3.jpg',
    createdAt: new Date(),
  },
];

// Mock du service
const etudiantServiceMock = {
  getEtudiants2: jasmine
    .createSpy('getEtudiants2')
    .and.callFake(
      (page: number, size: number, name: string, matiere: string) => {
        let filtered = [...mockEtudiants];

        if (name?.trim()) {
          filtered = filtered.filter((e) =>
            e.nom.toLowerCase().includes(name.toLowerCase())
          );
        }

        if (matiere?.trim()) {
          filtered = filtered.filter((e) =>
            e.matiere.some((m) => m.toLowerCase() === matiere.toLowerCase())
          );
        }

        return of({ etudiants: filtered, pages: 1, total: filtered.length });
      }
    ),
};

describe('ListeEtudiantsComponent', () => {
  let component: ListeEtudiantsComponent;
  let fixture: ComponentFixture<ListeEtudiantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NavbarComponent,
      ],
      declarations: [],
      providers: [{ provide: EtudiantService, useValue: etudiantServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial students', () => {
    expect(component.listEtudiant.length).toBe(3);
    expect(component.totalEtudiants).toBe(6); // 3*6 pageSize
  });

  it('should filter students by name', () => {
    component.loadEtudiants('Doe', '');
    fixture.detectChanges();

    expect(component.listEtudiant.length).toBe(1);
    expect(component.listEtudiant[0].nom).toBe('Doe');
  });

  it('should filter students by matiere', () => {
    component.loadEtudiants('', 'Physique'); // appel direct
    fixture.detectChanges();

    expect(component.listEtudiant.length).toBe(1);
    expect(component.listEtudiant[0].matiere[0]).toBe('Physique');
  });

  it('should navigate to next page', () => {
    spyOn(component, 'loadEtudiants');
    component.totalEtudiants = 12;
    component.pageSize = 5;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.loadEtudiants).toHaveBeenCalled();
  });

  it('should navigate to previous page', () => {
    spyOn(component, 'loadEtudiants');
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
    expect(component.loadEtudiants).toHaveBeenCalled();
  });
});
