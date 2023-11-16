// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Environment
import { environment } from '@env/environment';

const API_CMS = `${environment.apiEcommerce}/api/v1/cms`;

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  constructor(private http: HttpClient) {}

  /**********************************************
   * CMS
   **********************************************/
  getCategories() {
    return this.http.get(`${API_CMS}/categories`);
  }

  getSliders() {
    return this.http.get(`${API_CMS}/sliders`);
  }

  getValueBoxes() {
    return this.http.get(`${API_CMS}/value-boxes`);
  }

  getWorlds() {
    return this.http.get(`${API_CMS}/worlds`);
  }

  getHomePage(documentId: string, branchCode: string) {
    return this.http.get(`${API_CMS}/homepage`, {
      params: { documentId, branchCode },
    });
  }

  /**********************************************
   * BLOG
   **********************************************/
  getPosts(quantity: number) {
    return this.http.get(`${API_CMS}/blog/posts`, {
      params: { quantity },
    });
  }

  getPostDetail(postId: string) {
    return this.http.get(`${API_CMS}/blog/posts/${postId}`);
  }
}
