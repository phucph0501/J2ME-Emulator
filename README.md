# J2ME Web Emulator (J2ME-Emulator)

A lightweight web-based Java ME (J2ME) emulator UI and runner skeleton implemented in HTML, CSS and JavaScript.

This repository provides a browser-hosted emulator frontend inspired by J2ME-Loader with these goals:

- Allow users to upload and "install" JAR / JAD Java ME apps from their local machine.
- Persist uploaded app binaries and per-app state in browser `localStorage` so users don't need to re-upload each visit.
- Provide a Nokia S40-like phone UI (e.g. Nokia 6300 keypad layout) with pointer-friendly controls for touch and mouse.
- Theme support, responsive canvas scaling (fit / stretch / pixel-perfect), and basic settings.

Important: This project provides the UI, storage and screen rendering plumbing. A full Java bytecode interpreter / J2ME API runtime is not implemented here yet — that is a separate, significant task. The repository is intended as a starting point to run or integrate an actual J2ME runtime in JavaScript.

## Features implemented

- Install / Load `.jar` or `.jad` files from local machine via file picker.
- Uploaded app binaries are saved to `localStorage` as Base64 so they persist per-browser and per-origin.
- Per-app saved state is stored in `localStorage` (automatically saved at intervals and on exit where possible).
- Nokia S40-like phone frame and keypad UI (pointer events; works with mouse and touch).
- Themes, settings UI, and responsive canvas that adapts to typical J2ME resolutions (240x320, 320x240).
- GitHub Actions workflow to deploy the site to GitHub Pages.

## Quick start — run locally

1. Clone the repository (if not already):

```bash
git clone https://github.com/phucph0501/J2ME-Emulator.git
cd J2ME-Emulator
```

2. Serve the files with a static HTTP server (ES modules require HTTP):

```bash
# Use Python 3 built-in server
python3 -m http.server 8000
```

3. Open your browser to:

```
http://127.0.0.1:8000
```

4. Install a J2ME app (.jar or .jad):

- Click the "Install / Load .jar" button. A file picker will open. Choose a `.jar` or `.jad` from your local disk.
- The app binary will be saved into `localStorage` and then loaded by the emulator UI (the current runtime stub).

Notes about uploading:
- The file picker uploads from your local machine to the browser only — files are not sent to any server.
- Because the app binary is stored in `localStorage`, it persists across page reloads in the same browser and origin until you clear storage.

## How the storage works

- App binaries are read with a `FileReader` and stored under the `j2me_saved_games` key in `localStorage` as Base64 strings. Each app entry stores: name, data, timestamp and size.
- Per-app runtime state is saved under keys like `j2me_game_data_<appname>`.
- You can clear installed apps by clearing site data (DevTools Application > Clear Storage) or via the app's settings UI where available.

Limitations & Caveats

- localStorage has limited capacity (~5-10 MB per origin depending on browser). Large JARs may fail to store. Consider the browser storage limits when installing many apps.
- Saving binary data in localStorage increases size quickly. For production, consider IndexedDB for larger storage.
- This project currently does not interpret Java bytecode — it only provides the frontend, file storage, and a rendering canvas. Integrating a full J2ME runtime (for example by porting parts of an existing project) is required to actually run game logic.

## UI details

- Phone UI: The on-screen keypad tries to replicate the placement and feels of a Nokia S40 (e.g., 6300) with a central selection button, 4-way navigation and a numeric keypad.
- Pointer events: Buttons use `pointerdown/pointerup` handlers so both mouse and touch work reliably and avoid accidental page scroll during gameplay.
- Screen scaling: The canvas logical size is set to the game's detected or default resolution (240x320). The canvas is then scaled visually to fit the phone frame while preserving aspect ratio. Pixel-perfect scaling is available in settings.

## Deployment

This repo contains a GitHub Actions workflow at `.github/workflows/deploy.yml` that uploads the repository to GitHub Pages when you push to the `main` branch.

To publish on GitHub Pages:

1. Push your code to GitHub (already enabled):

```bash
git add .
git commit -m "Update README"
git push origin main
```

2. In your repository on GitHub, go to Settings > Pages and ensure the source is set to "GitHub Actions" (the provided workflow will deploy after each push).

3. After Actions completes, your site should be available at:

```
https://phucph0501.github.io/J2ME-Emulator
```

## Next recommended improvements (I can implement any of these)

1. Add an "Installed apps" grid UI so users can see, launch, rename, and delete installed apps without re-uploading.
2. Use IndexedDB instead of localStorage for storing binaries (more capacity and better suited for blobs).
3. Integrate or port a Java bytecode interpreter / J2ME runtime in JS to actually execute MIDlets.
4. Add drag-and-drop install and toast notifications for better UX.
5. Add export/import backup for installed apps and saved states.

## Troubleshooting

- If the Install button doesn't open a file picker, check browser settings and make sure popups are allowed for the page. Also ensure you're opening the page over `http://` (not `file://`).
- If an uploaded app doesn't start, open DevTools (Console) to see errors (parsing or runtime). Send me the logs and I can help debug.

## License

MIT

---
If you'd like, I can now add the Installed Apps UI and a delete action so you can manage apps without digging into DevTools. Shall I proceed with that next?