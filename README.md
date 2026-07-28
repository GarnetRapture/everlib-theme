<div align="center">

<img src="./resources/icon/garnet-rapture-icon.png" width="128" height="128" alt="everlib Theme Icon" />

# everlib Theme (Garnet Rapture)

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-v1.80%2B-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/)
[![Theme Version](https://img.shields.io/badge/version-1.0.0-ff1744?style=for-the-badge)](https://github.com/GarnetRapture/everlib-theme)
[![License](https://img.shields.io/badge/license-MIT-ffc107?style=for-the-badge)](./LICENSE)

**Pure Monochromatic Dark Charcoal & Vivid Crimson Acrylic Theme** featuring a **Claude AI Interactive Controller Panel** for Visual Studio Code and Cursor.

</div>

---

## 🌟 Overview

**everlib Theme (Garnet Rapture Edition)** is an enterprise-grade dark theme designed for modern software engineers, AI developers, and UI/UX enthusiasts. Built upon a ultra-clean **Pure Dark Charcoal (`#0a0a0a`)** foundation with **Vivid Crimson (`#ff1744`)** and **Gold Amber (`#ffc107`)** accents, it provides complete visual clarity, zero eye strain, and high contrast for coding sessions.

<div align="center">

### 🎨 Visual Assets Showcase

| Wallpaper Asset | Controller Panel Sticker |
| :---: | :---: |
| <img src="./resources/wallpaper/garnet-rapture-costume01.png" width="420" alt="Wallpaper Sample" /> | <img src="./resources/sticker/garnet-rapture-bunny.png" width="220" alt="Sticker Sample" /> |

</div>

---

## Key Features

### 1. Pure Monochromatic Dark Charcoal Palette
- **Zero Purple / Plum Distortion**: 100% neutral dark charcoal background (`#0a0a0a`) with 8-digit alpha channel opacity (`40`, `55`, `AA`, `CC`) to support native frosted glass & acrylic translucency.
- **High-Contrast Syntax Highlighting**: Vivid crimson reds (`#ff1744`), amber golds (`#ffc107`), and clean whites (`#ffffff`) for instant code symbol recognition.
- **Deduplicated & Clean Token Architecture**: Fully verified against VS Code 1.80+ Workbench and Extension specs (0 errors, 0 warnings).

### 2. Claude AI Interactive Controller Panel
- **Dedicated Sidebar View**: Seamlessly accessible via the custom Activity Bar container (`everlib Panel`).
- **One-Click Actions**: Apply the theme instantly or configure the main editor background wallpaper with a single click.
- **Custom Image Picker**: Built-in support (`everlib: Select Custom Background Image...`) allowing users to choose any `.png`, `.jpg`, `.webp`, or `.gif` image from their local filesystem.

### 3. Automated 2026 Background Translucency Specification
- Automatically writes compliant `background.editor` and `backgroundCover` configuration parameters to global `settings.json` for compatibility with third-party background extensions (`shana.vscode-background`, `background-cover`).

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
