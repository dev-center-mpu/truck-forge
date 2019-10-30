import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCargoComponent } from './choose-cargo.component';

describe('ChooseCargoComponent', () => {
  let component: ChooseCargoComponent;
  let fixture: ComponentFixture<ChooseCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
