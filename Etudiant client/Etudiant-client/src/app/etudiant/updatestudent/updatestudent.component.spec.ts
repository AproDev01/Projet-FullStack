import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateEtudiantComponent } from './updatestudent.component';
import { EtudiantService } from '../etudiant.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

const mockEtudiant = {
  id: 1,
  nom: 'Doe',
  prenom: 'John',
  email: 'john@example.com',
  photo: 'p1.jpg',
  matiere: ['Math'],
  createdAt: new Date()
};

describe('UpdateEtudiantComponent', () => {
  let component: UpdateEtudiantComponent;
  let fixture: ComponentFixture<UpdateEtudiantComponent>;
  let etudiantServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    etudiantServiceMock = {
      getEtudiantById: jasmine.createSpy('getEtudiantById').and.returnValue(of(mockEtudiant)),
      updateEtudiant: jasmine.createSpy('updateEtudiant').and.returnValue(of(mockEtudiant))
    };

    routerMock = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [UpdateEtudiantComponent], // ✅ composant standalone
      providers: [
        { provide: EtudiantService, useValue: etudiantServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔹 important pour déclencher ngOnInit()
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load etudiant on init', () => {
    expect(etudiantServiceMock.getEtudiantById).toHaveBeenCalledWith(1);
    expect(component.etudiant).toEqual(mockEtudiant);
  });

  it('should add matiere when checkbox is checked', () => {
    component.etudiant.matiere = [];
    component.onCheckboxChange({ target: { value: 'Physique', checked: true } });
    expect(component.etudiant.matiere).toContain('Physique');
  });

  it('should remove matiere when checkbox is unchecked', () => {
    component.etudiant.matiere = ['Math', 'Physique'];
    component.onCheckboxChange({ target: { value: 'Math', checked: false } });
    expect(component.etudiant.matiere).not.toContain('Math');
    expect(component.etudiant.matiere).toContain('Physique');
  });

  it('should call updateEtudiant and navigate on submit', () => {
    component.onSubmit();
    expect(etudiantServiceMock.updateEtudiant).toHaveBeenCalledWith(1, component.etudiant);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/etudiants']);
  });

  it('should navigate back on goBack', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/etudiants']);
  });
});
