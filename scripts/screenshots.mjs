/**
 * Visual check against the public UniFi web app.
 *
 * demo.ui.com now redirects to https://ui.com/ and the old controller demo is gone.
 * The no-login official app is UniFi Design Center:
 * https://design.ui.com/projects/default/rack
 * It uses the same UniFi Design System color tokens as current UniFi OS / Network
 * (--color-neutral-00..12, --color-ublue-01..10, --color-text-*, --color-depth-bg-*).
 *
 * Requires Google Chrome and `npm install` (playwright-core). Run `npm run build` first.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { themes } from "../src/themes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = path.join(root, "research", "raw");
const shotDir = path.join(rawDir, "screenshots");

const pages = [
  { id: "rack", url: "https://design.ui.com/projects/default/rack", note: "Closest public view to a device dashboard" },
  { id: "plans", url: "https://design.ui.com/projects/default/plans/default", note: "Floor plan" },
  { id: "topology", url: "https://design.ui.com/projects/default/topology", note: "Topology" },
  { id: "ports", url: "https://design.ui.com/projects/default/ports", note: "Port map" },
];

function plainCss(theme) {
  const file = path.join(
    root,
    "themes",
    theme.franchiseSlug,
    theme.characterSlug,
    theme.file,
  );
  const css = fs.readFileSync(file, "utf8");
  const map = {
    ...theme.colors,
    "console-host": "192.168.1.1",
    "console-host-2": "192.168.1.1",
    "background-image": `url('${theme.artwork.url}')`,
    "background-dim": String(theme.dim),
    "background-blur": "0px",
    "panel-opacity": String(theme.panel),
    "show-motif": "1",
  };
  const replaced = css.replace(/\/\*\[\[([\w-]+)]]\*\//g, (_, name) => {
    if (!(name in map)) throw new Error(`${theme.id} missing var ${name}`);
    return map[name];
  });
  if (replaced.includes("/*[[")) throw new Error(`${theme.id} unresolved var`);
  return replaced.replace(/@-moz-document[^{]*\{/, "").replace(/\}\s*$/, "");
}

async function settle(page) {
  await page.waitForSelector("header", { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    document.querySelectorAll("#onetrust-consent-sdk, .onetrust-pc-dark-filter").forEach((node) => node.remove());
  });
}

async function applyTheme(page, theme) {
  await page.evaluate((scheme) => {
    document.documentElement.setAttribute("data-theme", scheme);
    document.querySelectorAll("[data-uids]").forEach((node) => node.setAttribute("data-theme", scheme));
  }, theme.scheme);
  await page.addStyleTag({ content: plainCss(theme) });
  await page.waitForTimeout(400);
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.setDefaultTimeout(45000);
await page.route("**/*", async (route) => {
  const response = await route.fetch();
  const headers = { ...response.headers() };
  delete headers["content-security-policy"];
  delete headers["content-security-policy-report-only"];
  await route.fulfill({ response, headers });
});
fs.mkdirSync(shotDir, { recursive: true });

const onlyTheme = process.env.THEME;
const onlyPage = process.env.PAGE;

for (const view of pages) {
  if (onlyPage && view.id !== onlyPage) continue;
  await page.goto(view.url, { waitUntil: "networkidle" });
  await settle(page);
  const stockPath = path.join(shotDir, `stock-${view.id}.png`);
  await page.screenshot({ path: stockPath });
  console.log("stock", view.id);

  if (view.id === "rack") {
    const fixture = await page.evaluate(() => {
      const styles = [];
      const walk = (list) => {
        for (const rule of list) {
          const text = rule.cssText || "";
          if (text.includes("--color-neutral-00:") || text.includes("--desktop-color-neutral-00")) styles.push(text);
          if (rule.cssRules) walk(rule.cssRules);
        }
      };
      for (const sheet of document.styleSheets) {
        try { walk(sheet.cssRules); } catch { /* cross-origin */ }
      }
      const cs = getComputedStyle(document.documentElement);
      const interesting = ["--color-neutral-00", "--color-neutral-12", "--color-ublue-06", "--color-text-1", "--color-depth-bg-0"];
      const computed = {};
      for (const name of interesting) computed[name] = cs.getPropertyValue(name).trim();
      return {
        href: location.href,
        title: document.title,
        html: document.documentElement.outerHTML.slice(0, 200000),
        computed,
        styleBytes: styles.join("\n").length,
        styles: styles.join("\n").slice(0, 400000),
      };
    });
    fs.writeFileSync(path.join(rawDir, "design-center-root.css"), fixture.styles);
    fs.writeFileSync(path.join(rawDir, "design-center-dom-head.html"), fixture.html);
    fs.writeFileSync(path.join(rawDir, "computed-sample.json"), JSON.stringify(fixture.computed, null, 2));
    console.log("fixtures", fixture.computed);
  }

  for (const theme of themes) {
    if (onlyTheme && theme.id !== onlyTheme) continue;
    await page.goto(view.url, { waitUntil: "networkidle" });
    await settle(page);
    await applyTheme(page, theme);
    const themedPath = path.join(shotDir, `${theme.id}-${view.id}.png`);
    await page.screenshot({ path: themedPath });
    console.log("themed", theme.id, view.id);
    if (view.id === "rack") {
      const preview = path.join(root, "themes", theme.franchiseSlug, theme.characterSlug, "preview");
      fs.mkdirSync(preview, { recursive: true });
      fs.copyFileSync(stockPath, path.join(preview, "dashboard-stock.png"));
      fs.copyFileSync(themedPath, path.join(preview, `dashboard-${theme.id}.png`));
    }
  }
}

await browser.close();
console.log("screenshots in", shotDir);
