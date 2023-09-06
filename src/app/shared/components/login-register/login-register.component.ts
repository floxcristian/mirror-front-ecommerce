import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Usuario } from '../../interfaces/login';
import { RootService } from '../../services/root.service';
declare let dataLayer: any;
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  @Output() outLogin: EventEmitter<any> = new EventEmitter();
  @Output() outInvitado: EventEmitter<any> = new EventEmitter();
  @Input() innerWidth!: number;
  @Input() invitado!: Usuario;
  constructor() {}

  ngOnInit() {
    dataLayer.push({
      event: 'profile',
      pagePath: window.location.href
    });
  }
  returnInvitado(invitado:any) {
    this.outInvitado.emit(invitado);
  }
}
