import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEdoc, ITService } from '../../core/services/IT/it.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

  schemas: [NO_ERRORS_SCHEMA],
})
export class HeaderComponent implements OnInit {
  currentUserV2: Observable<UserEdoc | null>;
  currentUser: UserEdoc | null = null;

  constructor(private ITService: ITService) {
    this.currentUserV2 = this.ITService.currentUser$;
    console.log("HeaderComponent constructor called");
  }

  ngOnInit(): void {
    this.ITService.getCurrentUserFromEdoc().subscribe();
    // Debug: log giá trị thực tế khi Observable emit
    this.currentUserV2.subscribe(user => {
      this.currentUser = user;
    });
  }
}
