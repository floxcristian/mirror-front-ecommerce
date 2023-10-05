import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-page-politicas-implementos',
  templateUrl: './page-politicas-implementos.component.html',
  styleUrls: ['./page-politicas-implementos.component.scss'],
})
export class PagePoliticasImplementosComponent implements OnInit {
  terminos = false
  part1 = false
  tipo: any = null
  constructor(private route: ActivatedRoute) {
    this.tipo = this.route.snapshot.paramMap.get('tipo')
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tipo = params['tipo']
      this.getTipo()
    })
  }

  getTipo() {
    if (this.tipo === 'terminos-condiciones') {
      this.terminos = true
      this.part1 = false
    } else if (this.tipo === 'cambios-devolucion') {
      this.part1 = true
      this.terminos = false
    }
  }
}
