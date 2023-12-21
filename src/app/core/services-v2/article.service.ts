// Angular
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { Observable, map } from 'rxjs';
import { IProductCompareResponse } from './product/models/product-compare-response.interface';
import { IFormmatedProductCompareResponse } from './product/models/formatted-product-compare-response.interface';

const API_ARTICLE = `http://10.158.15.204:8080/api/v1/article`;

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
  /**
   * Obtener productos que son parte de la matriz.
   */
  getMatrixProducts(params: {
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

  /**
   * Obtener productos relacionados.
   * @param params
   * @returns
   */
  getRelatedProducts(params: {
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

  /**
   * Obtener productos recomendados.
   * @param params
   * @returns
   */
  getRecommendedProducts(params: {
    sku: string;
    documentId: string;
    branchCode: string;
    location: string;
    quantityToSuggest?: number;
  }): Observable<IArticleResponse[]> {
    const { sku, ..._params } = params;
    return this.http.get<IArticleResponse[]>(
      `${API_ARTICLE}/suggestion/${sku}/article-suggestions`,
      {
        params: {
          ..._params,
          quantityToSuggest: _params.quantityToSuggest || 10,
        },
      }
    );
  }

  getArticleSuggestions(params: {
    skus: string[];
    documentId: string;
    branchCode: string;
    quantityToSuggest: number;
  }): Observable<IArticleResponse[]> {
    let httpParams = new HttpParams();
    for (const sku of params.skus) {
      httpParams = httpParams.append('skus[]', sku);
    }
    httpParams = httpParams
      .append('documentId', params.documentId)
      .append('branchCode', params.branchCode)
      .append('quantityToSuggest', params.quantityToSuggest);

    return this.http.get<IArticleResponse[]>(
      `${API_ARTICLE}/suggestion/article-suggestions`,
      {
        params: httpParams,
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

  /**
   * Obtener matríz de comparación del producto.
   * @param params
   * @returns
   */
  getProductCompareMatrix(params: {
    sku: string;
    documentId: string;
    branchCode: string;
  }): Observable<IFormmatedProductCompareResponse> {
    return this.http
      .get<IProductCompareResponse>(
        `${API_ARTICLE}/suggestion/article-compare-matrix`,
        {
          params,
        }
      )
      .pipe(
        map((response) => {
          const products = response.articles.map((product) => ({
            ...product,
            quantity: 1,
          }));
          const differences = response.comparison.map((product) => {
            const keys = Object.keys(product);
            const attributeKey = keys[0];
            const values = product[attributeKey].map(
              (attribute) => attribute.value
            );
            return { name: attributeKey, values };
          });
          return { products, differences };
        })
      );
  }

  getResumenComentarios(sku: string) {
    return this.http.get<IReviewsResponse>(
      `${API_ARTICLE}/${sku}/evaluation-summary`
    );
  }

  guardarComentarioArticulo(request: IComment) {
    const { calification, title, comment, recommended } = request;
    const body = {
      calification,
      title,
      comment,
      recommended,
    };
    return this.http.post(`${API_ARTICLE}/${request.sku}/evaluation`, body);
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
