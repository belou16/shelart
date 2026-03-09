import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const token = env.VITE_HUGGINGFACE_API_KEY;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/generate': {
          target: 'https://router.huggingface.co',
          changeOrigin: true,
          secure: true,
          rewrite: () => '/hf-inference/models/black-forest-labs/FLUX.1-schnell',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (token) proxyReq.setHeader('Authorization', `Bearer ${token}`);
            });
          }
        }
      }
    }
  };
});
