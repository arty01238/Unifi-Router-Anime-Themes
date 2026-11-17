# UniFi Router Anime Themes

Browser themes for the **UniFi OS** web console on the **UniFi Dream Machine Pro** and **Dream Machine Pro SE**. Both consoles serve the same UniFi OS and UniFi Network web UI. Each theme is a [Stylus](https://add0n.com/stylus.html) userstyle: it restyles the page in your browser after the console has rendered it.

Nothing in this repository SSHes into the gateway, edits its files, or persists a change on the device. Disable the style and the console looks stock again.

{{GALLERY}}

## Install

1. Install [Stylus](https://add0n.com/stylus.html) for Firefox, Chrome, or Edge. Other userstyle managers only work if they understand modern Stylus metadata (`@preprocessor uso` and `/*[[variable]]*/`).
2. Click an **Install** link above. The URL ends in `.user.css` on `raw.githubusercontent.com`, which Stylus recognizes. Confirm **Install style**.
3. Open Stylus → the style's gear icon (**Configure**). Set **Local console host or IP** to the hostname or IP you type in the address bar. The default is `192.168.1.1`. No `https://`, no port. `unifi.ui.com` is always included. **Second host or IP** covers a second name (for example `unifi.local`); if you only have one, leave it equal to the first.
4. Sign in at `https://unifi.ui.com` or `https://<your-host>`. The Ubiquiti account login on `account.ui.com` is left alone on purpose.
5. Enable **one** theme at a time. Two styles will fight over the same elements.

For a dark theme, set the console's own appearance to **Dark** first (UniFi OS / Network settings). Surfaces this style cannot see stay dark instead of flashing white. For **Madoka Kaname (Light)**, set the console to **Light**.

The style applies to iframes on the same host, which is how the Network application is often embedded in the UniFi OS shell.

## Set your own background

In the style's Configure panel:

| Option | What to enter |
| --- | --- |
| Background image | Already set to an official portrait. Replace it with `none` (gradient only) or `url('https://example.com/your-picture.png')` |
| Background dim | How strongly **Dim color** washes the portrait. Raise it if the character art makes the console hard to read. |
| Background blur | Blur in pixels, applied only to the wallpaper layer. |
| Panel opacity | How solid cards, nav, and tables are. Lower values let more of the wallpaper through. `1` is fully solid. |
| Decorative motif | Turns the top edge and the corner pattern on or off. |
| Accent, surface, text, … | Every palette color, if you want to nudge it. |

{{ARTWORK}}

Use an `https` URL. The console is served over HTTPS, and browsers block plain `http` images as mixed content. A `data:` URL also works. `file://` images will not load on an HTTPS page.

The default portraits are linked, not copied. Do not download them into this repository. If a host removes a file, set **Background image** to `none` or to a picture you have the rights to use.

## Uninstall

Stylus → **Manage** → disable or delete the style. There is nothing to undo on the Dream Machine. The next page load is the stock console.

Updates: Stylus can track the install URL (`@updateURL` points at the same raw file). Your Configure values are kept when the style updates. Bump conflicts only happen if you hand-edit the installed source; change colors through Configure instead.

## What a theme changes

Each `.user.css` is generated from [`src/base.css`](src/base.css) plus a palette and motif in [`src/themes.mjs`](src/themes.mjs). The shared base:

- Overrides the legacy UniFi custom properties published in the [2019 UniFi-Dark gist](https://gist.github.com/tkuennen/cf7f3ad4984f6d97ad87452c66a168af) (`--ubnt-color-*`, `--main-panel-background-color`, `--button-primary-*`, `--navigation-*`, `--modal-*`, `--table-*`, and the related component tokens). Icon `url()` tokens from that gist are not cleared.
- Paints `html` / `body`, `#root`, `#app`, semantic elements (`main`, `nav`, `header`, `dialog`, tables, inputs), and ARIA roles.
- Matches partial class names (`sidebar`, `navigation`, `header`, `card`, `panel`, `modal`, `dropdown`, …) and a few legacy class names (`.modular`, `.appTable`, `.appButton--primary`).
- Draws an original CSS motif and reads your Stylus variables for accent colors, the background image, dim, blur, and panel opacity.

`@-moz-document` matches `domain("unifi.ui.com")` plus `domain()` for the two host variables. Stylus's `uso` preprocessor substitutes `/*[[console-host]]*/` before it parses the document rule (see `src/js/worker/pre-uso.js` in the Stylus repo), so the host is a real Configure field and not only a comment.

## Known limitations

These styles were **not** checked against a live UDM Pro or UDM Pro SE. The console requires an account, and `unifi.ui.com` is not a public demo. Selector choices come from the public gist above, from community notes that the modern UI is a React app (including a Network 8.x report of hashed `css-network-*` classes with hard-coded backgrounds), and from a search of GitHub and userstyles.world that did not turn up a maintained userstyle for the current shell.

Expect these gaps:

- **Hashed classes** (`css-xxxxx`, `css-network-*`) change between UniFi OS builds and are not listed one by one. A white card with a hashed class can stay white. The practical workaround is the console's own Dark (or Light) appearance, which fills in the holes.
- **Shadow DOM**, **canvas** charts, **WebGL** maps, and author styles with `!important` inline can ignore a userstyle.
- **Status colors** (online green, offline red, warning amber) are not globally remapped. Danger and success buttons are forced back to red and green when their class name says so. Other status text can still pick up the theme text color if it only inherited `color`.
- The legacy token block is applied broadly, including on `body *`, so an inner theme node cannot quietly restore Ubiquiti blue. A component that reused one of those exact token names for a one-off color will follow the theme instead.
- `[class*="card"]` and similar fragments can restyle an unrelated node whose class happens to contain that substring.
- `body` is `position: relative; z-index: 0` so the wallpaper can sit behind the UI without falling through the canvas. That has not been observed to trap `position: fixed` (fixed positioning is not contained by `z-index` alone), but it is a behavior change.
- Hosts other than `unifi.ui.com` and the two Configure fields are not matched. Direct-remote hostnames belong in **Second host**.
- The SSO page `account.ui.com` is not themed.
- `color-mix()` is required (Chrome 111+, Firefox 113+, Safari 16.2+). That is the current Stylus browser set; older browsers will ignore the mixed colors.

After a UniFi OS update, if a page regresses, open an issue with the OS version and what broke. A class name from devtools is enough; do not paste passwords or WAN addresses.

## Build

The files under `themes/` are generated. Edit `src/`, then rebuild. Node.js 18 or newer is enough; there are no packages to install.

```bash
npm run build
npm run check
```

`npm run check` rebuilds in memory and exits with an error if a committed file drifted. The GitHub Action runs the same check.

Generated CSS starts with a Stylus metadata block (`@name`, `@namespace`, `@version`, `@description`, `@license`, `@preprocessor uso`) and an `@-moz-document` rule. Do not hand-edit those outputs; the next build overwrites them.

## Adding a character

1. Add an object to the `themes` array in [`src/themes.mjs`](src/themes.mjs).
   - `franchiseSlug` / `characterSlug` become `themes/<franchise>/<character>/`.
   - A second look for the same character (the way Madoka has light and dark) is another object with the same slugs and a different `file`.
   - `colors` supplies the `@var color` defaults. Keep body text and the accent button readable (the build checks contrast of `on-accent` on `accent`, and of `text` on `surface`).
   - `wallpaper` is a list of CSS gradient layers. `edge` is the declaration block for the top bar. Use the `/*[[token]]*/` placeholders (`accent`, `accent-2`, `highlight`, `background`, `background-2`, and so on) so Configure still recolors the motif.
   - Keep motifs as original CSS shapes. Do not paste official artwork, logos, or screenshots into `preview/`.
2. Run `npm run build`. Commit both `src/` and the generated `themes/` files, plus the updated gallery in this README.
3. In a browser with Stylus, install the new raw URL, set the console host, and look at the dashboard, a settings page, a dialog, and the login page. Note the UniFi OS version in the pull request.

Palettes in the existing themes are original interpretations of publicly visible costume colors, not copies of an official style guide.

## Disclaimer

Ellen Joe and Jane Doe are characters from **Zenless Zone Zero**, published by **HoYoverse**. Madoka Kaname and Homura Akemi are characters from **Puella Magi Madoka Magica**, associated with **Aniplex**, **Shaft**, and **Magica Quartet**. UniFi, UniFi OS, Dream Machine, and UDM are trademarks of **Ubiquiti Inc**.

This is an unofficial fan project. It is not affiliated with, endorsed by, or connected to Ubiquiti, HoYoverse, Aniplex, Shaft, or Magica Quartet. Character names are used only to identify the fan palette. No official character artwork, game screenshots, or logos are stored in this repository. The default background of each theme is a link to a portrait that HoYoverse or the official Madoka Magica site already hosts. Those images remain the property of their owners. The code is [MIT](LICENSE).

## License

MIT. See [LICENSE](LICENSE).
