import { Routes } from '@angular/router';
export const home_routes: Routes = [
	{
            path: 'home',
            loadComponent: () => import('../app/modules/home/features/dashboard/dashboard-component').then(m => m.DashboardComponent)
	},
];
