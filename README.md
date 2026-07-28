<div align="center">

<img src="./icon.png" width="128" height="128" alt="everlib Theme Icon" />

# everlib Theme (Garnet Rapture)

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-v1.80%2B-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/)
[![Theme Version](https://img.shields.io/badge/version-1.0.0-ff75a0?style=for-the-badge)](https://github.com/GarnetRapture/everlib-theme)
[![License](https://img.shields.io/badge/license-MIT-ffc107?style=for-the-badge)](./LICENSE)

**Pure Dark Teal & Soft Coral Pink Theme** featuring a **Claude AI Interactive Controller Panel** for Visual Studio Code and Cursor.

</div>

---

## 🌟 Overview

**everlib Theme (Garnet Rapture Edition)** is an enterprise-grade dark theme designed for modern software engineers, AI developers, and UI/UX enthusiasts. Built upon a ultra-clean **Pure Dark Charcoal & Storm Teal (`#0b1216`)** foundation with **Soft Coral Pink (`#ff75a0`)** and **Electric Blue (`#7aa2f7`)** accents, it provides complete visual clarity, zero eye strain, and high contrast for coding sessions.

<div align="center">

### 🎨 Visual Assets Showcase

| Wallpaper Asset | Controller Panel Sticker |
| :---: | :---: |
| <img src="./resources/wallpaper/garnet-rapture-costume01.png" width="420" alt="Wallpaper Sample" /> | <img src="./resources/sticker/garnet-rapture-bunny.png" width="220" alt="Sticker Sample" /> |

</div>

---

## Key Features

### 1. Pure Dark Charcoal & Storm Teal Palette
- **Zero Red Distortion**: 100% neutral dark teal background (`#0b1216`) with 8-digit alpha channel opacity (`40`, `55`, `AA`, `CC`) to support native frosted glass & acrylic translucency.
- **High-Contrast Syntax Highlighting**: Soft coral pinks (`#ff75a0`), amber golds (`#ff9e64`), sky cyans (`#7dcfff`), and electric blues (`#7aa2f7`) for instant code symbol recognition.
- **Deduplicated & Clean Token Architecture**: Fully verified against VS Code 1.80+ Workbench and Extension specs (0 errors, 0 warnings).

### 2. Claude AI Interactive Controller Panel
- **Dedicated Sidebar View**: Seamlessly accessible via the custom Activity Bar container (`everlib Panel`).
- **One-Click Actions**: Apply the theme instantly or configure the main editor background wallpaper with a single click.
- **Custom Image Picker**: Built-in support (`everlib: Select Custom Background Image...`) allowing users to choose any `.png`, `.jpg`, `.webp`, or `.gif` image from their local filesystem.

### 3. Automated 2026 Background Translucency Specification
- Automatically writes compliant `background.editor` and `backgroundCover` configuration parameters to global `settings.json` for compatibility with third-party background extensions (`shana.vscode-background`, `background-cover`).

---

## 📥 Installation Guide

### Option 1: Download VSIX from GitHub Releases (Recommended)
1. Go to the [GitHub Releases Page](https://github.com/GarnetRapture/everlib-theme/releases/tag/v1.0.0).
2. Download the compiled release package **`everlib-theme-1.0.0.vsix`**.
3. Open Visual Studio Code or Cursor.
4. Open the Extensions View (`Ctrl+Shift+X` or `Cmd+Shift+X`).
5. Click the `...` (More Actions) menu in the top-right corner of the Extensions panel and select **"Install from VSIX..."**.
6. Select the downloaded `everlib-theme-1.0.0.vsix` file to install.

### Option 2: Install via Command Line
```bash
code --install-extension everlib-theme-1.0.0.vsix --force
```

---

## 🚀 Quick Start & Usage

1. **Activate Color Theme**:
   - Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
   - Type `Preferences: Color Theme` and press `Enter`.
   - Select **"Nekoi Eversoul: Garnet Rapture"**.

2. **Open Interactive Controller Panel**:
   - Click the **everlib Panel** icon on the left Activity Bar.
   - Click **`Apply Garnet Rapture Theme`** to switch color palettes instantly.
   - Click **`Setup Default Wallpaper`** to configure main editor background translucency.
   - Click **`Select Custom Image...`** to pick any custom wallpaper file from your local disk.

3. **Available Extension Commands**:
   - `everlib: Open Panel` — Opens the sidebar controller panel.
   - `everlib: Setup Default Editor Wallpaper` — Automatically configures 2026 background settings.
   - `everlib: Select Custom Background Image...` — Opens file browser to set custom editor background.

---

## ⚙️ Background Translucency Setup

To enable wallpaper translucency in VS Code, run the **`everlib: Setup Default Editor Wallpaper`** command or configure your global `settings.json` with the following 2026 specification:

```json
{
  "background.enabled": true,
  "background.useDefault": false,
  "background.customImages": [
    "file:///D:/26_project/Nekoi_eversoul_theme/resources/wallpaper/garnet-rapture-costume01.png"
  ],
  "background.editor": {
    "useFront": false,
    "style": {
      "background-position": "center",
      "background-size": "cover",
      "background-repeat": "no-repeat",
      "opacity": 0.25
    },
    "images": [
      "file:///D:/26_project/Nekoi_eversoul_theme/resources/wallpaper/garnet-rapture-costume01.png"
    ]
  },
  "backgroundCover.imagePath": "D:/26_project/Nekoi_eversoul_theme/resources/wallpaper/garnet-rapture-costume01.png",
  "backgroundCover.opacity": 0.25
}
```

---

## 📁 Repository Structure

```
everlib-theme/
├── package.json                         # Extension manifest & command declarations
├── tsconfig.json                        # TypeScript compilation configuration
├── everlib-theme-1.0.0.vsix             # Compiled release extension package
├── README.md                            # Official documentation (English)
├── icon.png                             # Extension icon
├── themes/
│   └── nekoi-eversoul-color-theme.json  # Garnet Rapture Color Theme JSON
├── src/
│   ├── extension.ts                     # Main extension entry point & commands
│   └── sidebarProvider.ts               # Interactive Webview sidebar provider
└── resources/                           # Project visual assets
    ├── icon/                            # Extension icons
    ├── sticker/                         # Sidebar panel stickers
    └── wallpaper/                       # High-resolution wallpapers
```

---

## 🛠️ Development & Build Guide

```bash
# 1. Install dependencies
npm install

# 2. Compile TypeScript source files
npm run compile

# 3. Package into VSIX artifact
npx vsce package --no-git-tag-version

# 4. Install locally in VS Code
code --install-extension everlib-theme-1.0.0.vsix --force
```

---

<div align="center">

Created with ❤️ by **GarnetRapture**  
[GitHub Repository](https://github.com/GarnetRapture/everlib-theme)

</div>
