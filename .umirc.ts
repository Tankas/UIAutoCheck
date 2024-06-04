import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      component: "wrapper",
      routes: [
        { path: "", component: "main" },
        { path: "/main", component: "main" },
        { path: "/config", component: "config" },
      ]
     },
  ],
  base: '/check/',
  publicPath: '/check/',
  npmClient: 'npm',
  jsMinifier: 'terser',
  cssMinifier: 'cssnano',
});
