import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-registro-usuario',
  templateUrl: './page-registro-usuario.component.html',
  styleUrls: ['./page-registro-usuario.component.scss']
})
export class PageRegistroUsuarioComponent implements OnInit {
  innerWidth: number;
  constructor() {
    this.innerWidth = window.innerWidth
  }

  ngOnInit() {
  }
  onResize(event:any) {
    this.innerWidth = event.target.innerWidth;

}
}
