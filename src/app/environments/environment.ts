import { config } from "rxjs";

export const environment = {
  production: false,
  config : {
    url : 'https://keycloak.dashypay.com/' , //'http://197.230.72.114:30194/'
  },
  keycloak: {
    url: 'https://keycloak.dashypay.com', //'http://197.230.72.114:30194/realms/mvp-dashy/protocol/openid-connect/token'
    realm: 'mvp-dashy',
    clientId: 'backoffice'
  },
  api: {
    baseUrl: 'http://localhost:8080/api',
    timeout: 30000
  },
  features: {
    enableDebugMode: true,
    enableLogging: true
  }
};  