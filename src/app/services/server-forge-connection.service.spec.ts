import { TestBed } from '@angular/core/testing';

import { ServerForgeConnectionService } from './server-forge-connection.service';

describe('ServerForgeConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerForgeConnectionService = TestBed.get(ServerForgeConnectionService);
    expect(service).toBeTruthy();
  });
});
