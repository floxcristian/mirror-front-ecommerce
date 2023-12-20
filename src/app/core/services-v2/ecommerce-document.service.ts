// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBackupOrder } from '@core/models-v2/ecommerce-document/backup-oder.interface';

// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_DOCUMENT = `${environment.apiEcommerce}/api/v1/document`;

@Injectable({
    providedIn: 'root',
})
export class EcommerceDocumentService {
    constructor(private http: HttpClient) {}

    /**********************************************
     * DOCUMENT
    **********************************************/



    /**********************************************
     * BACKUP
     **********************************************/

    getSalesOrderBackup(params:{number:string, numbers?:string[]}): Observable<IBackupOrder[]>{
        return this.http.get<IBackupOrder[]>(`${API_DOCUMENT}/backup/sales-orders`,{params})
    }
}
