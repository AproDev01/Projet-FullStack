import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddstudentComponent } from './addstudent.component';
import { EtudiantService } from '../etudiant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddstudentComponent', () => {
  let component: AddstudentComponent;
  let fixture: ComponentFixture<AddstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,AddstudentComponent,HttpClientTestingModule], 
      providers: [EtudiantService], 
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
