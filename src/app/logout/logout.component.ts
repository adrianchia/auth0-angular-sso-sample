import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
    }
  }

  public singleSignOut(): void {
    this.auth.singleLogout();
  }

}
