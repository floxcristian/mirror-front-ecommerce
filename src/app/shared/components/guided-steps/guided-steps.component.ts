import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guided-steps',
  templateUrl: './guided-steps.component.html',
  styleUrls: ['./guided-steps.component.scss']
})
export class GuidedStepsComponent implements OnInit{

  @Input() step = 1;
  pages: {step: number, url: string}[] = [
    {step: 1, url: '/carro-compra/resumen'},
    {step: 2, url: '/carro-compra/metodo-de-envio'},
    {step: 3, url: '/carro-compra/forma-de-pago'},
  ]


  constructor(private router: Router) { }

  ngOnInit() {
  }

  RedirectTo(linkStep: number){
    let page = this.pages.filter(page => Number(page.step) === Number(linkStep));
    let url = page[0] && page[0].url? page[0].url : null;

    if(Number(linkStep) < Number(this.step)  && url && url.length > 0) this.router.navigate([url]);
  }

}
