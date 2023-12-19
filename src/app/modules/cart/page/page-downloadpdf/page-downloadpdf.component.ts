import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DocumentDownloadService } from '@core/services-v2/document-download.service';
import { environment } from '@env/environment';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-page-downloadpdf',
  templateUrl: './page-downloadpdf.component.html',
  styleUrls: ['./page-downloadpdf.component.scss'],
})
export class PageDownloadpdfComponent implements OnInit {
  pdfBase64: any = null;
  numero: any = null;
  tipo: any = null;
  authBasic = 'Basic c2VydmljZXM6MC49ajNEMnNzMS53Mjkt';
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    // Services V2
    private readonly documentDownloadService: DocumentDownloadService
  ) {}

  ngOnInit() {
    this.numero = this.activatedRoute.snapshot.queryParams['numero'];
    this.tipo = this.activatedRoute.snapshot.queryParams['tipo'];
    console.log(this.tipo);
    if (this.tipo === 'factura') this.downloadFacturaPdf();
    else if (this.tipo === 'orden-compra') this.downloadOcPdf();
    else this.downloadOvPdf();
  }

  headers() {
    return environment.apiShoppingCart.startsWith('http://192')
      ? new HttpHeaders()
      : new HttpHeaders().append('Authorization', this.authBasic);
  }
  downloadOvPdf() {
    let base64Code = '';
    if (this.tipo == 1) {
      base64Code = btoa(`quotation@quotation@${this.numero}`);
    } else {
      base64Code = btoa(`sales_order@sales_order@${this.numero}`);
    }

    this.documentDownloadService
      .downloadSalesOrder(base64Code)
      .subscribe((arrayBuffer) => {
        let response = Buffer.from(arrayBuffer).toString('base64');
        response = 'data:application/pdf;base64,' + response;
        response = response + '#toolbar=1&statusbar=1&navpanes=1';
        this.pdfBase64 =
          this.sanitizer.bypassSecurityTrustResourceUrl(response);
      });
  }

  downloadOcPdf() {
    const headers = this.headers();

    const url = environment.apiShoppingCart + 'getOc?id=' + this.numero;
    this.http
      .get(url, { headers, responseType: 'blob' })
      .subscribe((response: any) => {
        var file3 = new Blob([response], { type: 'application/pdf' });
        this.pdfBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file3)
        );
      });
  }

  downloadFacturaPdf() {
    let codigo = '';
    let numero = this.numero.split('-');
    const headers = this.headers();

    if (numero[0] === 'BEL') codigo = btoa(`@${numero[1]}@39@`);
    else if (numero[0] === 'FEL') codigo = btoa(`@${numero[1]}@33@`);
    else if (numero[0] === 'NCE') codigo = btoa(`@${numero[1]}@61@`);

    const url =
      environment.apiShoppingCart + 'documentos/documentoClientePDF/' + codigo;
    this.http
      .get(url, { headers, responseType: 'text' })
      .subscribe((response) => {
        response = response + '#toolbar=1&statusbar=1&navpanes=1';
        this.pdfBase64 =
          this.sanitizer.bypassSecurityTrustResourceUrl(response);
      });
  }
}
