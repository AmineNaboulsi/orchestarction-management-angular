import { KeycloakConfig } from 'keycloak-js';

export const keycloakConfig: KeycloakConfig = {
  url: 'http://197.230.72.114:30194/realms/mvp-dashy/protocol/openid-connect/token',
  realm: 'mvp-dashy',     
  clientId: 'backoffice',   
};

// Optional: Initialize options
export const initOptions = {
  onLoad: 'login-required' as const,
  flow: 'standard' as const,
  checkLoginIframe: false,
  silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
};