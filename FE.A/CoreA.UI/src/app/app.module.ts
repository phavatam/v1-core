import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './features/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app';
import { LoginComponent } from './features/auth/login.component';
import { GlobalErrorHandler } from './core/global-error-handler';

@NgModule({
  imports: [BrowserModule, FormsModule, AuthModule, AppRoutingModule, AppComponent, LoginComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class AppModule {}
