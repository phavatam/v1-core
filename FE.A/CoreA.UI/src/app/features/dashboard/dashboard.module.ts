import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];


@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), DashboardComponent],
})
export class DashboardModule { }
