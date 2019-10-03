import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTruckComponent } from './choose-truck.component';

describe('ChooseTruckComponent', () => {
  let component: ChooseTruckComponent;
  let fixture: ComponentFixture<ChooseTruckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseTruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
