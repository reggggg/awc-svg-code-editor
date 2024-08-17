// import { defineConfig } from 'vite';
// import { resolve } from 'path';
// import vercel from 'vite-plugin-vercel';

// export default defineConfig({
//   build: {
//     outDir: 'dist',
//     rollupOptions: {
//       input: {
//         main: resolve(__dirname, 'index.html'),
//       },
//       output: {
//         manualChunks: undefined,
//       },
//     },
//   },
//   server: {
//     historyApiFallback: true,
//   },
//   plugins: [vercel()],
// });


import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
