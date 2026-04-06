import { TestBed } from '@angular/core/testing';

import { GramaticaService } from './gramatica.service';

describe('GramaticaService', () => {
  let service: GramaticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GramaticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
