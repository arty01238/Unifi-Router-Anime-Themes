# UniFi UI research

## What was loaded

`https://demo.ui.com` responds **301 to `https://ui.com/`**. The old public UniFi Network controller demo was removed years ago (Ubiquiti Community threads from 2020–2021). `https://unifi.ui.com` redirects to the Ubiquiti account login.

The current official no-login UniFi web app is **UniFi Design Center**:

- https://design.ui.com/projects/default/rack
- https://design.ui.com/projects/default/plans/default
- https://design.ui.com/projects/default/topology
- https://design.ui.com/projects/default/ports

It does **not** ship the Network pages the owner uses (Dashboard, Devices, Clients, Settings → WiFi, Insights). Those views are compared below only by the shared color system, not by a pixel match of the UDM SE dashboard.

## Owner's console

- UniFi OS 5.0.x
- UniFi Network 10.x
- UDM SE, local console, dark Dashboard

## Design Center tokens (captured in Chromium)

Design Center's stylesheets define the UniFi Design System on `:root` and `[data-uids]`. Semantic colors are aliases:

| Token | Points at |
| --- | --- |
| `--color-text-1` | `--color-neutral-12` |
| `--color-text-2` | `--color-neutral-10` |
| `--color-text-3` | `--color-neutral-08` |
| `--color-text-4` | `--color-neutral-06` |
| `--color-depth-bg-0` | `--color-neutral-01` in light mode, `--color-neutral-00` in dark mode |
| `--color-depth-bg-1` | `--color-neutral-00` in light mode, `--color-neutral-01` in dark mode |
| `--color-button-primary-bg-emphasis-enabled` | `--color-ublue-06` |
| `--desktop-color-*` | the matching `--color-*` token |

Light mode (`[data-uids]:not([data-theme="dark"])`), surfaces are the low indexes and text is the high indexes:

- `--color-neutral-00` `#ffffff` through `--color-neutral-12` `#212327`
- `--color-ublue-06` `#006eff` (index 01 is the light tint, index 10 is the dark tint)

Dark mode (`[data-theme="dark"]`) keeps the same roles and flips lightness:

- `--color-neutral-00` `#131416` through `--color-neutral-12` `#f9fafa`
- `--color-ublue-06` `#4797ff` (index 01 is dark, index 10 is light)

Green and red scales (`--color-green-06` `#38cc65` / `#37be5f`, `--color-red-06` `#f0383b` / `#ee6368`) are left alone so status stays readable.

A one-off injection that changed only `--color-ublue-06` and a few neutrals turned the Sign in button, the selected radio, links, and the capacity slider to the new accent while rack photos, device icons, and layout stayed intact. Themes remap the full neutral and ublue scales on `html` and `[data-uids]` and do not style images or form controls.

Version 1.2.1 writes one scale into both the light and dark token blocks. Dark themes (Ellen, Jane, Madoka Dark, Homura) write the dark scale (00 darkest, 12 lightest text) and `color-scheme: dark` even when the app is in light mode. Madoka Light writes the light scale into both blocks. Design Center only swaps its hashed `*-light` / `*-dark` classes when `localStorage.motif` is set before boot (`"dark"`, `"light"`, or `"system"`). A userstyle cannot write that key. `npm run screenshots` sets it and reloads, then checks `body[data-theme]`. On a console that is already dark, the dark class set and the dark token block match.

`.hint-tooltip` and the filled primary button hardcode `rgb(71, 151, 255)` with near-white text (about 2.8:1). Those surfaces use `--color-button-primary-bg-emphasis-enabled`, which is the accent darkened until white text clears 4.6:1.

## Why this can still differ on a UDM SE

Network 10 on UniFi OS 5 is the same design system, but a console build can still:

- set `data-theme="dark"` (the owner's console is dark; Design Center defaults to light)
- ship a newer or older token snapshot than Design Center on 17 Nov 2026
- hardcode hashed module colors that do not read `--color-neutral-*`
- render dashboard widgets Design Center does not have: Top APs, Top Clients, Most Common Devices, Critical Traffic, and the WiFi speed boxes

Those Network 10 widgets were not rendered here, so their contrast and icon treatment are unverified.

`npm run screenshots` reloads Design Center at 1920×1080, samples at least 30 text nodes per themed page and fails the run if any content sample is under 4.5:1, samples the bottom-right of the PNG and fails if it is flat, writes stock and themed PNGs under `research/raw/screenshots/` (gitignored), and copies the rack view to each theme's `preview/dashboard-stock.png` and `preview/dashboard-<theme>.png`.

Design Center creates a temporary guest user for each fresh browser profile. `GET https://design.svc.ui.com/user/me` returns `errors.tempAuth.usage` after 20 of those per day, and the app then redirects to the Ubiquiti account login. When that happens the screenshot script cannot boot `data-theme` and exits. A later run the same day has to wait for that quota.

Homura's clock is a repeating conic gradient. A 0.65° tick is a thin mark next to the center and a thick band at the far edge of the viewport, so the wallpaper covers the ticks with the theme background outside a 300px radius.
