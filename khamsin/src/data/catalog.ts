/**
 * KHAMSIN catalogue.
 *
 * Single source of truth for everything merchandised on the page. Swap the
 * contents here and the whole storefront re-merchandises itself — nothing
 * downstream hardcodes a product name, price or category.
 */

import type { Silhouette } from "@/components/silhouettes";

export type Category = "Outerwear" | "Shirting" | "Trousers" | "Knitwear" | "Essentials";

export type Colorway = {
  /** Display name, e.g. "Undyed". */
  name: string;
  /** Base tint used by the procedural art director in <Media />. */
  tint: string;
  /** Swatch chip colour — usually the same, occasionally lightened. */
  chip: string;
};

export type SizeOption = {
  label: string;
  /** false renders the size as sold out and blocks add-to-bag. */
  inStock: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  /** Which drawn garment represents this piece. */
  silhouette: Silhouette;
  /** Cents, so no floating-point money anywhere. */
  price: number;
  fabric: string;
  weight: string;
  origin: string;
  /** One tight paragraph — this is the only long copy on a product. */
  description: string;
  notes: string[];
  colors: Colorway[];
  sizes: SizeOption[];
  /** Optional editorial flag rendered as a corner tag. */
  tag?: string;
};

export const CATEGORIES: Array<Category | "All"> = [
  "All",
  "Outerwear",
  "Shirting",
  "Trousers",
  "Knitwear",
  "Essentials",
];

const SIZES_APPAREL: SizeOption[] = [
  { label: "XS", inStock: true },
  { label: "S", inStock: true },
  { label: "M", inStock: true },
  { label: "L", inStock: true },
  { label: "XL", inStock: false },
];

export const PRODUCTS: Product[] = [
  {
    id: "field-overshirt",
    name: "Field Overshirt",
    category: "Outerwear",
    silhouette: "overshirt",
    price: 21500,
    fabric: "9oz washed cotton canvas",
    weight: "Midweight",
    origin: "Cut and sewn in Cairo",
    description:
      "The piece we build every season around. Boxy through the body, dropped at the shoulder, and washed twice so it hangs the day you open the box rather than six months later.",
    notes: ["Corozo buttons", "Double-needle side seams", "Patch pockets, bar-tacked"],
    colors: [
      { name: "Undyed", tint: "#d8cdb8", chip: "#ded4c1" },
      { name: "Clay", tint: "#a8613c", chip: "#a8613c" },
      { name: "Ink", tint: "#232019", chip: "#232019" },
    ],
    sizes: SIZES_APPAREL,
    tag: "Signature",
  },
  {
    id: "khamsin-chore",
    name: "Khamsin Chore Coat",
    category: "Outerwear",
    silhouette: "coat",
    price: 28500,
    fabric: "Undyed heavy linen",
    weight: "Heavyweight",
    origin: "Woven in Fayoum",
    description:
      "Named for the wind that arrives every spring and rearranges the city. Three pockets, a collar that stands when you turn it up, and linen thick enough to hold its own shape.",
    notes: ["Undyed, unbleached", "Reinforced elbow", "Softens with every wash"],
    colors: [
      { name: "Raw", tint: "#cfc3ab", chip: "#d7ccb6" },
      { name: "Olive", tint: "#55584a", chip: "#55584a" },
    ],
    sizes: SIZES_APPAREL,
  },
  {
    id: "dune-shirt",
    name: "Dune Shirt",
    category: "Shirting",
    silhouette: "shirt",
    price: 14500,
    fabric: "Slub linen",
    weight: "Lightweight",
    origin: "Woven in Fayoum",
    description:
      "An open-weave linen shirt with a soft, unstructured collar. Cut long enough to wear out, clean enough to tuck. The slub is deliberate — no two panels read the same.",
    notes: ["Single chest pocket", "Mother-of-pearl buttons", "Split side hem"],
    colors: [
      { name: "Bone", tint: "#e7dfd1", chip: "#e7dfd1" },
      { name: "Sable", tint: "#8c7a63", chip: "#8c7a63" },
      { name: "Indigo", tint: "#39434f", chip: "#39434f" },
    ],
    sizes: SIZES_APPAREL,
  },
  {
    id: "atlas-poplin",
    name: "Atlas Poplin Shirt",
    category: "Shirting",
    silhouette: "shirt",
    price: 13000,
    fabric: "Long-staple cotton poplin",
    weight: "Lightweight",
    origin: "Cut and sewn in Cairo",
    description:
      "The quiet one. Fine Giza poplin with a crisp hand that relaxes by the second wear, finished with a low, soft-rolled collar that sits properly under a coat.",
    notes: ["Giza 87 cotton", "22-stitch-per-inch seams", "Curved hem"],
    colors: [
      { name: "White", tint: "#f2efe9", chip: "#f2efe9" },
      { name: "Ash", tint: "#9a9184", chip: "#9a9184" },
    ],
    sizes: SIZES_APPAREL,
  },
  {
    id: "wadi-trouser",
    name: "Wadi Trouser",
    category: "Trousers",
    silhouette: "trousers",
    price: 17500,
    fabric: "Linen-cotton twill",
    weight: "Midweight",
    origin: "Cut and sewn in Cairo",
    description:
      "A straight-leg trouser with a single forward pleat, sitting at the natural waist. Enough drape to move, enough body to keep its line through a long day.",
    notes: ["Single pleat", "Extended tab closure", "Unfinished hem for tailoring"],
    colors: [
      { name: "Stone", tint: "#c4b8a3", chip: "#c4b8a3" },
      { name: "Ink", tint: "#232019", chip: "#232019" },
      { name: "Olive", tint: "#55584a", chip: "#55584a" },
    ],
    sizes: [
      { label: "28", inStock: true },
      { label: "30", inStock: true },
      { label: "32", inStock: true },
      { label: "34", inStock: true },
      { label: "36", inStock: false },
    ],
  },
  {
    id: "drift-trouser",
    name: "Drift Wide Trouser",
    category: "Trousers",
    silhouette: "trousers",
    price: 16500,
    fabric: "Garment-dyed linen",
    weight: "Lightweight",
    origin: "Woven in Fayoum",
    description:
      "Wide through the leg, dyed after making so the colour settles unevenly into the seams. The pair you reach for when it is too hot to think about clothes.",
    notes: ["Drawcord waist", "Garment-dyed in small lots", "Side seam pockets"],
    colors: [
      { name: "Sand", tint: "#d6cbb8", chip: "#d6cbb8" },
      { name: "Clay", tint: "#a8613c", chip: "#a8613c" },
    ],
    sizes: [
      { label: "28", inStock: true },
      { label: "30", inStock: true },
      { label: "32", inStock: false },
      { label: "34", inStock: true },
      { label: "36", inStock: true },
    ],
  },
  {
    id: "sirocco-knit",
    name: "Sirocco Knit",
    category: "Knitwear",
    silhouette: "knit",
    price: 19500,
    fabric: "Undyed merino",
    weight: "Midweight",
    origin: "Knitted in Porto",
    description:
      "A dense crewneck knitted from undyed merino in three natural shades — the colour is the sheep, not the dye house. Ribbed at the cuff, slightly cropped at the body.",
    notes: ["Fully fashioned", "Undyed merino", "Mothproof storage bag included"],
    colors: [
      { name: "Oatmeal", tint: "#d3c8b4", chip: "#d3c8b4" },
      { name: "Fog", tint: "#a7a49c", chip: "#a7a49c" },
      { name: "Peat", tint: "#4a4038", chip: "#4a4038" },
    ],
    sizes: SIZES_APPAREL,
    tag: "New",
  },
  {
    id: "bone-crewneck",
    name: "Bone Crewneck",
    category: "Knitwear",
    silhouette: "knit",
    price: 15500,
    fabric: "Organic loopback cotton",
    weight: "Heavyweight",
    origin: "Cut and sewn in Cairo",
    description:
      "A 420gsm loopback sweat with a proper V-insert at the neck. Heavy enough to stand on its own through winter, plain enough to disappear under a coat.",
    notes: ["420gsm loopback", "Ribbed V-insert", "Pre-shrunk"],
    colors: [
      { name: "Bone", tint: "#e7dfd1", chip: "#e7dfd1" },
      { name: "Graphite", tint: "#3a362f", chip: "#3a362f" },
    ],
    sizes: SIZES_APPAREL,
  },
  {
    id: "salt-tee",
    name: "Salt Tee",
    category: "Essentials",
    silhouette: "tee",
    price: 6500,
    fabric: "Heavyweight jersey",
    weight: "Heavyweight",
    origin: "Cut and sewn in Cairo",
    description:
      "240gsm jersey knitted on vintage loopwheel machines, so the tube has no side seam and the body does not twist in the wash. Boxy, high-necked, honest.",
    notes: ["Loopwheeled, seamless body", "Twin-needle hem", "Three-year seam warranty"],
    colors: [
      { name: "Salt", tint: "#efece5", chip: "#efece5" },
      { name: "Sand", tint: "#d6cbb8", chip: "#d6cbb8" },
      { name: "Ink", tint: "#232019", chip: "#232019" },
    ],
    sizes: SIZES_APPAREL,
  },
  {
    id: "ash-tank",
    name: "Ash Tank",
    category: "Essentials",
    silhouette: "tank",
    price: 5500,
    fabric: "Ribbed organic cotton",
    weight: "Lightweight",
    origin: "Cut and sewn in Cairo",
    description:
      "A fine 2x1 rib that holds the body without gripping it. Cut a touch longer than it needs to be, because the alternative is worse.",
    notes: ["2x1 rib", "Bound neck and arm", "Sold in twos at a discount"],
    colors: [
      { name: "Ash", tint: "#9a9184", chip: "#9a9184" },
      { name: "Salt", tint: "#efece5", chip: "#efece5" },
    ],
    sizes: SIZES_APPAREL,
  },
  {
    id: "nomad-scarf",
    name: "Nomad Scarf",
    category: "Essentials",
    silhouette: "scarf",
    price: 8500,
    fabric: "Handwoven cotton gauze",
    weight: "Featherweight",
    origin: "Handwoven in Akhmim",
    description:
      "Two metres of open cotton gauze, woven on a hand loom in Akhmim and finished with a hand-knotted fringe. Sun cover in July, a second layer in January.",
    notes: ["200 x 70cm", "Hand-knotted fringe", "Every piece slightly different"],
    colors: [
      { name: "Raw", tint: "#ddd2bd", chip: "#ddd2bd" },
      { name: "Clay", tint: "#a8613c", chip: "#a8613c" },
      { name: "Indigo", tint: "#39434f", chip: "#39434f" },
    ],
    sizes: [{ label: "One size", inStock: true }],
  },
  {
    id: "cairo-cap",
    name: "Cairo Cap",
    category: "Essentials",
    silhouette: "cap",
    price: 7000,
    fabric: "Washed canvas",
    weight: "Midweight",
    origin: "Cut and sewn in Cairo",
    description:
      "Six panels of the same canvas as the Field Overshirt, unstructured so it packs flat, with a soft brim that takes a curve and keeps it.",
    notes: ["Unstructured crown", "Cotton sweatband", "Brass adjuster"],
    colors: [
      { name: "Undyed", tint: "#d8cdb8", chip: "#ded4c1" },
      { name: "Olive", tint: "#55584a", chip: "#55584a" },
    ],
    sizes: [
      { label: "S/M", inStock: true },
      { label: "L/XL", inStock: true },
    ],
  },
];

export const LOOKBOOK = [
  { id: "lb-01", silhouette: "overshirt" as Silhouette, title: "First light, Sahara road", caption: "Field Overshirt / Wadi Trouser", tint: "#c9b99e" },
  { id: "lb-02", silhouette: "trousers" as Silhouette, title: "Studio, Garden City", caption: "Atlas Poplin / Drift Trouser", tint: "#8f8577" },
  { id: "lb-03", silhouette: "coat" as Silhouette, title: "The Fayoum loom", caption: "Khamsin Chore Coat", tint: "#a8613c" },
  { id: "lb-04", silhouette: "tee" as Silhouette, title: "Rooftop, late April", caption: "Dune Shirt / Salt Tee", tint: "#5f6656" },
  { id: "lb-05", silhouette: "scarf" as Silhouette, title: "Wind from the south", caption: "Nomad Scarf", tint: "#3b3a33" },
  { id: "lb-06", silhouette: "knit" as Silhouette, title: "Last light, Maadi", caption: "Sirocco Knit", tint: "#b9ab92" },
];

export const CRAFT_STEPS = [
  {
    index: "01",
    title: "Fibre first",
    body: "We buy Egyptian long-staple cotton and Fayoum flax direct from two cooperatives we have worked with since the first season. No brokers, no blends we cannot name on the label.",
  },
  {
    index: "02",
    title: "One pattern, many years",
    body: "A pattern earns its place by lasting. We revise fit rather than replace it, so the overshirt you buy this spring is the same block as the one from four seasons ago — only better resolved.",
  },
  {
    index: "03",
    title: "Small runs, no landfill",
    body: "Every style is made in runs of 300 or fewer. Anything unsold at the end of a season is repaired, re-dyed and sold as Second Wind — never destroyed, never discounted into meaninglessness.",
  },
];

export const JOURNAL = [
  {
    id: "j1",
    date: "12 March",
    kind: "Field notes",
    title: "What the khamsin actually does to a city",
    excerpt:
      "Fifty days of wind out of the Sahara, and the whole calendar of how people dress here bends around it.",
    tint: "#b8a68a",
  },
  {
    id: "j2",
    date: "04 February",
    kind: "Process",
    title: "Why we stopped bleaching linen",
    excerpt:
      "Undyed flax has a colour range of its own. It took two seasons of arguing with the mill to keep it.",
    tint: "#7d8171",
  },
  {
    id: "j3",
    date: "19 January",
    kind: "People",
    title: "Nine looms in Akhmim",
    excerpt:
      "The workshop that makes our gauze scarves has been running since 1954. We spent a week watching.",
    tint: "#9c6b4e",
  },
];

export const STATS = [
  { value: "300", label: "Pieces per run, maximum" },
  { value: "2", label: "Cooperatives, no brokers" },
  { value: "3yr", label: "Free repairs on every seam" },
];
