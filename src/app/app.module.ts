// Angular
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeCL from '@angular/common/locales/es-CL';

registerLocaleData(localeCL, 'CLP');
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Libs
import { ToastrModule } from 'ngx-toastr';
//import { LocalStorageModule } from 'angular-2-local-storage'; // NO SE USA
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// import { NgtUniversalModule } from '@ng-toolkit/universal';

import { AppComponent } from './app.component';

// Modules
import { SharedModule } from './shared/shared.module';
import { WidgetsModule } from './modules/widgets/widgets.module';

// Interceptor
import { BasicAuthInterceptor } from './core/interceptors/basic-auth.interceptor';
import { LocalStorageService } from './core/modules/local-storage/local-storage.service';
import { LocalStorageModule } from './core/modules/local-storage/local-storage.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    /*LocalStorageModule.forRoot({
      prefix: 'ImplementosB2B',
      storageType: 'localStorage'
    }),*/
    LocalStorageModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule,
    TooltipModule.forRoot(),
    SharedModule,
    WidgetsModule,
    NgbModule,
    // NgtUniversalModule
  ],
  providers: [
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
