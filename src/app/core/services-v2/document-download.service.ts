// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { DomSanitizer } from '@angular/platform-browser';
// Environment
import { environment } from '@env/environment';
import { Observable, from } from 'rxjs';

const API_DOCUMENT_DOWNLOAD = `${environment.apiEcommerce}/api/v1/document`;

@Injectable({
  providedIn: 'root',
})
export class DocumentDownloadService {
  private http = inject(HttpClient);

  // base64(type@internalCode@number). Example: c2FsZXNfb3JkZXJAc2FsZXNfb3JkZXJAT1YtNDExNTI4Mw== (sales_order@sales_order@OV-4115283)
  downloadSalesOrder(code: string) {
    const encoded = encodeURIComponent(code);
    const url = `${API_DOCUMENT_DOWNLOAD}/download/sales-order/${encoded}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }



  downloadFacturaPdf(code: string){
    const encoded = encodeURIComponent(code);
    const url = `${API_DOCUMENT_DOWNLOAD}/downloadBase64/document/${encoded}`;
    return this.http.get(url);
  }


}
