import { TestBed } from '@angular/core/testing';

import { PromesaService } from './promesa.service';

describe('PromesaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PromesaService = TestBed.get(PromesaService);
    expect(service).toBeTruthy();
  });
});
