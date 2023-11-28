import { Component } from '@angular/core';
import { LoginService } from '../../../../shared/services/login.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/states-v2/session.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  links: {
    label: string;
    url: any;
    icon?: string;
    dark?: boolean;
    end?: boolean;
  }[] = [];
  menuCollapsed = false;

  constructor(
    private localS: LocalStorageService,

    private loginService: LoginService,
    // ServiciosV2
    private readonly sessionService: SessionService
  ) {
    // const usuario: Usuario = this.root.getDataSesionUsuario();
    const user = this.sessionService.getSession();
    this.links = this.loginService.setRoles(user.userRole);
    if (this.localS.get('menuCollapsed')) {
      this.menuCollapsed = this.localS.get('menuCollapsed');
    }
  }

  changeMenu() {
    this.menuCollapsed = !this.menuCollapsed;
    this.localS.set('menuCollapsed', this.menuCollapsed);
  }
}
