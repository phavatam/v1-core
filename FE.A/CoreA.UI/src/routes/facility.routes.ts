import { Routes } from '@angular/router';
export const facility_routes: Routes = [
	{
            path: 'facility',
            loadComponent: () => import('../app/modules/facility/features/dashboard/dashboard-component').then(m => m.DashboardComponent)
	},
];
