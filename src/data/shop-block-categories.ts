import { Category } from '../app/shared/interfaces/category'

export const categories: Category[] = [
  {
    title: 'Insumos y herramientas',
    url: ['/', 'inicio', 'productos', 'herramientas'],
    products: 572,
    id: '1',
    image: 'assets/images/categories/CUADRADO-OPTICO-Y-RETRO-B.jpg',
    subcategories: [
      {
        title: 'Implementos de seguridad',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-EMBRAGUE.jpg',
      },
      {
        title: 'Ropa de trabajo',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--ACCESORIOS-REMOLQUE.jpg',
      },
      {
        title: 'Adhesivos y sellantes',
        url: '../productos',
        image:
          'assets/images/categories/RECTANGULAR-EMBRAGUE-ILUMINACION-REMOLQUE.jpg',
      },
      {
        title: 'Seguridad',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--FILTRACION.jpg',
      },
      {
        title: 'Reflectantes',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-ORGANIZACION.jpg',
      },
    ],
  },
  {
    title: 'Camión',
    url: ['/', 'inicio', 'productos', 'camion'],
    products: 134,
    id: '2',
    image: 'assets/images/categories/CUADRADO-ALT-MOT.jpg',
    subcategories: [
      {
        title: 'Cabina',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-EMBRAGUE.jpg',
      },
      {
        title: 'Neumaticos',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--ACCESORIOS-REMOLQUE.jpg',
      },
      {
        title: 'Extintores',
        url: '../productos',
        image:
          'assets/images/categories/RECTANGULAR-EMBRAGUE-ILUMINACION-REMOLQUE.jpg',
      },
      {
        title: 'Luces',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--FILTRACION.jpg',
      },
    ],
  },
  {
    title: 'Bus',
    url: ['/', 'inicio', 'productos', 'bus'],
    products: 301,
    id: '3',
    image: 'assets/images/categories/CUADRADO-EMBRAGUE.jpg',
    subcategories: [
      {
        title: 'Cabina',
        url: '../productos',
        image:
          'assets/images/categories/RECTANGULAR-EMBRAGUE-ILUMINACION-REMOLQUE.jpg',
      },
      {
        title: 'Neumaticos',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--FILTRACION.jpg',
      },
      {
        title: 'Extintores',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-ORGANIZACION.jpg',
      },
      {
        title: 'Luces',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-EMBRAGUE.jpg',
      },
    ],
  },
  {
    title: 'Remolque y semi remolques',
    url: ['/', 'inicio', 'productos', 'remolque'],
    products: 79,
    id: '4',
    image: 'assets/images/categories/CUADRADO-ENCHULAMIENTO.jpg',
    subcategories: [
      {
        title: 'Reflectantes',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--FILTRACION.jpg',
      },
      {
        title: 'Frenos',
        url: '../productos',
        image:
          'assets/images/categories/RECTANGULAR-EMBRAGUE-ILUMINACION-REMOLQUE.jpg',
      },
      {
        title: 'Extintores',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-ORGANIZACION.jpg',
      },
      {
        title: 'Luces',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-EMBRAGUE.jpg',
      },
    ],
  },
  {
    title: 'Baterías',
    url: ['/', 'inicio', 'productos', 'bateria'],
    products: 366,
    id: '5',
    image: 'assets/images/categories/CUADRADO-ENCHULAMIENTO.jpg',
    subcategories: [
      {
        title: 'Camiones y buses',
        url: '../productos',
        image:
          'assets/images/categories/RECTANGULAR-EMBRAGUE-ILUMINACION-REMOLQUE.jpg',
      },
      {
        title: 'Moto',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--FILTRACION.jpg',
      },
      {
        title: 'Automoviles',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-ORGANIZACION.jpg',
      },
    ],
  },
  {
    title: 'Accesorios',
    url: ['/', 'inicio', 'productos', 'accesorio'],
    products: 81,
    id: '6',
    image: 'assets/images/categories/CUADRADO-AMARRE-CARGA.jpg',
    subcategories: [
      {
        title: 'Limpieza',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR--FILTRACION.jpg',
      },
      {
        title: 'Reflectantes',
        url: '../productos',
        image:
          'assets/images/categories/RECTANGULAR-EMBRAGUE-ILUMINACION-REMOLQUE.jpg',
      },
      {
        title: 'Primeros auxilios',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-ORGANIZACION.jpg',
      },
      {
        title: 'Conos',
        url: '../productos',
        image: 'assets/images/categories/RECTANGULAR-EMBRAGUE.jpg',
      },
    ],
  },
]
