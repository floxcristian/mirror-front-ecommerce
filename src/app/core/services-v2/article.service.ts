// Angular
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IArticleResponse,
  ISearchResponse,
} from '@core/models-v2/article/article-response.interface';
import {
  IComment,
  ICommentResponse,
} from '@core/models-v2/article/comment.interface';
import { IReviewsResponse } from '@core/models-v2/article/review-response.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_ARTICLE = `${environment.apiEcommerce}/api/v1/article`;

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient) {}
  /**********************************************
   * SEARCH
   **********************************************/
  search(params: {
    page?: number;
    pageSize?: number;
    showPrice?: number;
    word?: string;
    documentId?: string;
    branchCode?: string;
    category?: string;
    order?: string;
    brand?: string;
    filters?: string;
    location?: string;
  }): Observable<ISearchResponse> {
    return this.http.get<ISearchResponse>(`${API_ARTICLE}/search`, {
      params,
    });
  }

  /**********************************************
   * ARTICLE
   **********************************************/
  /*getArticle(sku: string) {
    return this.http.get(`${API_ARTICLE}/${sku}`);
  }
  */

  /**********************************************
   * ARTICLE DATASHEET
   **********************************************/
  getArticleDataSheet(params: {
    sku: string;
    documentId: string;
    branchCode: string;
    location?: string;
  }): Observable<IArticleResponse> {
    const { sku, ..._params } = params;
    return this.http.get<IArticleResponse>(
      `${API_ARTICLE}/${sku}/data-sheet`,
      {
        params: _params,
      }
    );
  }

  getArticlesDatasheets(params: {
    documentId: string;
    branchCode: string;
    skus: string[];
    location?: string;
  }): Observable<IArticleResponse[]> {
    return this.http.post<IArticleResponse[]>(
      `${API_ARTICLE}/data-sheets`,
      params
    );
  }

  /**********************************************
   * SLIM ARTICLE
   **********************************************/
  getArticlesSlimData(skus: string[]) {
    return this.http.post(`${API_ARTICLE}/slim-data`, {
      skus,
    });
  }

  /**********************************************
   * SUGGESTION
   **********************************************/
  getArticleMatrix(params: {
    sku: string;
    documentId: string;
    branchCode: string;
    location: string;
  }): Observable<IArticleResponse[]> {
    const { sku, ..._params } = params;
    return this.http.get<IArticleResponse[]>(
      `${API_ARTICLE}/suggestion/${sku}/article-matrix`,
      {
        params: _params,
      }
    );
  }

  getRelatedBySku(params: {
    sku: string;
    documentId: string;
    branchCode: string;
    location: string;
  }): Observable<IArticleResponse[]> {
    const { sku, ..._params } = params;
    return this.http.get<IArticleResponse[]>(
      `${API_ARTICLE}/suggestion/${sku}/article-related`,
      {
        params: _params,
      }
    );
  }

  getArticleSuggestionsBySku(params: {
    sku: string;
    documentId: string;
    branchCode: string;
    location: string;
    quantityToSuggest: number;
  }): Observable<IArticleResponse[]> {
    const { sku, ..._params } = params;
    return this.http.get<IArticleResponse[]>(
      `${API_ARTICLE}/suggestion/${sku}/article-suggestions`,
      {
        params: _params,
      }
    );
  }

  getArticleSuggestions(params: {
    skus: string[];
    documentId: string;
    branchCode: string;
    quantityToSuggest: number;
  }): Observable<IArticleResponse[]> {
    return this.http.get<IArticleResponse[]>(
      `${API_ARTICLE}/suggestion/article-suggestions`,
      {
        params,
      }
    );
  }

  getArticleCustomerSuggestions(params: {
    documentId: string;
    branchCode: string;
    quantityToSuggest: number;
    random: number;
    randomMinProbability: number;
  }) {
    return this.http.get(
      `${API_ARTICLE}/suggestion/article-customer-suggestions`,
      {
        params,
      }
    );
  }

  getComparacionMatriz(params: {
    sku: any;
    documentId: string;
    branchCode: string;
  }) {
    return this.http.get(
      `${API_ARTICLE}/suggestion/article-compare-matrix?sku=${params.sku}&documentId=${params.documentId}&branchCode=${params.branchCode}`
    );
  }

  getResumenComentarios(sku: string) {
    return this.http.get<IReviewsResponse>(
      `${API_ARTICLE}/${sku}/evaluation-summary`
    );
  }

  // FIXME: enviar el token de mejor manera
  guardarComentarioArticulo(request: IComment) {
    const { calification, title, comment, recommended } = request;
    const body = {
      calification,
      title,
      comment,
      recommended,
    };

    let auth_token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb3VyY2UiOiJlY29tbWVyY2UiLCJkb2N1bWVudElkIjoiMTUyMTMwODQtOCIsInVzZXJuYW1lIjoiY2xhdWRpby5tb250b3lhQGJpb3BjLmNsIiwidXNlclJvbGUiOiJzdXBlcnZpc29yIiwiaWF0IjoxNzAxODcyMzY5LCJleHAiOjE3MzM0Mjk5Njl9.9efvYK4FLveiqUIprbFNX38bOIDxeiyN1v5bZXPvUwY';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
      accept: 'application/json',
    });
    const requestOptions = { headers: headers };

    return this.http.post(
      `${API_ARTICLE}/${request.sku}/evaluation`,
      body,
      requestOptions
    );
  }
  getDetalleComentarios(
    sku: string,
    orden?: string
  ): Observable<ICommentResponse> {
    let url = `${API_ARTICLE}/${sku}/evaluation-detail`;
    if (orden) {
      url += `?orden=${orden}`;
    }
    return this.http.get<ICommentResponse>(url);
  }
}
