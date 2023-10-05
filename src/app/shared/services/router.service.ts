// Service
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

/** A router wrapper, adding extra functions. */
@Injectable({
  providedIn: 'root',
})
export class RouterExtService {
  route!: string

  constructor(location: Location, router: Router) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.route = location.path()
      } else {
        this.route = 'Home'
      }
    })
  }

  public getPreviousUrl() {
    return this.route
  }
}
