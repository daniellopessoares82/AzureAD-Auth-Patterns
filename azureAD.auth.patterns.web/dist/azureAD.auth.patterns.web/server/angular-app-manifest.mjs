
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/home"
  },
  {
    "renderMode": 2,
    "route": "/logout"
  },
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 498, hash: 'a69f24a6dbac9ead1eda3830f04ba196fb3b887890743e5e19b6b6614ae30f43', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1011, hash: '8d847a02e283305fdd3ff1ebbceb7dd41aa78e26705ff78c63b592421e79a723', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'home/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'logout/index.html': {size: 1014, hash: 'c03e31031704ff8343fff0e6e626969c68c150eaadbd147397dbf1a7763deb69', text: () => import('./assets-chunks/logout_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 1791, hash: 'c6972bbb6e7232d2050588ae2021fdfee0621ca87e1d8c302fd18a7d62fca76f', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
