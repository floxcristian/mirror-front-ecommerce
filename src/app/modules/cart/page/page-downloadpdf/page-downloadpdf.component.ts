import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.numero = this.activatedRoute.snapshot.queryParams['numero'];
    this.tipo = this.activatedRoute.snapshot.queryParams['tipo'];
    console.log(this.tipo);
    if (this.tipo === undefined || this.tipo == null) this.downloadOvPdf();
    else if (this.tipo === 'factura') this.downloadFacturaPdf();
    else if (this.tipo === 'orden-compra') this.downloadOcPdf();
  }

  headers() {
    return environment.apiShoppingCart.startsWith('http://192')
      ? new HttpHeaders()
      : new HttpHeaders().append('Authorization', this.authBasic);
  }
  downloadOvPdf() {
    const headers = this.headers();
    const url =
      environment.apiShoppingCart +
      'documentos/documentoOVPDF/' +
      btoa(`@${this.numero}@`);
    this.http
      .get(url, { headers, responseType: 'text' })
      .subscribe((response) => {
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
