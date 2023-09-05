import { Component } from '@angular/core';
import { LoginService } from '../../../../shared/services/login.service';
import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

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
    private root: RootService,
    private loginService: LoginService
  ) {
    const usuario: Usuario = this.root.getDataSesionUsuario();
    this.links = this.loginService.setRoles(usuario.user_role);
    if (this.localS.get('menuCollapsed') != null) {
      this.menuCollapsed = this.localS.get('menuCollapsed');
    }
  }

  changeMenu() {
    this.menuCollapsed = !this.menuCollapsed;
    this.localS.set('menuCollapsed', this.menuCollapsed);
  }
}
