// Angular
import { Component, Input } from '@angular/core';
// Models
import { ITripDate } from '@core/services-v2/logistic-promise/models/availability-response.interface';

@Component({
  selector: 'app-fechas-promesas',
  templateUrl: './fechas-promesas.component.html',
  styleUrls: ['./fechas-promesas.component.scss'],
})
export class FechasPromesasComponent {
  @Input() promesas: ITripDate[] = [];
}
