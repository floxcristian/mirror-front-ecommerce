// Angular
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Interceptors
import { BasicAuthInterceptor } from './interceptors/basic-auth.interceptor';

@NgModule({
  declarations: [],
  imports: [BrowserAnimationsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
