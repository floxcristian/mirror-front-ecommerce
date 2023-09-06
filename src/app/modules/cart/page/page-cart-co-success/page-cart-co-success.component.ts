import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-page-cart-co-success',
  templateUrl: './page-cart-co-success.component.html',
  styleUrls: ['./page-cart-co-success.component.scss']
})
export class PageCartCoSuccessComponent implements OnInit {

  numero = 0;
 
  constructor(
    private route: ActivatedRoute,
   
  ) {
    this.route.params.subscribe(params => {
      this.numero = params.numero;
    });
  }

  ngOnInit() {
  }

}
