import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      component: "wrapper",
      routes: [
        { path: "", component: "main" },
        { path: "/main", component: "main" },
        {
          path: "/config",
          component: "config",
        },
      ]
     },
  ],
  proxy: {
    // '/api': {
    //   'target': 'http://localhost:9909/',
    //   'changeOrigin': true,
    //   'pathRewrite': { '^/api' : '' },
    // }
    '/api': {
      'target': 'http://tankas.cn/chat/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    }
  },
  base: '/check/',
  publicPath: '/check/',
  npmClient: 'npm',
  jsMinifier: 'terser',
  cssMinifier: 'cssnano',
});
