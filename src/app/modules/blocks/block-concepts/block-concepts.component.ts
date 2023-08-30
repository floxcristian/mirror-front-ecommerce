import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-block-concepts',
  templateUrl: './block-concepts.component.html',
  styleUrls: ['./block-concepts.component.scss'],
})
export class BlockConceptsComponent implements OnInit {
  public conceptos = [
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X1000/VERTICAL-CUIDADO-DEL-VEHICULO.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'accesorios-y-limpieza-automotriz',
          ],
          type: 'normal',
          text: 'Cuidado vehiculo',
          bg: '#fd0001',
          color: '#fff',
        },
      ],
    },
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-ALT-MOT.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'motor-y-transmision',
            'motores-de-partida-y-componentes',
          ],
          type: 'normal',
          text: 'Motor de partida',
          bg: '#006cc4',
        },
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-AMARRE-CARGA.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'amarre-de-carga',
          ],
          type: 'normal',
          text: 'Carga y amarre',
          bg: '#fb7400',
        },
      ],
    },
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X1000/VERTICAL-EMBRAGUE.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'motor-y-transmision',
            'embragues',
          ],
          type: 'normal',
          text: 'embragues',
          bg: '#5D471E',
        },
        // {
        //   image: 'https://images.implementos.cl/cajas-concepto/500X500/CUADRADO-ILUMINACIÓN-REMOLQUE.png',
        //   url: '#/inicio/productos/todos/categoria/accesorios-de-iluminacion',
        //   type: 'normal'
        // },
      ],
    },
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-OPTICO-Y-RETRO-B.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'iluminacion',
            'focos',
          ],
          type: 'normal',
          text: 'Opticos',
          bg: '#002d53',
        },
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-ORGANIZACION.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'seguridad-herramientas-y-tiempo-libre',
            'cajas-y-organizadores',
          ],
          type: 'normal',
          text: 'Organización',
          bg: '#c0dff0',
          color: '#ad2910',
        },
      ],
    },
  ];

  public conceptos_mobile = [
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-CUIDADO-DEL-VEHICULO.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'accesorios-y-limpieza-automotriz',
          ],
          type: 'normal',
          text: 'Cuidado vehiculo',
          bg: '#fd0001',
          color: '#fff',
        },
      ],
    },
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-ALT-MOT.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'motor-y-transmision',
            'motores-de-partida-y-componentes',
          ],
          type: 'normal',
          text: 'Motor de partida',
          bg: '#006cc4',
        },
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-AMARRE-CARGA.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'amarre-de-carga',
          ],
          type: 'normal',
          text: 'Carga y amarre',
          bg: '#fb7400',
        },
      ],
    },
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-EMBRAGUE.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'motor-y-transmision',
            'embragues',
          ],
          type: 'normal',
          text: 'embragues',
          bg: '#5D471E',
        },
      ],
    },
    {
      hijos: [
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-OPTICO-Y-RETRO-B.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'iluminacion',
            'focos',
          ],
          type: 'normal',
          text: 'Opticos',
          bg: '#002d53',
        },
        {
          image:
            '../../../../assets/images/concepts/500X500/CUADRADO-ORGANIZACION.webp',
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            'seguridad-herramientas-y-tiempo-libre',
            'cajas-y-organizadores',
          ],
          type: 'normal',
          text: 'Organización',
          bg: '#c0dff0',
          color: '#ad2910',
        },
      ],
    },
  ];
  innerWidth: number;

  constructor() {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {}

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
