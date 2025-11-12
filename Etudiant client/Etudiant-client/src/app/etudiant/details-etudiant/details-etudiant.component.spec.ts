import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailsEtudiantComponent } from './details-etudiant.component';
import { EtudiantService } from '../etudiant.service';
import { SocketService } from '../socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';

describe('DetailsEtudiantComponent', () => {
  let component: DetailsEtudiantComponent;
  let fixture: ComponentFixture<DetailsEtudiantComponent>;
  let etudiantServiceSpy: any;
  let socketServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    // Spy pour EtudiantService
    etudiantServiceSpy = {
      getEtudiantById: jasmine.createSpy('getEtudiantById').and.returnValue(of({ id: 1, nom: 'Doe', prenom: 'John' })),
      deleteEtudiant: jasmine.createSpy('deleteEtudiant')
    };

    const socketSubject = new Subject<any>();
    socketServiceSpy = {
      onlisten: jasmine.createSpy('onlisten').and.returnValue(socketSubject.asObservable())
    };

    routerSpy = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, DetailsEtudiantComponent],
      providers: [
        { provide: EtudiantService, useValue: etudiantServiceSpy },
        { provide: SocketService, useValue: socketServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load etudiant on init', () => {
    expect(component.etudiant.id).toBe(1);
    expect(component.etudiant.nom).toBe('Doe');
    expect(component.etudiant.prenom).toBe('John');
  });

  it('should call router.navigate on updateEtudiant', () => {
    component.updateEtudiant(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/etudiants/update', 1]);
  });

  it('should call deleteEtudiant and navigate on delete', () => {
    component.delete();
    expect(etudiantServiceSpy.deleteEtudiant).toHaveBeenCalledWith(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/etudiants']);
  });
});
