import { Component, OnInit } from '@angular/core';
import { calculaIcono } from '../../../../shared/utils/utilidades';

import { UsersService } from '../../service/users.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
export interface Archivo {
  archivo: File;
  nombre: string;
  icon: string;
  extension: string;
}
@Component({
  selector: 'app-page-gestion-usuario',
  templateUrl: './page-gestion-usuario.component.html',
  styleUrls: ['./page-gestion-usuario.component.scss'],
})
export class PageGestionUsuarioComponent implements OnInit {
  userSession!: ISession;
  nuevo: any = [];
  existe: any = [];
  constructor(
    private userService: UsersService,

    private toast: ToastrService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}
  archivo!: Archivo | undefined;
  idArchivo!: string;
  isExcel: Boolean = false;
  ngOnInit() {
    this.userSession = this.sessionService.getSession(); //this.rootService.getDataSesionUsuario();
  }

  onFileChange(event: any): void {
    const files = event.target?.files as FileList;
    this.archivo = undefined;
    if (files.length) {
      const partes = files[0].name.split('.');
      const extension = partes[partes.length - 1];
      const aux: Archivo = {
        archivo: files[0],
        nombre: files[0].name,
        icon: calculaIcono(extension),
        extension,
      };

      this.archivo = aux;
      $('#' + this.idArchivo).val('');
    }
  }

  async uploadFile() {
    this.existe = [];
    this.nuevo = [];
    if (!this.extensionValida(this.archivo?.extension || '')) {
      this.toast.error('Debe seleccionar un archivo Excel o PDF.');
      return;
    }
    const data = {
      file: this.archivo?.archivo,
      id: this.userSession.documentId,
      accion: 'guardar',
    };
    let respuesta: any = await this.userService.uploadExcel(data).toPromise();
    if (respuesta.nuevo.length) {
      respuesta.nuevo.forEach((item: any) => {
        this.nuevo.push(item);
      });
    }
    if (respuesta.duplicados.length) {
      respuesta.duplicados.forEach((item: any) => {
        this.existe.push(item);
      });
    }
    this.userService.LoadData();
  }

  crearUsuario() {
    let json = {
      data: {},
      delete: false,
      edit: false,
      raiz: this.userSession,
    };
    this.userService.activarModal(json);
  }
  extensionValida(extension: string) {
    if (
      extension.toLowerCase() === 'xls' ||
      extension.toLowerCase() === 'xlsx'
    ) {
      this.isExcel = true;
      return true;
    } else {
      return false;
    }
  }
}
