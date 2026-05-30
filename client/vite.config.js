import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                ws: true,
                configure: function (proxy) {
                    proxy.on('proxyRes', function (proxyRes) {
                        var _a;
                        if ((_a = proxyRes.headers['content-type']) === null || _a === void 0 ? void 0 : _a.includes('text/event-stream')) {
                            proxyRes.socket.setTimeout(0);
                        }
                    });
                }
            }
        }
    }
});
