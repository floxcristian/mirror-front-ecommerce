import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-page-products-categories',
  templateUrl: './page-products-categories.component.html',
  styleUrls: ['./page-products-categories.component.sass'],
})
export class PageProductsCategoriesComponent implements OnInit {
  usuario: ISession;
  editing = false;
  loadingData = true;
  modalRef!: BsModalRef;
  form!: FormGroup;
  formUploads!: FormGroup;
  imgType: string = 'image_full';
  filename!: string;
  extension!: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  preview!: string;
  percentDone: any = 0;

  constructor(
    public router: Router,
    // Services V2
    private readonly sessionService: SessionService
  ) {
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
  }

  ngOnInit() {}
}
