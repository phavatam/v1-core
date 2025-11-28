import { Routes } from '@angular/router';
export const it_routes: Routes = [
	{
            path: 'it',
            loadComponent: () => import('../app/modules/it/features/dashboard/dashboard-component').then(m => m.DashboardComponent)
	},
];
