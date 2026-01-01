# Vite Migration Guide for MR.CREAMS

This guide outlines the steps to migrate the frontend from Create React App (CRA) to Vite. Vite offers significantly faster development server start times and hot module replacement (HMR).

## Prerequisites
- Ensure all pending changes are committed to git.
- Node.js version 18+ is recommended.

## Step 1: Install Dependencies

Uninstall `react-scripts` and install Vite dependencies.

```bash
cd frontend
npm uninstall react-scripts
npm install -D vite @vitejs/plugin-react vite-plugin-svgr
```

## Step 2: Update `package.json`

Modify the `scripts` section in `frontend/package.json`:

```json
"scripts": {
  "start": "vite",
  "build": "vite build",
  "serve": "vite preview"
}
```

## Step 3: Create `vite.config.js`

Create a new file `frontend/vite.config.js` with the following content. This configuration handles the proxy, React support, and SVG imports.

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5002',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'build',
  },
  // Support .js files as JSX (optional, but recommended to rename files to .jsx)
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
});
```

## Step 4: Move and Update `index.html`

1. Move `frontend/public/index.html` to `frontend/index.html`.
2. Remove `%PUBLIC_URL%` from all paths in `index.html`.
   - Example: `<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />` -> `<link rel="icon" href="/favicon.ico" />`
3. Add the entry point script tag just before the closing `</body>` tag:
   ```html
   <script type="module" src="/src/index.js"></script>
   ```

## Step 5: Update Environment Variables

Vite uses `VITE_` prefix instead of `REACT_APP_`.

1. Rename any `REACT_APP_*` variables in `.env` files to `VITE_*`.
2. In your code, replace `process.env.REACT_APP_*` with `import.meta.env.VITE_*`.

## Step 6: File Extensions (Important)

Vite strictly treats `.js` files as pure JavaScript and `.jsx` files as React components.
- **Recommended:** Rename all files containing JSX from `.js` to `.jsx`.
- **Workaround:** The `vite.config.js` provided above includes an `esbuild` configuration to treat `.js` files in `src` as JSX, but renaming is the best practice for the long term.

## Step 7: Clean Up

Delete `frontend/src/setupProxy.js` as the proxy is now configured in `vite.config.js`.

## Step 8: Run and Test

```bash
npm start
```

Verify that the application loads, login works (proxy check), and styles are applied correctly.
