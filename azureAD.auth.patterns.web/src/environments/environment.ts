export const environment = {
  production: false,
  backendUrl: 'https://localhost:7139/api',
  azureAd: {
    clientId: 'ef5d2fca-24a1-4bb9-9cd4-b0afb21757c4',
    authority: 'https://login.microsoftonline.com/b650ce8e-3b91-445f-8a1d-92de6ad1fa16',
    redirectUri: 'http://localhost:4200/',
    apiScope: 'api://ef5d2fca-24a1-4bb9-9cd4-b0afb21757c4/access_as_user'
  }
};
