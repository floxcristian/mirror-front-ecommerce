import { Component, OnInit } from '@angular/core';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-header-b2b',
  templateUrl: './header-b2b.component.html',
  styleUrls: ['./header-b2b.component.scss'],
})
export class HeaderB2bComponent implements OnInit {
  usuario!: ISession;

  constructor(
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit() {
    // this.usuario = this.root.getDataSesionUsuario();
    this.usuario = this.sessionService.getSession();
  }
}
