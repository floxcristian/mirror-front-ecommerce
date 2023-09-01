import { Component, Input } from '@angular/core';
import { CurrencyService } from '../../../../shared/services/currency.service';
import { Usuario } from '../../../../shared/interfaces/login';
import { LoginService } from '../../../../shared/services/login.service';
// import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-header-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() tipo: any = 'b2c'; // 'b2b' | 'b2c'
  @Input() desde: string = '';

  languages = [
    { name: 'English', image: 'language-1' },
    { name: 'French', image: 'language-2' },
    { name: 'German', image: 'language-3' },
    { name: 'Russian', image: 'language-4' },
    { name: 'Italian', image: 'language-5' },
  ];

  currencies = [
    { name: '€ Euro', url: '', code: 'EUR', symbol: '€' },
    { name: '£ Pound Sterling', url: '', code: 'GBP', symbol: '£' },
    { name: '$ US Dollar', url: '', code: 'USD', symbol: '$' },
    { name: '₽ Russian Ruble', url: '', code: 'RUB', symbol: '₽' },
  ];

  @Input() logo: any;
  usuario: Usuario;
  logoSrc = environment.logoSrc;

  constructor(
    public currencyService: CurrencyService,
    private router: Router,
    public loginService: LoginService,
    public localS: LocalStorageService
  ) {
    this.usuario = this.localS.get('usuario') as any;

    this.loginService.loginSessionObs$.pipe().subscribe((usuario) => {
      if (!usuario.hasOwnProperty('user_role')) {
        usuario['user_role'] = '';
      }

      this.usuario = usuario;
    });
  }

  setCurrency(currency: any): void {
    this.currencyService.options = {
      code: currency.code,
      display: currency.symbol,
    };
  }

  async validarCuenta() {
    this.localS.set('ruta', ['/', 'mi-cuenta', 'seguimiento']);
    let usuario = this.usuario;

    if (!usuario) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
      return;
    }

    if (usuario.hasOwnProperty('login_temp') && usuario.login_temp === true) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
      return;
    }

    this.usuario = usuario;

    this.router.navigate(['/mi-cuenta', 'seguimiento']);
  }

  Hide_menub2c() {
    if (this.router.url.includes('/carro-compra/')) {
      return false;
    } else {
      return true;
    }
  }
}
