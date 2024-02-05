// Angular
import {
  Component,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { calculaIcono } from '../../../../shared/utils/utilidades';
// Libs
import { ToastrService } from 'ngx-toastr';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
// Services
import { UsersService } from '../../service/users.service';
import { SessionService } from '@core/services-v2/session/session.service';
import { SubAccountService } from '@core/services-v2/sub-account.service';
import { IConfig } from '@core/config/config.interface';
import { ConfigService } from '@core/config/config.service';

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
export class PageGestionUsuarioComponent {
  @ViewChild('idArchivoInput') idArchivoInput!: ElementRef<HTMLInputElement>;
  session!: ISession;
  nuevo: any = [];
  existe: any = [];
  archivo!: Archivo | undefined;
  idArchivo!: string;
  isExcel: Boolean = false;
  config: IConfig;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UsersService,
    private toast: ToastrService,
    private renderer: Renderer2,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly subAccountService: SubAccountService,
    public readonly configService: ConfigService
  ) {
    this.session = this.sessionService.getSession();
    this.config = this.configService.getConfig();
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
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.setProperty(this.idArchivoInput, 'value', '');
      }
    }
  }

  async uploadFile() {
    this.existe = [];
    this.nuevo = [];
    if (!this.extensionValida(this.archivo?.extension || '')) {
      this.toast.error('Debe seleccionar un archivo Excel o PDF.');
      return;
    }

    await this.subAccountService
      .createSubAccountsFromExcel({
        documentId: this.session.documentId,
        file: this.archivo?.archivo!,
      })
      .subscribe({
        next: (respuesta) => {
          if (respuesta.registered.length) {
            respuesta.registered.forEach((item: any) => {
              this.nuevo.push(item);
            });
          }
          if (respuesta.duplicated.length) {
            respuesta.duplicated.forEach((item: any) => {
              this.existe.push(item);
            });
          }
          this.userService.LoadData();
        },
        error: (err) => {
          console.log(err);
          this.toast.error(
            'Ocurrió un error al intentar subir excel de usuarios'
          );
          this.userService.LoadData();
        },
      });
  }

  crearUsuario() {
    let json = {
      data: {},
      delete: false,
      edit: false,
      raiz: this.session,
    };
    this.userService.activarModal(json);
  }

  extensionValida(extension: string): boolean {
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
