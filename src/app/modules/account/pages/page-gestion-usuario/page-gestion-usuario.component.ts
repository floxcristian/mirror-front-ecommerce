import { Component, OnInit } from '@angular/core';
import { RootService } from '../../../../shared/services/root.service';
import { calculaIcono } from '../../../../shared/utils/utilidades';
import { Usuario } from '../../../../shared/interfaces/login';
import { UsersService } from '../../service/users.service';
import { ToastrService } from 'ngx-toastr';
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
  userSession!: Usuario;
  nuevo: any = [];
  existe: any = [];
  constructor(
    private userService: UsersService,
    private rootService: RootService,
    private toast: ToastrService
  ) {}
  archivo!: Archivo | undefined;
  idArchivo!: string;
  isExcel: Boolean = false;
  ngOnInit() {
    this.userSession = this.rootService.getDataSesionUsuario();
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
      id: this.userSession._id,
      accion: 'guardar',
    };
    let respuesta: any = await this.userService.uploadExcel(data).toPromise();
    if (respuesta.nuevo.length > 0) {
      respuesta.nuevo.forEach((item: any) => {
        this.nuevo.push(item);
      });
    }
    if (respuesta.duplicados.length > 0) {
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
