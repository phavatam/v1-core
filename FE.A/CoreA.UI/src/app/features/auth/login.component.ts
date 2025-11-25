import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NotifyService } from '../../core/services/notify.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { LoadingComponent } from '../../shared/loading.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
// Removed NzNotificationModule import, only use NzNotificationService via NotifyService
import { UserOutline, LockOutline, EyeOutline, EyeInvisibleOutline } from '@ant-design/icons-angular/icons';
import { NzIconService } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, NzFormModule, NzInputModule, NzButtonModule, NzAlertModule, LoadingComponent, NzIconModule],
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
        private notify: NotifyService,
        private iconService: NzIconService
    ) {
        this.iconService.addIcon(UserOutline, LockOutline, EyeOutline, EyeInvisibleOutline);
    }

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
