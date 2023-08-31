import { FormsModule } from '@angular/forms';

import {
  NgbDatepickerModule,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FiltroMagicoComponent } from './filtro-magico.component';
import { NgModule } from '@angular/core';
import { NgModelChangeDebounceDirective } from './directives/ng-model-change-debounce.directive';
import { SelectSearchMultipleComponent } from './components/select-search-multiple/select-search-multiple.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
  ],
  exports: [FiltroMagicoComponent],
  declarations: [
    FiltroMagicoComponent,
    NgModelChangeDebounceDirective,
    SelectSearchMultipleComponent,
  ],
  bootstrap: [],
})
export class FiltroMagicoModule {}
