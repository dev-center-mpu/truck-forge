import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckSetUpComponent } from './truck-set-up.component';

describe('TruckSetUpComponent', () => {
  let component: TruckSetUpComponent;
  let fixture: ComponentFixture<TruckSetUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckSetUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckSetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
