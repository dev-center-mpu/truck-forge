import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckChosenItemsComponent } from './check-chosen-items.component';

describe('CheckChosenItemsComponent', () => {
  let component: CheckChosenItemsComponent;
  let fixture: ComponentFixture<CheckChosenItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckChosenItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckChosenItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
