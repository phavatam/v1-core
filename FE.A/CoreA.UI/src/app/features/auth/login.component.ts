import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NotifyService } from '../../core/services/notify.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from '../../shared/loading.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
        imports: [
            CommonModule,
            FormsModule,
            MatCardModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatIconModule,
            LoadingComponent
        ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    isLoading = false;
    showPassword = false;
    constructor(
        private authService: AuthService,
        private notify: NotifyService
    ) {}

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    async login() {
        if (!this.username.trim() || !this.password.trim()) {
            // this.error = 'Username and password are required.';
            // this.notify.error(this.error);
            // return;
        }
        this.isLoading = true;
        try {
            this.username = "TamPV";
            this.password = "M@tkhau1";
            const res = await this.authService.login(this.username, this.password);
            if (res?.isSuccess && res?.data?.accessToken) {
                document.cookie = `accessToken=${res.data.accessToken}; path=/;`;
                this.error = '';
                window.location.href = '/dashboard';
            } else {
                this.error = res?.message || 'Invalid credentials';
                this.notify.error(this.error);
            }
        } catch (err: any) {
            this.error = err?.message || 'Login failed. Please try again.';
            this.notify.error(this.error);
        } finally {
            this.isLoading = false;
        }
    }
}
