import { TestBed } from '@angular/core/testing';

import { ChosenDataService } from './chosen-data.service';

describe('ChosenDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChosenDataService = TestBed.get(ChosenDataService);
    expect(service).toBeTruthy();
  });
});
