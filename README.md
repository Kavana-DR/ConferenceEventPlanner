# Conference Expense Planner

This is a React-based web application to plan and manage conference event expenses.

## Deployment to GitHub Pages

To deploy this project to GitHub Pages, follow these steps:

1. Install the `gh-pages` package if not already installed:

```bash
npm install --save-dev gh-pages
```

2. Add the following scripts to your `package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Ensure your `vite.config.js` (if using Vite) has the correct `base` path set for GitHub Pages:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
base: "/<repository-name>/",
  plugins: [react()],
});
```

Replace `<repository-name>` with your GitHub repository name.

4. Build and deploy the app:

```bash
npm run deploy
```

5. Go to your GitHub repository settings and enable GitHub Pages from the `gh-pages` branch.

## Notes

- Make sure your repository is initialized and pushed to GitHub.
- The app will be available at `https://<username>.github.io/<repository-name>/`.

---


