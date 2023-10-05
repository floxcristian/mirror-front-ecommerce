import { Subscription } from 'rxjs'
import { Directive, Output, EventEmitter, Input } from '@angular/core'
import { skip, distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { NgModel } from '@angular/forms'

@Directive({
  selector: '[ngModelChangeDebounced]',
})
export class NgModelChangeDebounceDirective {
  @Output()
  ngModelChangeDebounced = new EventEmitter<any>()
  @Input()
  ngModelChangeDebounceTime = 200

  subscription: Subscription
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  constructor(private ngModel: NgModel) {
    this.subscription = this.ngModel.control.valueChanges
      .pipe(
        skip(1), // skip initial value
        distinctUntilChanged(),
        debounceTime(this.ngModelChangeDebounceTime),
      )
      .subscribe((value) => this.ngModelChangeDebounced.emit(value))
  }
}
