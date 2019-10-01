import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialSetUpComponent } from './initial-set-up.component';

describe('SetUpComponent', () => {
  let component: InitialSetUpComponent;
  let fixture: ComponentFixture<InitialSetUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialSetUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialSetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
