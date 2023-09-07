import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-registro-usuario-b2b',
  templateUrl: './page-registro-usuario-b2b.component.html',
  styleUrls: ['./page-registro-usuario-b2b.component.scss']
})
export class PageRegistroUsuarioB2BComponent implements OnInit {
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
