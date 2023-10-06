import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../shared/interfaces/login';
import { RootService } from '../../../../shared/services/root.service';

@Component({
  selector: 'app-header-b2b',
  templateUrl: './header-b2b.component.html',
  styleUrls: ['./header-b2b.component.scss'],
})
export class HeaderB2bComponent implements OnInit {
  usuario!: Usuario;

  constructor(private root: RootService) {}

  ngOnInit() {
    this.usuario = this.root.getDataSesionUsuario();
  }
}
