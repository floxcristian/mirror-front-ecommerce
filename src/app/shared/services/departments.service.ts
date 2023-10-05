import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private areaElementSubject$: BehaviorSubject<HTMLElement | null> =
    new BehaviorSubject<HTMLElement | null>(null)

  areaElement$: Observable<HTMLElement | null> =
    this.areaElementSubject$.asObservable()

  constructor() {}

  setAreaElement(value: HTMLElement | null): void {
    this.areaElementSubject$.next(value)
  }
}
