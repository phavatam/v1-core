import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { NotifyService } from '../core/services/notify.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    isLoading = false;
    showPassword = false;
    currentYear = new Date().getFullYear();
    constructor(
        private authService: AuthService,
        private notify: NotifyService
    ) {}

    toggleShowPassword() {
        console.log('Toggling password visibility');
        this.showPassword = !this.showPassword;
    }

    async login() {
        this.isLoading = true;
        try {
            this.username = "TamPV";
            this.password = "M@tkhau1";
            const res = await this.authService.login(this.username, this.password);
            if (res?.isSuccess && res?.data?.accessToken) {
                document.cookie = `accessToken=${res.data.accessToken}; path=/;`;
                this.error = '';
                window.location.href = '/home';
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
