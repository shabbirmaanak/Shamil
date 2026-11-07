# Shamil website

Static site — no build step.

- **Preview locally:** double-click `preview-site.command` (Mac) or run `node preview-server.js`, then open http://localhost:5050
- **Edit download links / version:** `assets/config.js` (only file to touch per release)
- **Deploy:** Vercel → new project → this folder, Framework preset "Other", no build command, output directory `.`

Installers are larger than Vercel's file limit, so host them on GitHub Releases (or Drive/Dropbox)
and paste the links into `assets/config.js` before deploying.
