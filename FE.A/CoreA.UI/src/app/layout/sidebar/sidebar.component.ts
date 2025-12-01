import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [RouterLink]
})
export class SidebarComponent{
}