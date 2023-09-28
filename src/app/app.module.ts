// Angular
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeCL from '@angular/common/locales/es-CL';
registerLocaleData(localeCL, 'CLP');
// Libs
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// Components
import { AppComponent } from './app.component';
// Routing
import { AppRoutingModule } from './app-routing.module';
// Modules
import { SharedModule } from './shared/shared.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
// Interceptor
import { BasicAuthInterceptor } from './core/interceptors/basic-auth.interceptor';
import { LocalStorageService } from './core/modules/local-storage/local-storage.service';
import { LocalStorageModule } from './core/modules/local-storage/local-storage.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LocalStorageModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule,
    TooltipModule.forRoot(),
    // modules
    AppRoutingModule,
    SharedModule,
    WidgetsModule,
    NgbModule,
  ],
  providers: [
    { provide: 'googleTagManagerId', useValue: 'GTM-M6TH726' },
    { provide: LOCALE_ID, useValue: 'CLP' },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    Title,
    BsModalRef,
    {
      provide: APP_INITIALIZER,
      useFactory: (provider: LocalStorageService) => {
        return () => provider.setPrefix('ImplementosB2B.');
      },
      deps: [LocalStorageService],
      multi: true,
    },
    /*{
      provide: 'Window',
      useValue: window,
    },*/
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
