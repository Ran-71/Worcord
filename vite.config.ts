import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    }
  },
  // 确保 public 目录下的文件（如 icons, manifest, sw.js）被复制
  // 在当前根目录结构下，我们手动指定静态资源目录为根目录并不是最佳实践，
  // 但为了符合您的文件结构，Vite 默认会处理根目录的 index.html
  // 我们建议您手动将 icons, manifest.json, sw.js 移动到 public/ 文件夹，
  // 或者使用下面的配置让 Vite 能够找到它们。
  // 
  // 为简单起见，Vite 默认会将根目录下的非代码资源视为静态资源引用。
  // 但是 sw.js 需要直接位于根目录。
  // 我们使用 publicDir 配置。
  publicDir: 'public' 
});