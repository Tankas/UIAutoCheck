import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "main" },
  ],
  base: '/check/',
  npmClient: 'npm',
});
