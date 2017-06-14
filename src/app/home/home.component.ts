import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  profile: any;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()){
      if (this.auth.profile) {
        this.profile = this.auth.profile;
      } else {
        this.auth.getProfile((err, profile) => {
          this.profile = profile;
          console.log(this.profile);
        });
      }

    }
  }

}
