import { TestBed } from '@angular/core/testing';

import { SingleplayerService } from './singleplayer.service';

describe('SingleplayerService', () => {
  let service: SingleplayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleplayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
