// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICostCenter } from '@core/models-v2/customer/customer-cost-center.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
    providedIn: 'root',
})
export class CustomerCostCenterService {
    constructor(private http: HttpClient) {}

    getCostCenters(documentId:string):Observable<ICostCenter[]>{
        return this.http.get<ICostCenter[]>(`${API_CUSTOMER}/${documentId}/cost-centers`)
    }

    createCostCenter(costCenter:ICostCenter, documentId:string): Observable<ICostCenter>{
        return this.http.post<ICostCenter>(`${API_CUSTOMER}/${documentId}/cost-center`, costCenter)
    }

    updateCostCenter(costCenter:ICostCenter,documentId:string): Observable<ICostCenter>{
        return this.http.put<ICostCenter>(`${API_CUSTOMER}/${documentId}/cost-center/${costCenter.code}`, costCenter)
    }

    deleteCostCenter(documentId:string,code:string){
        return this.http.delete(`${API_CUSTOMER}/${documentId}/cost-center/${code}`)
    }

}
