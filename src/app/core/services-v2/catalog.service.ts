// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICatalogResponse, ICatalogsResponse } from '@core/models-v2/catalog/catalog-response.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_CATALOG = `${environment.apiEcommerce}/api/v1/catalog`;

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
    constructor(private http: HttpClient) {}
    /**********************************************
     * CATALOG
     **********************************************/
    getCatalogs(params:{
        data?:number;
        status?:string;
        type?:string;
        app?:string;
        auto?:number;
    }):Observable<ICatalogsResponse>{
        return this.http.get<ICatalogsResponse>(`${API_CATALOG}/catalogs`,{params})
    }

    getCatalog(id:string):Observable<ICatalogResponse>{
        return this.http.get<ICatalogResponse>(`${API_CATALOG}/catalogs/${id}`)
    }

    /**********************************************
     * NEWSLETTER
     **********************************************/
    getNewsletter(id:number){
        return this.http.get(`${API_CATALOG}/newsletter/${id}`)
    }
}
