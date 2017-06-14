import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tokenNotExpired } from 'angular2-jwt';

import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth.config';

@Injectable()
export class AuthService {

  auth = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientId,
    domain: AUTH_CONFIG.domain,
    responseType: AUTH_CONFIG.responseType,
    audience: AUTH_CONFIG.audience,
    redirectUri: AUTH_CONFIG.callbackUrl,
    scope: AUTH_CONFIG.scope
  });

  profile: any;

  constructor(public router: Router) { }

  public handleAuthentication(): void {
    let parseHashOptions = {};
    const nonce = window.localStorage.getItem('nonce');
    if(nonce) {
      parseHashOptions['nonce'] = nonce;
    }

    this.auth.parseHash(parseHashOptions, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        localStorage.removeItem('nonce');
        this.router.navigate(['']);
      } else if (err) {
        this.router.navigate(['']);
        console.log(JSON.stringify(err));
        alert(JSON.stringify(err));
      }
    });
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access Token is missing to fetch user profile');
    }

    const self = this;
    this.auth.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.profile = profile;
      }
      cb(err, profile);
    });
  }

  public silentLogin(): void {
    if (!this.isAuthenticated()) {
      let nonce = this.generateRandomString(16);
      localStorage.setItem('nonce', nonce);

      this.auth.renewAuth({
        audience: AUTH_CONFIG.audience,
        redirectUri: AUTH_CONFIG.silentAuthCallBackUrl,
        nonce: nonce
      }, (err, authResult) => {
        if (err) {
          console.error(JSON.stringify(err));
          if (err.error && (err.error === 'login_required' || err.error === 'consent_required' || err.error === 'interaction_required')) {
            nonce = this.generateRandomString(16);
            localStorage.setItem('nonce', nonce);
              this.auth.authorize({
                nonce: nonce,
                redirectUri: AUTH_CONFIG.callbackUrl,
                responseType: AUTH_CONFIG.responseType
              });
          }

        } else {
          if (authResult) {
            if (authResult.accessToken && authResult.idToken) {
              this.setSession(authResult);
              this.router.navigate(['']);
            } else if (authResult.error && (authResult.error === 'login_required' || authResult.error === 'consent_required' || authResult.error === 'interaction_required')) {
              nonce = this.generateRandomString(16);
              localStorage.setItem('nonce', nonce);
              this.auth.authorize({
                nonce: nonce,
                redirectUri: AUTH_CONFIG.callbackUrl,
                responseType: AUTH_CONFIG.responseType
              });
            }

          } else {
            alert('no auth result found');
          }
        }

      });
    }
  }

  public isAuthenticated(): boolean {
    return tokenNotExpired('id_token');
  }

  public logout(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('nonce');
  }

  public singleLogout(): void {
    this.auth.logout({});
  }

  private setSession(authResult): void {
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('access_token', authResult.accessToken);
  }

  private generateRandomString(length: number): string {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    let results = [];
    const charsets = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    bytes.forEach(c => {
      results.push(charsets[c % charsets.length]);
    });

    return results.join('');
  }

}
