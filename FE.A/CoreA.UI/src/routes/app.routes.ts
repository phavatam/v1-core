import { Routes } from '@angular/router';
import { it_routes } from './it.routes';
import { home_routes } from './home.routes';
import { facility_routes } from './facility.routes';
export const routes: Routes = [
	...it_routes,
	...home_routes,
	...facility_routes,
	{
		path: 'login',
		loadComponent: () => import('../app/auth/login.component').then(m => m.LoginComponent)
	},
	{ path: '', redirectTo: 'login', pathMatch: 'full' }
];
