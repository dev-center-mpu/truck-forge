import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePalletComponent } from './choose-pallet.component';

describe('ChoosePalletComponent', () => {
  let component: ChoosePalletComponent;
  let fixture: ComponentFixture<ChoosePalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
