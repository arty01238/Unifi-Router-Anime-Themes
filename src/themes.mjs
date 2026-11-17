/**
 * Per-character palettes and original CSS motifs.
 *
 * Colors are original interpretations of publicly visible costume colors.
 * They are not official brand guides. Motifs are geometric CSS only.
 *
 * Add a character by appending an object and running `npm run build`.
 * See the Contributing section in the root README.
 */

export const version = "1.0.0";

export const repo = "arty01238/Unifi-Router-Anime-Themes";

/**
 * Remote official portraits. The files are not committed.
 * Each URL was checked to return HTTP 200 with Content-Type image/png,
 * including when the request Referer is https://unifi.ui.com/.
 */
const artwork = {
  ellen: {
    url: "https://fastcdn.hoyoverse.com/content-v2/nap/113671/59a98a82a886f49c3b1b89bdc77cbb36_21606237077173472.png",
    page: "https://zenless.hoyoverse.com/en-us/character?id=113671",
    credit:
      "Full-body portrait from the official Zenless Zone Zero character page (HoYoverse CDN, asset new-chara-cover-inner). The image stays on HoYoverse's servers.",
  },
  jane: {
    url: "https://fastcdn.hoyoverse.com/content-v2/nap/124675/be75dc37b5f356bdebc358fa21b7086a_5376265045261362106.png",
    page: "https://zenless.hoyoverse.com/en-us/character?id=124675",
    credit:
      "Full-body portrait from the official Zenless Zone Zero character page (HoYoverse CDN, asset new-chara-cover-inner). The image stays on HoYoverse's servers.",
  },
  madoka: {
    url: "https://www.madoka-magica.com/tv/assets/img/character/chara_img_madoka02.png",
    page: "https://www.madoka-magica.com/tv/character/",
    credit:
      "Magical-girl turnaround (chara_img_madoka02.png) from the official Madoka Magica TV Edition character page. The image stays on madoka-magica.com. Both the light and dark themes use this same portrait.",
  },
  homura: {
    url: "https://www.madoka-magica.com/tv/assets/img/character/chara_img_homura02.png",
    page: "https://www.madoka-magica.com/tv/character/",
    credit:
      "Magical-girl turnaround (chara_img_homura02.png) from the official Madoka Magica TV Edition character page. The image stays on madoka-magica.com.",
  },
};

/** @typedef {'teeth' | 'pinstripe' | 'petals' | 'clock'} MotifId */

/**
 * @type {Array<{
 *   id: string,
 *   file: string,
 *   name: string,
 *   variantLabel: string,
 *   franchise: string,
 *   franchiseSlug: string,
 *   characterSlug: string,
 *   characterTitle: string,
 *   scheme: 'dark' | 'light',
 *   description: string,
 *   summary: string,
 *   motifId: MotifId,
 *   motifName: string,
 *   motifNote: string,
 *   colors: Record<string, string>,
 *   dim: number,
 *   panel: number,
 *   wallpaper: string[],
 *   edge: string,
 * }>}
 */
export const themes = [
  {
    id: "ellen-joe",
    file: "ellen-joe.user.css",
    name: "Ellen Joe — UniFi OS",
    variantLabel: "",
    franchise: "Zenless Zone Zero",
    franchiseSlug: "zenless-zone-zero",
    characterSlug: "ellen-joe",
    characterTitle: "Ellen Joe",
    scheme: "dark",
    artwork: artwork.ellen,
    description:
      "Dark navy and black UniFi OS theme with red-pink and white sawtooth accents, inspired by Ellen Joe. Browser-only. Unofficial fan work; does not modify the router.",
    summary:
      "Night-ocean navy and black, a cold red slash, and a sawtooth edge. Sharp and a little toothy.",
    motifId: "teeth",
    motifName: "Sawtooth edge",
    motifNote:
      "A repeating red and white zigzag sits on the top edge of the viewport. The wallpaper is a navy gradient cut by one sharp red diagonal. Both are plain CSS gradients, not character art.",
    colors: {
      background: "#070B14",
      "background-2": "#102033",
      surface: "#10192A",
      "surface-raised": "#1A2740",
      border: "#31445F",
      text: "#F5F7FB",
      "text-muted": "#A3B0C4",
      accent: "#FF3D6E",
      "accent-2": "#FFB3C4",
      highlight: "#F7F7F5",
      "on-accent": "#2A0A14",
      "dim-color": "#000000",
    },
    dim: 0.28,
    panel: 0.86,
    wallpaper: [
      "linear-gradient(112deg, transparent 0 44%, color-mix(in srgb, /*[[accent]]*/ 34%, transparent) 44% 44.45%, transparent 44.45% 68%, color-mix(in srgb, /*[[highlight]]*/ 16%, transparent) 68% 68.28%, transparent 68.28%)",
      "radial-gradient(circle at 100% 100%, color-mix(in srgb, /*[[accent]]*/ 22%, transparent), transparent 42%)",
    ],
    edge: `top: 0;
  right: 0;
  left: 0;
  height: 14px;
  background-image:
    linear-gradient(135deg, /*[[accent]]*/ 50%, transparent 50%),
    linear-gradient(45deg, /*[[highlight]]*/ 50%, transparent 50%);
  background-size: 14px 14px, 14px 14px;
  background-position: 0 0, 7px 0;
  background-repeat: repeat-x, repeat-x;`,
  },
  {
    id: "jane-doe",
    file: "jane-doe.user.css",
    name: "Jane Doe — UniFi OS",
    variantLabel: "",
    franchise: "Zenless Zone Zero",
    franchiseSlug: "zenless-zone-zero",
    characterSlug: "jane-doe",
    characterTitle: "Jane Doe",
    scheme: "dark",
    artwork: artwork.jane,
    description:
      "Charcoal and purple UniFi OS theme with violet, gold, and pink accents, inspired by Jane Doe. Browser-only. Unofficial fan work; does not modify the router.",
    summary:
      "Charcoal purple, a gold hairline, and a pink glint. Sleek night-market lighting, not a cute pastel.",
    motifId: "pinstripe",
    motifName: "Gold pinstripe",
    motifNote:
      "A thin violet-gold-pink bar runs along the top. The wallpaper is a charcoal field with a faint gold diagonal pinstripe and a violet corner glow. Geometric only.",
    colors: {
      background: "#100E14",
      "background-2": "#1C1426",
      surface: "#1A1522",
      "surface-raised": "#2A2236",
      border: "#4C3E62",
      text: "#F7F3EC",
      "text-muted": "#B7A9C6",
      accent: "#B07CFF",
      "accent-2": "#E2B657",
      highlight: "#FF7AB6",
      "on-accent": "#1A1024",
      "dim-color": "#000000",
    },
    dim: 0.3,
    panel: 0.86,
    wallpaper: [
      "repeating-linear-gradient(135deg, transparent 0 22px, color-mix(in srgb, /*[[accent-2]]*/ 28%, transparent) 22px 23px)",
      "radial-gradient(ellipse at 0% 100%, color-mix(in srgb, /*[[accent]]*/ 32%, transparent), transparent 48%)",
      "radial-gradient(ellipse at 100% 0%, color-mix(in srgb, /*[[highlight]]*/ 18%, transparent), transparent 36%)",
    ],
    edge: `top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background-image: linear-gradient(90deg, /*[[accent]]*/, /*[[accent-2]]*/, /*[[highlight]]*/, /*[[accent-2]]*/, /*[[accent]]*/);
  box-shadow: 0 0 18px color-mix(in srgb, /*[[accent]]*/ 65%, transparent);`,
  },
  {
    id: "madoka-kaname-light",
    file: "madoka-kaname-light.user.css",
    name: "Madoka Kaname (Light) — UniFi OS",
    variantLabel: "Light",
    franchise: "Puella Magi Madoka Magica",
    franchiseSlug: "madoka-magica",
    characterSlug: "madoka-kaname",
    characterTitle: "Madoka Kaname",
    scheme: "light",
    artwork: artwork.madoka,
    description:
      "Soft pink, white, and light-gold UniFi OS theme with a ribbon and petal edge, inspired by Madoka Kaname. Light variant. Browser-only. Unofficial fan work; does not modify the router.",
    summary:
      "Airy pink, white panels, and a light gold ribbon. Pair it with UniFi's built-in Light appearance.",
    motifId: "petals",
    motifName: "Petals and ribbon",
    motifNote:
      "A scalloped pink edge runs across the top. The corner holds a cluster of plain circles (a generic flower) and two ellipse strokes that read as a ribbon bow. This is not the soul gem, the series logo, or any official illustration.",
    colors: {
      background: "#FFF6F9",
      "background-2": "#FFE0EC",
      surface: "#FFFFFF",
      "surface-raised": "#FFF0F6",
      border: "#F0C3D4",
      text: "#4C2434",
      "text-muted": "#8E5A6C",
      accent: "#F06292",
      "accent-2": "#D7A441",
      highlight: "#FFFDF8",
      "on-accent": "#3F1826",
      "dim-color": "#6A3044",
    },
    dim: 0.06,
    panel: 0.94,
    wallpaper: [
      "radial-gradient(circle at 9% 86%, color-mix(in srgb, /*[[accent]]*/ 55%, transparent) 0 22px, transparent 23px)",
      "radial-gradient(circle at 14% 78%, color-mix(in srgb, /*[[accent]]*/ 40%, transparent) 0 30px, transparent 31px)",
      "radial-gradient(circle at 4% 76%, color-mix(in srgb, /*[[accent-2]]*/ 70%, transparent) 0 16px, transparent 17px)",
      "radial-gradient(circle at 18% 90%, color-mix(in srgb, /*[[accent]]*/ 35%, transparent) 0 18px, transparent 19px)",
      "radial-gradient(ellipse 120px 36px at 20% 82%, transparent 58%, color-mix(in srgb, /*[[accent-2]]*/ 80%, transparent) 60% 68%, transparent 70%)",
      "radial-gradient(ellipse 120px 36px at 1% 82%, transparent 58%, color-mix(in srgb, /*[[accent]]*/ 55%, transparent) 60% 68%, transparent 70%)",
    ],
    edge: `top: 0;
  right: 0;
  left: 0;
  height: 18px;
  background-image: radial-gradient(circle at 14px 18px, /*[[accent]]*/ 9px, transparent 10px);
  background-size: 32px 18px;
  background-repeat: repeat-x;`,
  },
  {
    id: "madoka-kaname-dark",
    file: "madoka-kaname-dark.user.css",
    name: "Madoka Kaname (Dark) — UniFi OS",
    variantLabel: "Dark",
    franchise: "Puella Magi Madoka Magica",
    franchiseSlug: "madoka-magica",
    characterSlug: "madoka-kaname",
    characterTitle: "Madoka Kaname",
    scheme: "dark",
    artwork: artwork.madoka,
    description:
      "Rose-black UniFi OS theme with pink, white, and gold ribbon accents, inspired by Madoka Kaname. Dark variant. Browser-only. Unofficial fan work; does not modify the router.",
    summary:
      "The same ribbon and petal motif on a rose-black field. Pair it with UniFi's built-in Dark appearance.",
    motifId: "petals",
    motifName: "Petals and ribbon",
    motifNote:
      "Same original petal scallop and ribbon ellipses as the light variant, recolored for a dark console. Not official artwork.",
    colors: {
      background: "#160C12",
      "background-2": "#2C1520",
      surface: "#2A1520",
      "surface-raised": "#3C2030",
      border: "#6E4456",
      text: "#FFE9F1",
      "text-muted": "#D2A8B8",
      accent: "#FF8FB7",
      "accent-2": "#E6C27A",
      highlight: "#FFF4E4",
      "on-accent": "#2A1018",
      "dim-color": "#000000",
    },
    dim: 0.32,
    panel: 0.88,
    wallpaper: [
      "radial-gradient(circle at 9% 86%, color-mix(in srgb, /*[[accent]]*/ 50%, transparent) 0 22px, transparent 23px)",
      "radial-gradient(circle at 14% 78%, color-mix(in srgb, /*[[accent]]*/ 34%, transparent) 0 30px, transparent 31px)",
      "radial-gradient(circle at 4% 76%, color-mix(in srgb, /*[[accent-2]]*/ 65%, transparent) 0 16px, transparent 17px)",
      "radial-gradient(circle at 18% 90%, color-mix(in srgb, /*[[highlight]]*/ 30%, transparent) 0 18px, transparent 19px)",
      "radial-gradient(ellipse 120px 36px at 20% 82%, transparent 58%, color-mix(in srgb, /*[[accent-2]]*/ 75%, transparent) 60% 68%, transparent 70%)",
      "radial-gradient(ellipse 120px 36px at 1% 82%, transparent 58%, color-mix(in srgb, /*[[accent]]*/ 50%, transparent) 60% 68%, transparent 70%)",
    ],
    edge: `top: 0;
  right: 0;
  left: 0;
  height: 18px;
  background-image: radial-gradient(circle at 14px 18px, /*[[accent]]*/ 9px, transparent 10px);
  background-size: 32px 18px;
  background-repeat: repeat-x;`,
  },
  {
    id: "homura-akemi",
    file: "homura-akemi.user.css",
    name: "Homura Akemi — UniFi OS",
    variantLabel: "",
    franchise: "Puella Magi Madoka Magica",
    franchiseSlug: "madoka-magica",
    characterSlug: "homura-akemi",
    characterTitle: "Homura Akemi",
    scheme: "dark",
    artwork: artwork.homura,
    description:
      "Deep purple and black UniFi OS theme with violet and silver clock marks, inspired by Homura Akemi. Browser-only. Unofficial fan work; does not modify the router.",
    summary:
      "Black-violet panels, silver tick marks, and a partial clock face in the corner. Time, without copying the shield.",
    motifId: "clock",
    motifName: "Clock arc",
    motifNote:
      "The top edge is a violet hairline over silver ruler ticks. The lower-right wallpaper is a generic clock: a conic tick ring and two circles. It is not Homura's shield and not a series symbol.",
    colors: {
      background: "#09070F",
      "background-2": "#161226",
      surface: "#141022",
      "surface-raised": "#221C34",
      border: "#3C3458",
      text: "#ECEAF4",
      "text-muted": "#A79FBE",
      accent: "#7E66FF",
      "accent-2": "#C8CDD8",
      highlight: "#D9D0FF",
      "on-accent": "#140C22",
      "dim-color": "#000000",
    },
    dim: 0.34,
    panel: 0.88,
    wallpaper: [
      "repeating-conic-gradient(from -1deg at 92% 112%, color-mix(in srgb, /*[[accent-2]]*/ 70%, transparent) 0 0.65deg, transparent 0.65deg 30deg)",
      "radial-gradient(circle at 92% 112%, transparent 0 168px, color-mix(in srgb, /*[[accent-2]]*/ 55%, transparent) 169px 171px, transparent 172px 214px, color-mix(in srgb, /*[[accent]]*/ 45%, transparent) 215px 217px, transparent 218px)",
    ],
    edge: `top: 0;
  right: 0;
  left: 0;
  height: 12px;
  background-image:
    linear-gradient(/*[[accent]]*/, /*[[accent]]*/),
    repeating-linear-gradient(90deg, /*[[accent-2]]*/ 0 1px, transparent 1px 16px);
  background-size: 100% 2px, 100% 9px;
  background-position: top left, bottom left;
  background-repeat: no-repeat, no-repeat;`,
  },
];
