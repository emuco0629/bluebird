import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Viteの公開用環境変数（VITE_プレフィックス）を読み込み
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: { port: 3000, host: '0.0.0.0' },
    plugins: [react()],
    // ★ ここがポイント：バンドル時に process.env.* を置換する
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  };
});
