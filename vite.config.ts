import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

const isProd = process.env.NODE_ENV === 'production';
const ghPagesBase = '/mfa-host/';

export default defineConfig({
  base: isProd ? ghPagesBase : '/',
  plugins: [
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        remoteUsers: {
          type: 'module',
          name: 'remoteUsers',
          entry: isProd
            ? 'https://approximatesolution.github.io/mfa-remote-users/remoteEntry.js'
            : 'http://localhost:3001/remoteEntry.js',
          shareScope: 'default',
        },
        remoteDashboard: {
          type: 'module',
          name: 'remoteDashboard',
          entry: isProd
            ? 'https://approximatesolution.github.io/mfa-remote-dashboard/remoteEntry.js'
            : 'http://localhost:3002/remoteEntry.js',
          shareScope: 'default',
        },
        remoteSettings: {
          type: 'module',
          name: 'remoteSettings',
          entry: isProd
            ? 'https://approximatesolution.github.io/mfa-remote-settings/remoteEntry.js'
            : 'http://localhost:3003/remoteEntry.js',
          shareScope: 'default',
        },
      },
      exposes: {
        './SharedStore': './src/shared/mfa-store',
        './EventBusTypes': './src/shared/event-bus-types',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.1.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.1.0' },
        zustand: { singleton: true, requiredVersion: '^5.0.0' },
      },
    }),
    react(),
  ],
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
  },
});
