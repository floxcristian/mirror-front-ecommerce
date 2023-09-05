import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';
import { LoginService } from '../../../../shared/services/login.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './page-login.component.html',
    styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent {
    constructor(
        private router: Router,
        private localS: LocalStorageService,
        private loginService: LoginService,
        private root: RootService,
        private login: LoginService
    ) {
        const u: Usuario = this.root.getDataSesionUsuario();

        if (u.user_role === 'supervisor' || u.user_role === 'comprador') { // isB2B
            const data: FormData = new FormData();

            data.append('usuario', JSON.stringify(u));
            this.login.registroSesion(data, u.id_sesion, 'cierre').then(
                (resp) => {
                    // Cerramos la sesion del usuario
                    this.localS.remove('usuario');
                    this.localS.remove('preferenciasCliente');
                    this.localS.remove('ordenCompraCargada');
                    this.localS.remove('buscadorB2B');
                    this.localS.remove('favoritos');
                    this.loginService.notify(null);

                    this.router.navigate(['/inicio'])
                        .then(() => {
                            window.location.reload();
                        });
                }
            );
        } else {
            // Cerramos la sesion del usuario
            this.localS.remove('usuario');
            this.localS.remove('preferenciasCliente');
            this.localS.remove('ordenCompraCargada');
            this.localS.remove('buscadorB2B');
            this.localS.remove('favoritos');
            this.loginService.notify(null);

            this.router.navigate(['/inicio'])
                .then(() => {
                    window.location.reload();
                });
        }

    }
}
