import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from './components/header/header.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptor } from './interceptors/jwt/jwt.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    HeaderModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
