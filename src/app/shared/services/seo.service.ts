import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private http: HttpClient,
    private meta: Meta,
    private title: Title
  ) {}

  getGetMetadata(location: string) {
    let params = new HttpParams().set(
      'locations',
      encodeURIComponent(JSON.stringify(location))
    );
    return this.http.get(environment.apiCMS + 'metadata/', { params: params });
  }

  generarMetaTag(config: any) {
    // tslint:disable-next-line: max-line-length
    const desc =
      'Baterías, Lubricantes, Amarre de carga, Iluminación, todo para mantener, reparar y equipar. 32 puntos de venta en todo Chile.';
    const titulo =
      'Implementos – Repuestos para Camiones, Buses y Remolques 🚚 🚛';
    const keywords =
      'Camión, bus, remolque, semirremolque, repuestos de camion, insumos para camion, accesorios de camion, camiones,  buses, repuestos de buses, insumos para buses, accesorios de buses,  agroinsumos, iluminacion, baterias, amarre de carga, cromados de camion, camionero, lubricantes, llantas de camion, neumaticos de camion, randon, volare, marcopolo';

    config = {
      title: titulo,
      description: desc,
      image: 'https://www.implementos.cl/assets/images/homepage.jpg',
      imageAlt: desc,
      imageType: null,
      type: 'website',
      slug: '',
      keywords,
      ...config,
    };

    this.title.setTitle(config.title);
    this.meta.updateTag({ property: 'og:type', content: config.type });
    this.meta.updateTag({
      property: 'og:site_name',
      content: 'Epysa Implementos S.A.',
    });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });

    this.meta.updateTag({ property: 'og:image', content: config.image });

    this.meta.updateTag({
      property: 'og:image:alt',
      content: config.imageAlt,
    });
    this.meta.updateTag({ property: 'og:locale', content: 'es_CL' });
    this.meta.updateTag({
      property: 'og:url',
      content: `https://www.implementos.cl${config.slug}`,
    });
    this.meta.updateTag({ property: 'og:keywords', content: config.keywords });

    this.meta.updateTag({ name: 'title', content: config.title });
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords });
  }
}
