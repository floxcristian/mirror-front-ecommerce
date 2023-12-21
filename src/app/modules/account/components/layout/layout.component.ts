import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/services-v2/session/session.service';
import { MenuService } from '@core/services-v2/menu/menu.service';

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
    // ServiciosV2
    private readonly sessionService: SessionService,
    private readonly menuService: MenuService
  ) {
    const user = this.sessionService.getSession();
    this.links = this.menuService.get(user.userRole);
    if (this.localS.get('menuCollapsed')) {
      this.menuCollapsed = this.localS.get('menuCollapsed');
    }
  }

  changeMenu() {
    this.menuCollapsed = !this.menuCollapsed;
    this.localS.set('menuCollapsed', this.menuCollapsed);
  }
}
