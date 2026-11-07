// ─────────────────────────────────────────────────────────────
//  Shamil site settings — the ONLY file you need to edit
//  when a new version ships or the download links change.
// ─────────────────────────────────────────────────────────────
window.SHAMIL = {
  version: '0.3.0',
  released: 'November 2026',

  // Vercel will not host files over 100 MB, so put the installers on
  // GitHub Releases, Google Drive, Dropbox, S3 … and paste the links here.
  // While previewing locally, /downloads/… is served from "Shamil Desktop".
  downloads: {
    mac: {
      url: '/downloads/Shamil-0.3.0-mac.zip',
      file: 'Shamil-0.3.0-mac.zip',
      size: '120 MB',
      sha256: '0faf3ac5d6bd242b5cfcfcf49cbeab62bf12bc1f4327ed1e633b8656d6b8946f',
      note: 'Apple Silicon & Intel · macOS 11 or later'
    },
    windows: {
      url: '/downloads/Shamil-Setup-0.3.0.exe',
      file: 'Shamil-Setup-0.3.0.exe',
      size: '40 MB',
      sha256: '389aa06d7b0d41a6d8684d89485978d26a072427f6cf5fbce8875289134a3c83',
      note: 'Windows 10 & 11 · 64-bit'
    },
    windowsZip: {
      url: '/downloads/Shamil-Setup-0.3.0-windows.zip',
      file: 'Shamil-Setup-0.3.0-windows.zip',
      sha256: 'ca7c6753c072d51a6f2a0f96306809439a32542da87b4a2a1d64f355d9941918'
    }
  },

  contactEmail: '',          // e.g. 'hello@shamil.app' — leave empty to hide
  tutorialVideo: '/assets/shamil-tutorial.mp4'
};
