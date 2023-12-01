// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IBlogResponse,
  IBlogsResponse,
} from '@core/models-v2/cms/blog-response.interface';
import { ICategorieResponse } from '@core/models-v2/cms/categories-response.interface';
import { ICustomHomePage } from '@core/models-v2/cms/customHomePage-response.interface';
import { IHomePageResponse } from '@core/models-v2/cms/homePage-response.interface';
import { ISliderResponse } from '@core/models-v2/cms/slider-reponse.interface';
import { IValueBoxResponse } from '@core/models-v2/cms/valueBox-response.interface';
import { IWorldResponse } from '@core/models-v2/cms/world-response.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_CMS = `${environment.apiEcommerce}/api/v1/cms`;

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  constructor(private http: HttpClient) {}

  /**********************************************
   * CMS
   **********************************************/
  getCategories(): Observable<ICategorieResponse> {
    return this.http.get<ICategorieResponse>(`${API_CMS}/categories`);
  }

  getSliders(): Observable<ISliderResponse> {
    return this.http.get<ISliderResponse>(`${API_CMS}/sliders`);
  }

  getValueBoxes(): Observable<IValueBoxResponse> {
    return this.http.get<IValueBoxResponse>(`${API_CMS}/value-boxes`);
  }

  getWorlds(): Observable<IWorldResponse> {
    return this.http.get<IWorldResponse>(`${API_CMS}/worlds`);
  }

  getHomePage(
    documentId: string,
    branchCode: string,
    location: string
  ): Observable<IHomePageResponse> {
    return this.http.get<IHomePageResponse>(`${API_CMS}/homepage`, {
      params: { documentId, branchCode, location },
    });
  }

  getCustomHomePage(
    documentId: string,
    branchCode: string,
    location: string
  ): Observable<ICustomHomePage> {
    return this.http.get<ICustomHomePage>(`${API_CMS}/custom-homepage`, {
      params: { documentId, branchCode, location },
    });
  }

  getSpecial(
    special: string,
    documentId: string,
    branchCode: string,
    location: string
  ) {
    return this.http.get(`${API_CMS}/special`, {
      params: { special, documentId, branchCode, location },
    });
  }

  /**********************************************
   * BLOG
   **********************************************/
  getPosts(quantity: number): Observable<IBlogsResponse> {
    return this.http.get<IBlogsResponse>(`${API_CMS}/blog/posts`, {
      params: { quantity },
    });
  }

  getPostDetail(postId: string): Observable<IBlogResponse> {
    return this.http.get<IBlogResponse>(`${API_CMS}/blog/posts/${postId}`);
  }
}
