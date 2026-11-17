# UniFi Router Anime Themes

Browser themes for the **UniFi OS** web console on the **UniFi Dream Machine Pro** and **Dream Machine Pro SE**. Both consoles serve the same UniFi OS and UniFi Network web UI. Each theme is a [Stylus](https://add0n.com/stylus.html) userstyle: it restyles the page in your browser after the console has rendered it.

Nothing in this repository SSHes into the gateway, edits its files, or persists a change on the device. Disable the style and the console looks stock again.

## Gallery

Palettes below are the built-in defaults. Install links open the raw `.user.css` on the `main` branch so Stylus can install them in one click.

| Theme | Franchise | Palette | Install |
| --- | --- | --- | --- |
| [Ellen Joe](themes/zenless-zone-zero/ellen-joe/) | Zenless Zone Zero | ![Ellen Joe swatches](themes/zenless-zone-zero/ellen-joe/preview/swatches.svg) | [Install](https://raw.githubusercontent.com/arty01238/Unifi-Router-Anime-Themes/main/themes/zenless-zone-zero/ellen-joe/ellen-joe.user.css) |
| [Jane Doe](themes/zenless-zone-zero/jane-doe/) | Zenless Zone Zero | ![Jane Doe swatches](themes/zenless-zone-zero/jane-doe/preview/swatches.svg) | [Install](https://raw.githubusercontent.com/arty01238/Unifi-Router-Anime-Themes/main/themes/zenless-zone-zero/jane-doe/jane-doe.user.css) |
| [Madoka Kaname (Light)](themes/madoka-magica/madoka-kaname/) | Puella Magi Madoka Magica | ![Madoka Kaname (Light) swatches](themes/madoka-magica/madoka-kaname/preview/swatches-light.svg) | [Install](https://raw.githubusercontent.com/arty01238/Unifi-Router-Anime-Themes/main/themes/madoka-magica/madoka-kaname/madoka-kaname-light.user.css) |
| [Madoka Kaname (Dark)](themes/madoka-magica/madoka-kaname/) | Puella Magi Madoka Magica | ![Madoka Kaname (Dark) swatches](themes/madoka-magica/madoka-kaname/preview/swatches-dark.svg) | [Install](https://raw.githubusercontent.com/arty01238/Unifi-Router-Anime-Themes/main/themes/madoka-magica/madoka-kaname/madoka-kaname-dark.user.css) |
| [Homura Akemi](themes/madoka-magica/homura-akemi/) | Puella Magi Madoka Magica | ![Homura Akemi swatches](themes/madoka-magica/homura-akemi/preview/swatches.svg) | [Install](https://raw.githubusercontent.com/arty01238/Unifi-Router-Anime-Themes/main/themes/madoka-magica/homura-akemi/homura-akemi.user.css) |

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

The **Background image** value is already filled in. It is a CSS `url('…')` pointing at a portrait on the official site, so the character is visible immediately after install. Nothing in `themes/` is that image file.

| Theme | Character page | Image |
| --- | --- | --- |
| Ellen Joe | [zenless.hoyoverse.com/en-us/character?id=113671](https://zenless.hoyoverse.com/en-us/character?id=113671) | [image](https://fastcdn.hoyoverse.com/content-v2/nap/113671/59a98a82a886f49c3b1b89bdc77cbb36_21606237077173472.png) |
| Jane Doe | [zenless.hoyoverse.com/en-us/character?id=124675](https://zenless.hoyoverse.com/en-us/character?id=124675) | [image](https://fastcdn.hoyoverse.com/content-v2/nap/124675/be75dc37b5f356bdebc358fa21b7086a_5376265045261362106.png) |
| Madoka Kaname (Light), Madoka Kaname (Dark) | [www.madoka-magica.com/tv/character/](https://www.madoka-magica.com/tv/character/) | [image](https://www.madoka-magica.com/tv/assets/img/character/chara_img_madoka02.png) |
| Homura Akemi | [www.madoka-magica.com/tv/character/](https://www.madoka-magica.com/tv/character/) | [image](https://www.madoka-magica.com/tv/assets/img/character/chara_img_homura02.png) |

Checked from this environment: each URL answered **HTTP 200** with `Content-Type: image/png`, including a request whose Referer was `https://unifi.ui.com/`. HoYoverse serves Ellen and Jane from `fastcdn.hoyoverse.com`. Madoka and Homura come from `www.madoka-magica.com`. Those hosts can still change or remove a file later; the variable is there so you can point it somewhere else.

Use an `https` URL. The console is served over HTTPS, and browsers block plain `http` images as mixed content. A `data:` URL also works. `file://` images will not load on an HTTPS page.

The default portraits are linked, not copied. Do not download them into this repository. If a host removes a file, set **Background image** to `none` or to a picture you have the rights to use.

## Uninstall

Stylus → **Manage** → disable or delete the style. There is nothing to undo on the Dream Machine. The next page load is the stock console.

Updates: Stylus can track the install URL (`@updateURL` points at the same raw file). Your Configure values are kept when the style updates. Bump conflicts only happen if you hand-edit the installed source; change colors through Configure instead.

## What a theme changes

Each `.user.css` is generated from [`src/base.css`](src/base.css) plus a palette and motif in [`src/themes.mjs`](src/themes.mjs). The shared base:

- Sets UniFi Design System color tokens on `html` (`--desktop-color-text-1/2/3`, `--desktop-color-depth-bg-0/1/2`, `--desktop-color-global-primary`, `--desktop-color-ublue-06`) and the older `--ubnt-color-*` / `--button-primary-*` / `--main-panel-background-color` names. Neutral scales and icon `url()` tokens are left alone.
- Paints the page, `nav` / `aside` / `header`, and `section` / `article` / `dialog` only. Panels default to about 75% opacity. Cards and dialogs also get a backdrop blur. The sidebar does not, so the product photo can paint.
- Places the portrait at the bottom-right (`background-size: contain`) under a light dim, with a 2px accent line instead of a patterned strip.
- Colors native checkboxes, radios, and sliders with `accent-color` only.

`@-moz-document` matches `domain("unifi.ui.com")` plus `domain()` for the two host variables. Stylus's `uso` preprocessor substitutes `/*[[console-host]]*/` before it parses the document rule (see `src/js/worker/pre-uso.js` in the Stylus repo), so the host is a real Configure field and not only a comment.

## Known limitations

Version 1.1.0 was adjusted after a UniFi OS 5.0.x / Network 10.x Dashboard screenshot from a UDM SE. Earlier rules matched partial class names and every element under `body`, which blanked device icons and the sidebar product image. The console still has to be checked by someone with a gateway; `unifi.ui.com` is not a public demo.

Expect these gaps:

- Surfaces that do not use the tokens above, and are not `nav`, `aside`, `header`, `section`, `article`, or `dialog`, keep the console's own colors. Hashed classes (`css-xxxxx`, `css-network-*`) are not targeted.
- **Shadow DOM**, **canvas** charts, **WebGL** maps, and author styles with inline `!important` can ignore a userstyle.
- **Status colors** (online green, offline red, warning amber) and icon art are not remapped.
- An inner node that sets the same custom property still wins over the value on `html`.
- Hosts other than `unifi.ui.com` and the two Configure fields are not matched. Direct-remote hostnames belong in **Second host**.
- The SSO page `account.ui.com` is not themed.
- `color-mix()` is required (Chrome 111+, Firefox 113+, Safari 16.2+).

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
