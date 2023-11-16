// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Environment
import { environment } from '@env/environment';

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
    page: number;
    pageSize: number;
    showPrice: number;
    word?: string;
    documentId?: string;
    branchCode?: string;
    category?: string;
    order?: string;
    brand?: string;
    filters?: string;
  }) {
    return this.http.get(`${API_ARTICLE}/search`, {
      params,
    });
  }

  /**********************************************
   * ARTICLE
   **********************************************/
  getArticle(sku: string) {
    return this.http.get(`${API_ARTICLE}/${sku}`);
  }

  /**********************************************
   * ARTICLE DATASHEET
   **********************************************/
  getArticleDataSheet(params: {
    sku: string;
    documentId: string;
    branchCode: string;
  }) {
    const { sku, ..._params } = params;
    return this.http.get(`${API_ARTICLE}/${sku}/data-sheet`, {
      params: _params,
    });
  }

  getArticlesDatasheets(params: {
    documentId: string;
    branchCode: string;
    skus: string[];
  }) {
    return this.http.post(`${API_ARTICLE}/data-sheets`, params);
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
  }) {
    const { sku, ..._params } = params;
    return this.http.get(`${API_ARTICLE}/suggestion/${sku}/article-matrix`, {
      params: _params,
    });
  }

  getRelatedMatrix(params: {
    sku: string;
    documentId: string;
    branchCode: string;
  }) {
    const { sku, ..._params } = params;
    return this.http.get(`${API_ARTICLE}/suggestion/${sku}/article-related`, {
      params: _params,
    });
  }

  getArticleSuggestionsBySku(params: {
    sku: string;
    documentId: string;
    branchCode: string;
    quantityToSuggest: number;
  }) {
    const { sku, ..._params } = params;
    return this.http.get(
      `${API_ARTICLE}/suggestion/${sku}/article-seggestions`,
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
  }) {
    return this.http.get(`${API_ARTICLE}/suggestion/article-suggestions`, {
      params,
    });
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
}
