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
import { PNG } from "pngjs";
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

async function revealTopologyText(page) {
  const add = page.getByRole("button", { name: "Add Devices" });
  if (await add.count()) {
    await add.first().click().catch(() => {});
    await page.waitForTimeout(700);
  }
  const wifi = page.getByText("WiFi", { exact: true }).first();
  if (await wifi.count()) {
    await wifi.click().catch(() => {});
    await page.waitForTimeout(700);
  }
}

function projectUrl(href, view) {
  const id = href.match(/\/projects\/([^/]+)/)?.[1];
  if (!id || id === "default") return view.url;
  if (view.id === "plans") return `https://design.ui.com/projects/${id}/plans/default`;
  return `https://design.ui.com/projects/${id}/${view.id}`;
}

async function openView(page, view, scheme) {
  let last = "";
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const target = attempt === 0 ? view.url : projectUrl(last, view);
    await boot(page, target, scheme);
    last = page.url();
    if (last.includes(`/${view.id}`)) return;
  }
  throw new Error(`${view.id} landed on ${last}`);
}

async function boot(page, url, scheme) {
  let actual = "";
  for (let attempt = 0; attempt < 6 && actual !== scheme; attempt += 1) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
    if (!page.url().includes("design.ui.com")) {
      console.log("boot left Design Center", page.url());
      await page.waitForTimeout(3000 + attempt * 2000);
      continue;
    }
    await page.evaluate((next) => {
      localStorage.setItem("motif", JSON.stringify(next));
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const user = JSON.parse(raw);
          if (user && typeof user === "object") {
            user.motif = next;
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch {
          /* ignore malformed user blob */
        }
      }
    }, scheme);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
    if (!page.url().includes("design.ui.com")) {
      await page.waitForTimeout(3000 + attempt * 2000);
      continue;
    }
    await settle(page);
    actual = await page.evaluate(() => document.body.getAttribute("data-theme") || "");
    if (actual === scheme) break;
    await page.waitForTimeout(1500);
  }
  if (actual !== scheme) {
    const detail = await page.evaluate(() => ({
      title: document.title,
      theme: document.body.getAttribute("data-theme"),
      scheme: getComputedStyle(document.body).colorScheme,
      motif: localStorage.getItem("motif"),
      text: document.body.innerText.slice(0, 240),
    }));
    throw new Error(`Design Center stayed in ${actual || "unset"} after motif=${scheme} ${JSON.stringify(detail)}`);
  }
}

function parseRgb(value) {
  const match = String(value).match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).map(Number);
  if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
}

function composite(front, back) {
  const a = front.a ?? 1;
  return {
    r: front.r * a + back.r * (1 - a),
    g: front.g * a + back.g * (1 - a),
    b: front.b * a + back.b * (1 - a),
    a: 1,
  };
}

function relLuminance({ r, g, b }) {
  const channel = (value) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relLuminance(foreground), relLuminance(background));
  const darker = Math.min(relLuminance(foreground), relLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

async function assertContrast(page, label) {
  const report = await page.evaluate(() => {
    function parseRgb(value) {
      const match = String(value).match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const parts = match[1].split(/[\s,/]+/).map(Number);
      if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) return null;
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    }
    function composite(front, back) {
      const a = front.a ?? 1;
      return {
        r: front.r * a + back.r * (1 - a),
        g: front.g * a + back.g * (1 - a),
        b: front.b * a + back.b * (1 - a),
        a: 1,
      };
    }
    function backgroundOf(el) {
      const layers = [];
      let node = el;
      while (node) {
        const parsed = parseRgb(getComputedStyle(node).backgroundColor);
        if (parsed && parsed.a > 0.02) layers.push(parsed);
        if (parsed && parsed.a >= 0.98) break;
        node = node.parentElement;
      }
      const root = parseRgb(getComputedStyle(document.documentElement).backgroundColor);
      let acc = root && root.a > 0.5 ? { r: root.r, g: root.g, b: root.b, a: 1 } : { r: 7, g: 11, b: 20, a: 1 };
      for (const layer of layers.reverse()) acc = composite(layer, acc);
      return acc;
    }
    const samples = [];
    const seen = new Set();
    for (const el of document.querySelectorAll("body *")) {
      if (samples.length >= 80) break;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.4) continue;
      if (el.closest("svg, #onetrust-consent-sdk")) continue;
      const text = [...el.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join("").replace(/\s+/g, " ").trim();
      if (text.length < 2) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) continue;
      if (el.closest("[aria-hidden='true'], [hidden]")) continue;
      const key = `${text.slice(0, 40)}@${Math.round(rect.x)}:${Math.round(rect.y)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const fill = parseRgb(style.color);
      if (!fill || fill.a < 0.5) continue;
      const parents = [];
      let parent = el.parentElement;
      for (let depth = 0; depth < 6 && parent; depth += 1) {
        parents.push(String(parent.className).replace(/__[A-Za-z0-9_-]+/g, "").slice(0, 48));
        parent = parent.parentElement;
      }
      samples.push({
        text: text.slice(0, 60),
        tag: el.tagName,
        className: String(el.className).slice(0, 80),
        parents: parents.join(" < "),
        color: style.color,
        background: style.backgroundColor,
        fill,
        back: backgroundOf(el),
      });
    }
    return samples;
  });
  if (report.length < 30) {
    throw new Error(`${label}: only ${report.length} text samples (need 30) at ${page.url()}`);
  }
    const failures = [];
  const content = report.filter((sample) => {
    const spread = Math.max(sample.back.r, sample.back.g, sample.back.b) - Math.min(sample.back.r, sample.back.g, sample.back.b);
    /* Short labels on saturated chips (stock HQ/LQ pills) are not body copy.
       Longer text on a saturated surface, such as a hint, still has to clear 4.5. */
    return spread < 70 || sample.text.length >= 12;
  });
  if (content.length < 30) {
    throw new Error(`${label}: only ${content.length} content text samples (need 30)`);
  }
  for (const sample of content) {
    const ratio = contrastRatio(sample.fill, sample.back);
    if (ratio < 4.5) {
      failures.push(`${ratio.toFixed(2)} "${sample.text}" ${sample.color} on ${JSON.stringify(sample.back)} <${sample.tag} ${sample.className}> ${sample.parents}`);
    }
  }
  if (failures.length) {
    throw new Error(`${label}: ${failures.length} text nodes below 4.5 contrast\n${failures.slice(0, 12).join("\n")}`);
  }
  console.log(`contrast ok ${label} (${report.length} samples)`);
}

function assertPortrait(file, label) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const x0 = Math.max(0, png.width - 480);
  const y0 = Math.max(0, png.height - 460);
  const x1 = png.width - 24;
  const y1 = png.height - 24;
  const lums = [];
  for (let y = y0; y < y1; y += 3) {
    for (let x = x0; x < x1; x += 3) {
      const index = (png.width * y + x) << 2;
      const r = png.data[index];
      const g = png.data[index + 1];
      const b = png.data[index + 2];
      lums.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }
  }
  const mean = lums.reduce((sum, value) => sum + value, 0) / lums.length;
  const variance = lums.reduce((sum, value) => sum + (value - mean) ** 2, 0) / lums.length;
  const std = Math.sqrt(variance);
  if (std < 18) {
    throw new Error(`${label}: bottom-right looks flat (stddev ${std.toFixed(1)}), portrait not visible`);
  }
  console.log(`portrait ok ${label} (stddev ${std.toFixed(1)})`);
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-blink-features=AutomationControlled"],
});
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});
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
  await openView(page, view, "light");
  if (view.id === "topology") await revealTopologyText(page);
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
    await openView(page, view, theme.scheme);
    await page.addStyleTag({ content: plainCss(theme) });
    await page.evaluate(async () => {
      const declared = getComputedStyle(document.body, "::before").backgroundImage;
      const match = declared.match(/url\(["']?(https:[^"')]+)/);
      if (!match) return;
      await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => reject(new Error(`portrait failed to load ${match[1]}`));
        image.src = match[1];
      });
    });
    await page.waitForTimeout(300);
    if (view.id === "topology") await revealTopologyText(page);
    const themedPath = path.join(shotDir, `${theme.id}-${view.id}.png`);
    await page.screenshot({ path: themedPath });
    await assertContrast(page, `${theme.id} ${view.id}`);
    assertPortrait(themedPath, `${theme.id} ${view.id}`);
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
