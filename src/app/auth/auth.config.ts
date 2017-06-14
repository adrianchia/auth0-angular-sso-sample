interface AuthConfig {
    clientId: string;
    domain: string;
    callbackUrl: string;
    responseType: string;
    audience: string;
    scope: string;
    silentAuthCallBackUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientId: '[YOUR CLIENT ID]',
  domain: '[YOUR TENANT ID].auth0.com',
  responseType: 'token id_token',
  audience: '[YOUR API IDENTIFIER]',
  callbackUrl: 'http://localhost:4200/callback',
  scope: 'openid profile',
  silentAuthCallBackUrl: 'http://localhost:4200/silent.html'
};
