import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtudiantService } from '../etudiant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../Gestion-user/user.service';
import { SocketService } from '../socket.service';
import { ActivatedRoute } from '@angular/router';
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,DashboardComponent,HttpClientTestingModule], 
      providers: [EtudiantService,
        UserService,
        SocketService,{
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { data: { etudiants: { total: 5 }, users: [{}, {}] } } } }
        }
      ], 
    })
    .compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize totalEtudiants and totalUsers from route data', () => {
    expect(component.totalEtudiants).toBe(5);
    expect(component.totalUsers).toBe(2);
  });
}); 
