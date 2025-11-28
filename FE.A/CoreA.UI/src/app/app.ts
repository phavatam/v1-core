import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import  {LoginComponent} from './auth/login.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatMenuModule, MatTooltipModule, LoginComponent, SidebarComponent, FooterComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppComponent{
  protected readonly title = signal('CoreA.UI');
  isLoginRoute: boolean;

  constructor(private router: Router) {
    this.isLoginRoute = this.router.url === '/login';
    // Nếu muốn tự động cập nhật khi route thay đổi:
    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url === '/login';
    });
  }
}
