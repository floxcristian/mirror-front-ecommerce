import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  constructor(private http: HttpClient) {}

  /* Especiales */

  obtenerEspeciales() {
    var call = environment.apiCMS + `specials/`;
    return this.http.get(call);
  }

  crearEspecial(data: any) {
    var call = environment.apiCMS + `specials`;
    return this.http.post(call, data);
  }

  updateEspecial(data: any) {
    var call = environment.apiCMS + `specials/` + data['_id'];
    return this.http.patch(call, data);
  }

  deleteEspecial(data: any) {
    var call = environment.apiCMS + `specials/` + data['_id'];
    return this.http.delete(call, data);
  }

  obtenerEspecialesContenidos() {
    var call = environment.apiCMS + `specials-contents/`;
    return this.http.get(call);
  }

  crearEspecialContenido(data: any) {
    var call = environment.apiCMS + `specials-contents`;
    return this.http.post(call, data);
  }

  updateEspecialContenido(data: any) {
    var call = environment.apiCMS + `specials-contents/` + data['_id'];
    return this.http.patch(call, data);
  }

  deleteEspecialContenido(data: any) {
    var call = environment.apiCMS + `specials-contents/` + data['_id'];
    return this.http.delete(call, data);
  }

  /* Productos Homepage */

  obtenerProductosHomepage() {
    var call = environment.apiCMS + `products-section/`;
    return this.http.get(call);
  }

  crearProductoHomepage(data: any) {
    var call = environment.apiCMS + `products-section`;
    return this.http.post(call, data);
  }

  updateProductoHomepage(data: any) {
    var call = environment.apiCMS + `products-section/` + data['_id'];
    return this.http.patch(call, data);
  }

  deleteProductosHomepage(data: any) {
    var call = environment.apiCMS + `products-section/` + data['_id'];
    return this.http.delete(call, data);
  }

  deleteCache() {
    var call = environment.apiElastic + 'clear-cache';
    //console.log(call);
    return this.http.get(call);
  }

  /* Nuevos Productos */

  obtenerNuevosProductos() {
    var call = environment.apiCMS + 'products/new-products';
    return this.http.get(call);
  }

  obtenerCategorias() {
    var call = environment.apiCMS + 'categories';
    return this.http.get(call);
  }

  asignarCategorias(data: any) {
    var call = environment.apiCMS + 'products/assign-categories';
    return this.http.post(call, data);
  }

  async obtenerCategoriaL1() {
    var call = environment.apiCMS + `products/level_categorias/1`;
    let consulta: any = null;
    consulta = await this.http.get(call).toPromise();

    return consulta.data;
  }

  async obtenerSubcategoria(parent_id: string) {
    var call = environment.apiCMS + `products/subcategoria/${parent_id}`;
    let consulta: any = null;
    consulta = await this.http.get(call).toPromise();
    return consulta.data;
  }

  /* Images */

  obtenerImagenes() {
    var call = environment.apiCMS + `images/`;
    return this.http.get(call);
  }

  crearImagen(data: any) {
    var call = environment.apiCMS + `images`;
    return this.http.post(call, data);
  }

  updateImage(data: any) {
    var call = environment.apiCMS + `images/` + data['_id'];
    return this.http.patch(call, data);
  }

  deleteImage(data: any) {
    var call = environment.apiCMS + `images/` + data['_id'];
    return this.http.delete(call, data);
  }

  /* Banners */

  obtenerBanners() {
    var call = environment.apiCMS + `banners/`;
    return this.http.get(call);
  }

  crearBanner(data: any) {
    var call = environment.apiCMS + `banners`;
    return this.http.post(call, data);
  }

  updateBanner(data: any) {
    var call = environment.apiCMS + `banners/` + data['_id'];
    return this.http.patch(call, data);
  }

  subir_imagen(files: any) {
    let fd = new FormData();
    fd.append('file', files.file);
    fd.append('tipo', files.tipo);

    var call = `${environment.apiImplementosCatalogo}catalogo/subirImagen`;

    return this.http.post(call, fd);
  }
  deleteBanner(data: any) {
    var call = environment.apiCMS + `banners/` + data['_id'];
    return this.http.delete(call, data);
  }

  /* Blog */

  obtenerPosts() {
    var call = environment.apiCMS + `posts/`;
    return this.http.get(call);
  }
  obtenerPost(data: any) {
    {
      var call = environment.apiCMS + `posts/page/${data['page_id']}`;
      return this.http.get(call);
    }
  }
  crearPost(data: any) {
    var call2 = environment.apiCMS + `posts`;
    return this.http.post(call2, data);
  }

  updatePost(data: any) {
    var call = environment.apiCMS + `posts/` + data['_id'];
    return this.http.patch(call, data);
  }

  deletePost(data: any) {
    var call = environment.apiCMS + `posts/` + data['_id'];
    return this.http.delete(call, data);
  }

  /* Email Templates */

  obtenerEmailTemplates() {
    var call = environment.apiCMS + `email-templates/`;
    return this.http.get(call);
  }

  crearEmailTemplate(data: any) {
    var call = environment.apiCMS + `email-templates`;
    return this.http.post(call, data);
  }

  updateEmailTemplate(data: any) {
    var call = environment.apiCMS + `email-templates/` + data['_id'];
    return this.http.patch(call, data);
  }

  deleteEmailTemplate(data: any) {
    var call = environment.apiCMS + `email-templates/` + data['_id'];
    return this.http.delete(call, data);
  }

  /* Recuperar contraseña */

  recuperarPassword(data: any) {
    return this.http.post(environment.apiCMS + `users/recover-pass`, data);
  }

  updatePassword(data: any) {
    var call = environment.apiCMS + `users/` + data['clientId'];
    return this.http.patch(call, data);
  }

  /* Admin Usuarios */

  buscarUsuarios(rut = '') {
    var call = environment.apiCMS + `users?rut=${rut}`;
    return this.http.get(call);
  }

  crearUsuario(data: any) {
    var call = environment.apiCMS + `users`;
    return this.http.post(call, data);
  }

  registrarUsuario(data: any) {
    var call = environment.apiCMS + `users/register`;
    return this.http.post(call, data);
  }

  updateUsuario(data: any) {
    var call = environment.apiCMS + `users/` + data['_id'];
    return this.http.patch(call, data);
  }

  deleteUsuario(data: any) {
    var call = environment.apiCMS + `users/` + data['_id'];
    return this.http.delete(call, data);
  }

  /* SEO */

  getSeoData() {
    var call = environment.apiCMS + `seo/`;
    return this.http.get(call);
  }

  updateList(data: any) {
    var call = environment.apiCMS + `seo/update-list`;
    return this.http.post(call, data);
  }

  updateOne(data: any) {
    var call = environment.apiCMS + `seo/update-one`;
    return this.http.post(call, data);
  }

  getOne(data: any) {
    var call = environment.apiCMS + `seo/get-one`;
    return this.http.post(call, data);
  }

  //pagina themplate
  updatePage(data: any) {
    let consulta = null;

    var call = environment.apiCMS + `page_home/update`;
    consulta = this.http.post(call, data);

    return consulta;
  }

  //pagina themplate
  async getPage() {
    let consulta = null;
    var call = environment.apiCMS + `page_home/get/`;
    consulta = await this.http.get(call).toPromise();
    return consulta;
  }
}
