/**
 * Generate Stylus userstyles, per-theme READMEs, SVG previews, and the
 * gallery section of the root README.
 *
 *   node scripts/build.mjs          write outputs
 *   node scripts/build.mjs --check  fail if committed outputs drifted
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { repo, themes, version } from "../src/themes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const COLOR_KEYS = [
  "background",
  "background-2",
  "surface",
  "surface-raised",
  "border",
  "text",
  "text-muted",
  "accent",
  "accent-2",
  "highlight",
  "on-accent",
  "dim-color",
];

const baseCss = fs.readFileSync(path.join(root, "src", "base.css"), "utf8");
const readmeTemplate = fs.readFileSync(path.join(root, "src", "README.template.md"), "utf8");

const files = new Map();

function write(rel, contents) {
  const normalized = contents.endsWith("\n") ? contents : contents + "\n";
  files.set(rel, normalized);
}

function rawUrl(theme) {
  return `https://raw.githubusercontent.com/${repo}/main/themes/${theme.franchiseSlug}/${theme.characterSlug}/${theme.file}`;
}

function pageUrl(theme) {
  return `https://github.com/${repo}/blob/main/themes/${theme.franchiseSlug}/${theme.characterSlug}/${theme.file}`;
}

function metadata(theme) {
  const c = theme.colors;
  const vars = COLOR_KEYS.map((key) => {
    const label = colorLabel(key);
    return `@var color ${key} "${label}" ${c[key]}`;
  }).join("\n");

  return `/* ==UserStyle==
@name         ${theme.name}
@namespace    https://github.com/${repo}
@version      ${version}
@description  ${theme.description}
@author       arty01238 (https://github.com/arty01238)
@homepageURL  https://github.com/${repo}
@supportURL   https://github.com/${repo}/issues
@updateURL    ${rawUrl(theme)}
@license      MIT
@preprocessor uso
@var text console-host "Local console host or IP\\nHostname or IP only. No https:// and no port. unifi.ui.com is always matched." 192.168.1.1
@var text console-host-2 "Second host or IP\\nAnother hostname or IP. Repeat the first value if you only use one." 192.168.1.1
@var text background-image "Background image\\nDefault is official art hosted by the rights holder, not a file in this repo. Set none to hide it, or url('https://...') to use your own image." "url('${theme.artwork.url}')"
@var range background-dim "Background dim" [${theme.dim}, 0, 0.85, 0.01]
@var range background-blur "Background blur" [0, 0, 40, 1, "px"]
@var range panel-opacity "Panel opacity" [${theme.panel}, 0.4, 1, 0.01]
@var checkbox show-motif "Decorative motif" 1
${vars}
==/UserStyle== */

/*
 * ${theme.name}
 * Generated from src/base.css and src/themes.mjs. Edit those and run npm run build.
 * Unofficial fan theme. Does not modify the router. Characters belong to their owners.
 * ${theme.motifName}: ${theme.motifNote}
 */
`;
}

function colorLabel(key) {
  const labels = {
    background: "Background",
    "background-2": "Background gradient",
    surface: "Panels",
    "surface-raised": "Raised panels",
    border: "Borders",
    text: "Text",
    "text-muted": "Muted text",
    accent: "Accent",
    "accent-2": "Secondary accent",
    highlight: "Highlight",
    "on-accent": "Text on accent",
    "dim-color": "Dim color",
  };
  return labels[key];
}

function hexToRgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((channel) => Math.round(Math.max(0, Math.min(255, channel))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHex(a, b, t) {
  const from = hexToRgb(a);
  const to = hexToRgb(b);
  return rgbToHex(
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  );
}

function ublueScale(accent, direction) {
  if (direction === "dark") {
    return [0.82, 0.68, 0.52, 0.36, 0.18, null, 0.16, 0.32, 0.5, 0.72].map((amount, index) => {
      if (amount == null) return accent;
      return index < 5 ? mixHex(accent, "#000000", amount) : mixHex(accent, "#ffffff", amount);
    });
  }
  return [0.84, 0.7, 0.54, 0.36, 0.16, null, 0.16, 0.32, 0.5, 0.68].map((amount, index) => {
    if (amount == null) return accent;
    return index < 5 ? mixHex(accent, "#ffffff", amount) : mixHex(accent, "#000000", amount);
  });
}

function neutralScale(colors, direction) {
  if (direction === "dark") {
    return [
      colors.background,
      mixHex(colors.background, colors.surface, 0.7),
      colors.surface,
      mixHex(colors.surface, colors["surface-raised"], 0.6),
      colors["surface-raised"],
      mixHex(colors["surface-raised"], colors.border, 0.55),
      colors.border,
      mixHex(colors.border, colors["text-muted"], 0.45),
      colors["text-muted"],
      mixHex(colors["text-muted"], colors.text, 0.28),
      mixHex(colors["text-muted"], colors.text, 0.55),
      mixHex(colors["text-muted"], colors.text, 0.82),
      colors.text,
    ];
  }
  if (colors.surface.toLowerCase() === "#ffffff" || colors.scheme === "light") {
    return [
      colors.surface,
      colors.background,
      colors["surface-raised"],
      mixHex(colors["surface-raised"], colors["background-2"], 0.55),
      colors.border,
      mixHex(colors.border, colors["text-muted"], 0.2),
      mixHex(colors.border, colors["text-muted"], 0.4),
      mixHex(colors["text-muted"], "#ffffff", 0.2),
      colors["text-muted"],
      mixHex(colors["text-muted"], colors.text, 0.35),
      mixHex(colors["text-muted"], colors.text, 0.62),
      mixHex(colors["text-muted"], colors.text, 0.84),
      colors.text,
    ];
  }
  return [
    mixHex("#ffffff", colors.accent, 0.06),
    mixHex("#ffffff", colors.accent, 0.1),
    mixHex("#f4f6fa", colors.accent, 0.14),
    mixHex("#e7ebf2", colors.accent, 0.18),
    mixHex("#d5dce8", colors.surface, 0.2),
    mixHex("#c2ccdb", colors.surface, 0.28),
    mixHex("#a8b4c8", colors.surface, 0.36),
    mixHex("#8b9ab2", colors.surface, 0.42),
    mixHex(colors.surface, colors["text-muted"], 0.35),
    mixHex(colors.surface, "#000000", 0.12),
    colors.surface,
    mixHex(colors.background, "#000000", 0.15),
    mixHex(colors.background, "#000000", 0.35),
  ];
}

function tokenDeclarations(colors, direction) {
  const neutral = neutralScale(colors, direction);
  const ublue = ublueScale(colors.accent, direction);
  const lines = neutral.map((hex, index) => {
    const name = `--color-neutral-${String(index).padStart(2, "0")}`;
    if (index <= 2) {
      const factor = index === 0 ? "0.72" : "1";
      return `${name}: color-mix(in srgb, ${hex} calc(/*[[panel-opacity]]*/ * ${factor} * 100%), transparent) !important;`;
    }
    return `${name}: ${hex} !important;`;
  });
  ublue.forEach((hex, index) => {
    lines.push(`--color-ublue-${String(index + 1).padStart(2, "0")}: ${hex} !important;`);
  });
  return { neutral, lines };
}

function tokenCss(theme) {
  const light = tokenDeclarations({ ...theme.colors, scheme: theme.scheme }, "light");
  const dark = tokenDeclarations({ ...theme.colors, scheme: theme.scheme }, "dark");
  return `html:not([data-theme="dark"]),
[data-uids]:not([data-theme="dark"]) {
  ${light.lines.join("\n  ")}
}

html[data-theme="dark"],
[data-uids][data-theme="dark"] {
  ${dark.lines.join("\n  ")}
}`;
}

function userCss(theme) {
  const motif = theme.wallpaper.join(",\n    ");
  const css = baseCss
    .replaceAll("__UAT_SCHEME__", theme.scheme)
    .replaceAll("__UAT_MOTIF__", motif)
    .replaceAll("__UAT_TOKENS__", tokenCss(theme));
  if (css.includes("__UAT_")) {
    throw new Error(`Unresolved template token in ${theme.id}`);
  }
  return `${metadata(theme)}@-moz-document domain("unifi.ui.com"),
               domain("/*[[console-host]]*/"),
               domain("/*[[console-host-2]]*/") {
${indent(css.trim(), 2)}
}
`;
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}

function swatchesSvg(theme) {
  const keys = ["background", "surface", "accent", "accent-2", "highlight", "text"];
  const size = 28;
  const gap = 6;
  const width = keys.length * size + (keys.length - 1) * gap;
  const rects = keys
    .map((key, i) => {
      const x = i * (size + gap);
      return `  <rect x="${x}" y="0" width="${size}" height="${size}" rx="4" fill="${theme.colors[key]}"/>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${size}" viewBox="0 0 ${width} ${size}" role="img" aria-label="${escapeXml(theme.characterTitle)} palette">
${rects}
</svg>
`;
}

function previewSvg(theme) {
  const c = theme.colors;
  const motif = motifMarkup(theme.motifId, c);
  const title = theme.variantLabel
    ? `${theme.characterTitle} · ${theme.variantLabel}`
    : theme.characterTitle;
  const swatchKeys = ["background", "surface", "accent", "accent-2", "highlight"];
  const dots = swatchKeys
    .map((key, i) => {
      const x = 96 + i * 36;
      return `  <rect x="${x}" y="470" width="28" height="16" rx="3" fill="${c[key]}"/>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="880" height="520" viewBox="0 0 880 520" role="img" aria-label="${escapeXml(title)} UniFi theme preview">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c["background-2"]}"/>
      <stop offset="1" stop-color="${c.background}"/>
    </linearGradient>
  </defs>
  <rect width="880" height="520" fill="url(#bg)"/>
${motif}
  <rect x="40" y="36" width="800" height="448" rx="16" fill="${c.surface}" opacity="0.94"/>
  <rect x="40" y="36" width="800" height="448" rx="16" fill="none" stroke="${c.border}"/>
  <rect x="40" y="36" width="72" height="448" fill="${c.background}"/>
  <circle cx="76" cy="78" r="8" fill="${c.accent}"/>
  <circle cx="76" cy="114" r="8" fill="${c["text-muted"]}"/>
  <circle cx="76" cy="150" r="8" fill="${c["text-muted"]}"/>
  <circle cx="76" cy="186" r="8" fill="${c["accent-2"]}"/>
  <rect x="128" y="52" width="220" height="14" rx="4" fill="${c.text}" opacity="0.9"/>
  <rect x="128" y="74" width="140" height="8" rx="3" fill="${c["text-muted"]}"/>
  <rect x="148" y="120" width="200" height="110" rx="10" fill="${c["surface-raised"]}" stroke="${c.border}"/>
  <rect x="368" y="120" width="200" height="110" rx="10" fill="${c["surface-raised"]}" stroke="${c.border}"/>
  <rect x="588" y="120" width="220" height="110" rx="10" fill="${c["surface-raised"]}" stroke="${c.border}"/>
  <rect x="168" y="148" width="90" height="8" rx="3" fill="${c["text-muted"]}"/>
  <rect x="168" y="168" width="120" height="18" rx="4" fill="${c.text}"/>
  <rect x="388" y="168" width="70" height="36" rx="4" fill="${c.accent}"/>
  <rect x="466" y="184" width="70" height="20" rx="4" fill="${c["accent-2"]}"/>
  <rect x="608" y="150" width="36" height="58" rx="3" fill="${c.border}"/>
  <rect x="652" y="170" width="36" height="38" rx="3" fill="${c.accent}"/>
  <rect x="696" y="140" width="36" height="68" rx="3" fill="${c["accent-2"]}"/>
  <rect x="740" y="158" width="36" height="50" rx="3" fill="${c.highlight}"/>
  <rect x="148" y="260" width="660" height="150" rx="10" fill="${c["surface-raised"]}" stroke="${c.border}"/>
  <rect x="168" y="284" width="180" height="10" rx="3" fill="${c.text}"/>
  <rect x="168" y="312" width="620" height="8" rx="3" fill="${c.border}"/>
  <rect x="168" y="336" width="620" height="8" rx="3" fill="${c.border}"/>
  <rect x="168" y="360" width="420" height="8" rx="3" fill="${c.border}"/>
  <rect x="148" y="430" width="120" height="32" rx="8" fill="${c.accent}"/>
  <rect x="280" y="430" width="120" height="32" rx="8" fill="none" stroke="${c.border}"/>
  <text x="96" y="492" fill="${c["text-muted"]}" font-family="ui-sans-serif, sans-serif" font-size="13">${escapeXml(theme.franchise)}</text>
  <text x="400" y="492" fill="${c.text}" font-family="ui-sans-serif, sans-serif" font-size="16" font-weight="700">${escapeXml(title)}</text>
${dots}
</svg>
`;
}

function motifMarkup(id, c) {
  if (id === "teeth") {
    const teeth = [];
    for (let i = 0; i < 40; i++) {
      const x = 20 + i * 22;
      const fill = i % 2 === 0 ? c.accent : c.highlight;
      teeth.push(`  <polygon points="${x},0 ${x + 22},0 ${x + 11},16" fill="${fill}"/>`);
    }
    return [
      `  <polygon points="0,0 520,0 0,520" fill="${c.accent}" opacity="0.16"/>`,
      ...teeth,
    ].join("\n");
  }
  if (id === "pinstripe") {
    const lines = [];
    for (let i = -8; i < 24; i++) {
      const x = i * 48;
      lines.push(
        `  <line x1="${x}" y1="520" x2="${x + 520}" y2="0" stroke="${c["accent-2"]}" stroke-opacity="0.35" stroke-width="2"/>`,
      );
    }
    return [
      `  <circle cx="40" cy="480" r="160" fill="${c.accent}" opacity="0.2"/>`,
      `  <circle cx="840" cy="40" r="120" fill="${c.highlight}" opacity="0.16"/>`,
      ...lines,
      `  <rect width="880" height="6" fill="${c.accent}"/>`,
    ].join("\n");
  }
  if (id === "petals") {
    return [
      `  <circle cx="70" cy="450" r="34" fill="${c.accent}" opacity="0.45"/>`,
      `  <circle cx="118" cy="410" r="46" fill="${c.accent}" opacity="0.32"/>`,
      `  <circle cx="36" cy="400" r="22" fill="${c["accent-2"]}" opacity="0.7"/>`,
      `  <ellipse cx="150" cy="455" rx="70" ry="16" fill="none" stroke="${c["accent-2"]}" stroke-width="6"/>`,
      `  <ellipse cx="20" cy="455" rx="70" ry="16" fill="none" stroke="${c.accent}" stroke-width="6"/>`,
      `  <circle cx="160" cy="18" r="10" fill="${c.accent}"/>`,
      `  <circle cx="200" cy="18" r="10" fill="${c.accent}"/>`,
      `  <circle cx="240" cy="18" r="10" fill="${c.accent}"/>`,
      `  <circle cx="280" cy="18" r="10" fill="${c.accent}"/>`,
      `  <circle cx="320" cy="18" r="10" fill="${c.accent}"/>`,
    ].join("\n");
  }
  return [
    `  <g transform="translate(760 430)" fill="none" stroke="${c["accent-2"]}" stroke-width="3">`,
    `    <circle r="78"/>`,
    `    <circle r="108" stroke="${c.accent}"/>`,
    `    <path d="M0,-108 L0,-78 M0,78 L0,108 M-108,0 L-78,0 M78,0 L108,0" />`,
    `    <path d="M0,0 L34,-58" stroke="${c.accent}" stroke-width="4"/>`,
    `  </g>`,
    `  <rect width="880" height="3" fill="${c.accent}"/>`,
  ].join("\n");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paletteTable(theme) {
  const rows = COLOR_KEYS.map((key) => `| ${colorLabel(key)} | \`${theme.colors[key]}\` |`);
  return `| Token | Hex |
| --- | --- |
${rows.join("\n")}`;
}

function themeReadme(group) {
  const first = group[0];
  const installRows = group
    .map((theme) => {
      const label = theme.variantLabel || theme.characterTitle;
      return `- **${label}:** [Install with Stylus](${rawUrl(theme)})`;
    })
    .join("\n");
  const previews = group
    .map((theme) => {
      const file = group.length > 1 ? `${theme.id}.svg` : "preview.svg";
      const caption = theme.variantLabel || theme.characterTitle;
      return `![${caption} preview](preview/${file})`;
    })
    .join("\n\n");
  const palettes = group
    .map((theme) => {
      const heading = theme.variantLabel ? `### ${theme.variantLabel}` : "### Palette";
      return `${heading}\n\n${theme.summary}\n\n${paletteTable(theme)}\n\nDim default \`${theme.dim}\`. Panel opacity default \`${theme.panel}\`. Color scheme \`${theme.scheme}\`.\n`;
    })
    .join("\n");
  return `# ${first.characterTitle}

${first.franchise}. ${group.map((theme) => theme.summary).join(" ")}

${previews}

## Install

${installRows}

Then set **Local console host or IP** in Stylus (the gear icon) to your Dream Machine's host or IP. \`unifi.ui.com\` is always matched. See the [root README](../../../README.md) for dim, blur, swapping the portrait, and uninstall.

## Default artwork

The **Background image** variable is already a portrait, so the theme shows the character as soon as Stylus installs it. The picture is not in this repository.

${artworkLines(group)}

To change it, open Stylus → the style's gear icon and set **Background image** to \`none\` or to \`url('https://example.com/your-image.png')\`. Raise **Background dim** if a bright photo makes the console hard to read.

## Motif

**${first.motifName}.** ${first.motifNote}

## Palette

Original hex values, not an official color guide. Stylus exposes each one as a \`@var color\` so you can change it without editing the file.

${palettes}
## Files

| File | Role |
| --- | --- |
${group.map((theme) => `| \`${theme.file}\` | Built Stylus userstyle |`).join("\n")}
| \`preview/\` | Original SVG mockups of the palette and motif |

Rebuild from \`src/themes.mjs\` with \`npm run build\`. Do not edit the \`.user.css\` by hand.
`;
}

function themesIndex() {
  const lines = themes.map((theme) => {
    return `| [${theme.characterTitle}${theme.variantLabel ? ` (${theme.variantLabel})` : ""}](${theme.franchiseSlug}/${theme.characterSlug}/) | ${theme.franchise} | \`${theme.franchiseSlug}/${theme.characterSlug}/${theme.file}\` |`;
  });
  return `# Themes

Each character lives in \`themes/<franchise>/<character>/\` with a built \`.user.css\`, a README, and a \`preview/\` folder. Variants of one character share the folder (see Madoka Kaname).

| Theme | Franchise | Userstyle |
| --- | --- | --- |
${lines.join("\n")}

Add a character by editing \`src/themes.mjs\` and running \`npm run build\`. The root README has the full steps.
`;
}

function artworkLines(group) {
  const seen = new Set();
  const lines = [];
  for (const theme of group) {
    if (seen.has(theme.artwork.url)) continue;
    seen.add(theme.artwork.url);
    const who = group
      .filter((item) => item.artwork.url === theme.artwork.url)
      .map((item) => item.variantLabel || item.characterTitle)
      .join(", ");
    lines.push(
      `- **${who}:** ${theme.artwork.credit} [Character page](${theme.artwork.page}). Image: ${theme.artwork.url}`,
    );
  }
  return lines.join("\n");
}

function artworkSection() {
  const seen = new Set();
  const rows = [];
  for (const theme of themes) {
    if (seen.has(theme.artwork.url)) continue;
    seen.add(theme.artwork.url);
    const who = themes
      .filter((item) => item.artwork.url === theme.artwork.url)
      .map((item) => (item.variantLabel ? `${item.characterTitle} (${item.variantLabel})` : item.characterTitle))
      .join(", ");
    rows.push(
      `| ${who} | [${theme.artwork.page.replace(/^https:\/\//, "")}](${theme.artwork.page}) | [image](${theme.artwork.url}) |`,
    );
  }
  return `The **Background image** value is already filled in. It is a CSS \`url('…')\` pointing at a portrait on the official site, so the character is visible immediately after install. Nothing in \`themes/\` is that image file.

| Theme | Character page | Image |
| --- | --- | --- |
${rows.join("\n")}

Checked from this environment: each URL answered **HTTP 200** with \`Content-Type: image/png\`, including a request whose Referer was \`https://unifi.ui.com/\`. HoYoverse serves Ellen and Jane from \`fastcdn.hoyoverse.com\`. Madoka and Homura come from \`www.madoka-magica.com\`. Those hosts can still change or remove a file later; the variable is there so you can point it somewhere else.
`;
}

function gallery() {
  const rows = themes.map((theme) => {
    const swatchName = themes.filter((item) => item.characterSlug === theme.characterSlug).length > 1
      ? `swatches-${theme.scheme}.svg`
      : "swatches.svg";
    const swatchPath = `themes/${theme.franchiseSlug}/${theme.characterSlug}/preview/${swatchName}`;
    const label = theme.variantLabel
      ? `${theme.characterTitle} (${theme.variantLabel})`
      : theme.characterTitle;
    const folder = `themes/${theme.franchiseSlug}/${theme.characterSlug}/`;
    return `| [${label}](${folder}) | ${theme.franchise} | ![${label} swatches](${swatchPath}) | [Install](${rawUrl(theme)}) |`;
  });
  return `## Gallery

Palettes below are the built-in defaults. Install links open the raw \`.user.css\` on the \`main\` branch so Stylus can install them in one click.

| Theme | Franchise | Palette | Install |
| --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function assertThemes() {
  const ids = new Set();
  const paths = new Set();
  for (const theme of themes) {
    if (ids.has(theme.id)) throw new Error(`Duplicate theme id ${theme.id}`);
    ids.add(theme.id);
    const rel = `${theme.franchiseSlug}/${theme.characterSlug}/${theme.file}`;
    if (paths.has(rel)) throw new Error(`Duplicate output ${rel}`);
    paths.add(rel);
    for (const key of COLOR_KEYS) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(theme.colors[key] || "")) {
        throw new Error(`${theme.id} color ${key} must be a 6-digit hex`);
      }
    }
    if (!["dark", "light"].includes(theme.scheme)) throw new Error(`${theme.id} scheme`);
    if (!theme.wallpaper.length) throw new Error(`${theme.id} missing wallpaper`);
    const art = theme.artwork;
    if (!art || !/^https:\/\/[^ ]+$/.test(art.url) || !/^https:\/\/[^ ]+$/.test(art.page)) {
      throw new Error(`${theme.id} needs an https artwork url and page`);
    }
    const host = new URL(art.url).host;
    if (!["fastcdn.hoyoverse.com", "www.madoka-magica.com"].includes(host)) {
      throw new Error(`${theme.id} artwork host ${host} is not an allowed official host`);
    }
    if (!/\.(png|jpe?g|webp)$/i.test(new URL(art.url).pathname)) {
      throw new Error(`${theme.id} artwork URL is not an image path`);
    }
    const button = contrast(theme.colors["on-accent"], theme.colors.accent);
    const body = contrast(theme.colors.text, theme.colors.surface);
    const muted = contrast(theme.colors["text-muted"], theme.colors.surface);
    if (button < 4.5) {
      throw new Error(`${theme.id} accent button contrast ${button.toFixed(2)} is below 4.5`);
    }
    if (body < 4.5) {
      throw new Error(`${theme.id} text on surface contrast ${body.toFixed(2)} is below 4.5`);
    }
    if (muted < 4.5) {
      throw new Error(`${theme.id} muted text on surface contrast ${muted.toFixed(2)} is below 4.5`);
    }
    if (theme.panel < 0.7 || theme.panel > 0.8) {
      throw new Error(`${theme.id} panel opacity ${theme.panel} is outside 0.70-0.80`);
    }
    for (const direction of ["dark", "light"]) {
      const scale = tokenDeclarations({ ...theme.colors, scheme: theme.scheme }, direction).neutral;
      for (const index of [12, 10, 8]) {
        const ratio = contrast(scale[index], scale[1]);
        if (ratio < 4.5) {
          throw new Error(
            `${theme.id} ${direction} neutral-${String(index).padStart(2, "0")} on neutral-01 is ${ratio.toFixed(2)}`,
          );
        }
      }
    }
  }
  const baseRules = baseCss.replace(/\/\*[\s\S]*?\*\//g, "");
  if (/\bbody \*|^\s*\*\s*\{/m.test(baseRules)) {
    throw new Error("base.css uses a universal selector");
  }
  if (/\[class\*=["'](?:tile|card|panel|widget|icon|button|menu|table|sidebar)/i.test(baseRules)) {
    throw new Error("base.css uses a broad partial class selector");
  }
  if (/(?:^|[\s,{])(?:img|svg|picture|canvas)\b/.test(baseRules)) {
    throw new Error("base.css must not style img, svg, picture, or canvas");
  }
  const accents = new Set(themes.map((theme) => theme.colors.accent.toLowerCase()));
  if (accents.size !== themes.length) {
    throw new Error("Each theme needs a distinct accent color");
  }
}

function contrast(foreground, background) {
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function simulateUso(css) {
  return css.replace(/\/\*\[\[([\w-]+)]]\*\//g, (_, name) => {
    if (name === "console-host" || name === "console-host-2") return "192.168.1.1";
    if (name === "background-image") return "none";
    if (name === "background-dim") return "0.3";
    if (name === "background-blur") return "0px";
    if (name === "panel-opacity") return "0.86";
    if (name === "show-motif") return "1";
    return "#112233";
  });
}

function assertCss(theme, css) {
  const required = [
    "@name",
    "@namespace",
    "@version",
    "@description",
    "@license",
    "@preprocessor uso",
    "==UserStyle==",
    "==/UserStyle==",
    'domain("unifi.ui.com")',
    'domain("/*[[console-host]]*/")',
    "/*[[accent]]*/",
    "/*[[background-image]]*/",
    "/*[[background-dim]]*/",
    "/*[[background-blur]]*/",
    "/*[[panel-opacity]]*/",
  ];
  for (const token of required) {
    if (!css.includes(token)) throw new Error(`${theme.id} missing ${token}`);
  }
  if (css.includes("__UAT_") || css.includes("{{")) {
    throw new Error(`${theme.id} has a leftover template token`);
  }
  const replaced = simulateUso(css);
  if (!replaced.includes('domain("192.168.1.1")')) {
    throw new Error(`${theme.id} host variable did not land in domain()`);
  }
  if (replaced.includes("/*[[")) throw new Error(`${theme.id} leftover uso placeholder`);
  const opens = (replaced.match(/\{/g) || []).length;
  const closes = (replaced.match(/\}/g) || []).length;
  if (opens !== closes) throw new Error(`${theme.id} unbalanced braces (${opens} vs ${closes})`);
  const images = css.match(/https?:\/\/[^\s"')]+\.(?:png|jpe?g|gif|webp)/gi) || [];
  const unique = [...new Set(images)];
  if (unique.length !== 1 || unique[0] !== theme.artwork.url) {
    throw new Error(`${theme.id} image URLs ${unique.join(", ") || "(none)"} do not match its artwork`);
  }
}

assertThemes();

const groups = new Map();
for (const theme of themes) {
  const key = `${theme.franchiseSlug}/${theme.characterSlug}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(theme);
  const css = userCss(theme);
  assertCss(theme, css);
  const dir = `themes/${theme.franchiseSlug}/${theme.characterSlug}`;
  write(`${dir}/${theme.file}`, css);
}

for (const [key, group] of groups) {
  write(`themes/${key}/README.md`, themeReadme(group));
  const multiple = group.length > 1;
  for (const theme of group) {
    const previewName = multiple ? `${theme.id}.svg` : "preview.svg";
    const swatchName = multiple ? `swatches-${theme.scheme}.svg` : "swatches.svg";
    write(`themes/${key}/preview/${previewName}`, previewSvg(theme));
    write(`themes/${key}/preview/${swatchName}`, swatchesSvg(theme));
  }
}

write("themes/README.md", themesIndex());

if (!readmeTemplate.includes("{{GALLERY}}") || !readmeTemplate.includes("{{ARTWORK}}")) {
  throw new Error("README template is missing {{GALLERY}} or {{ARTWORK}}");
}
write(
  "README.md",
  readmeTemplate.replace("{{GALLERY}}", gallery().trim()).replace("{{ARTWORK}}", artworkSection().trim()),
);

const expected = new Set(files.keys());
if (check) {
  const problems = [];
  for (const [rel, contents] of files) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) {
      problems.push(`missing ${rel}`);
      continue;
    }
    const current = fs.readFileSync(abs, "utf8");
    if (current !== contents) problems.push(`drift ${rel}`);
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(`check ok (${files.size} files, ${themes.length} themes)`);
} else {
  for (const [rel, contents] of files) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contents);
  }
  console.log(`wrote ${files.size} files for ${themes.length} themes`);
  for (const theme of themes) {
    const ratio = contrast(theme.colors["on-accent"], theme.colors.accent);
    const body = contrast(theme.colors.text, theme.colors.surface);
    console.log(
      `${theme.id}: button contrast ${ratio.toFixed(2)}, text contrast ${body.toFixed(2)}`,
    );
  }
}
