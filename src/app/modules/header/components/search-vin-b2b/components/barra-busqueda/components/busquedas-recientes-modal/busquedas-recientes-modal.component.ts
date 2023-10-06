import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RootService } from '../../../../../../../../shared/services/root.service';
import { Flota } from '../../../../../../../../shared/interfaces/flota';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-busquedas-recientes-modal',
  templateUrl: './busquedas-recientes-modal.component.html',
  styleUrls: ['./busquedas-recientes-modal.component.scss'],
})
export class BusquedasRecientesModalComponent implements OnInit {
  busquedasRecientes!: Flota[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(public root: RootService, public ModalRef: BsModalRef) {}

  ngOnInit() {
    this.dtOptions = this.root.simpleDtOptions;
    this.dtOptions = {
      ...this.dtOptions,
      ...{ dom: '<"row"<"col-6"l><"col-6"f>><"row"<"col-6"i><"col-6"p>> t' },
    };

    this.dtTrigger.next(null);
  }
}
