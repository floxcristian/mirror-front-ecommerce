import { TestBed } from '@angular/core/testing'

import { CountdownTimerService } from './countdown-timer.service'

describe('CountdownTimerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: CountdownTimerService = TestBed.get(CountdownTimerService)
    expect(service).toBeTruthy()
  })
})
