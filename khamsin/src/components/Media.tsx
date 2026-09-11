import { useId, useMemo } from "react";

import { SILHOUETTES, type Silhouette } from "@/components/silhouettes";
import { cx, hashString, seededRandom } from "@/lib/format";

/* ==========================================================================
   <Media /> — the art director.

   The house ships with no photography, so every image on this site is drawn:

   • mode="still"  a flat-lay garment illustration, filled with the selected
                   colourway and standing on a neutral ground. Changing the
                   swatch re-tints the garment, so colour is a real signal
                   rather than a decorative dot.
   • mode="field"  an abstract, seeded gradient field for atmosphere panels
                   (hero, craft, journal). Deterministic per seed, so the
                   page looks identical on every reload.

   Real photography drops in later without touching a layout: pass `src` and
   the drawing becomes the fallback underneath it.
   ========================================================================== */

type Ratio = "portrait" | "tall" | "square" | "wide" | "fill";

const RATIO_CLASS: Record<Ratio, string> = {
  portrait: "aspect-[4/5]",
  tall: "aspect-[2/3]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
  fill: "h-full w-full",
};

type MediaProps = {
  seed: string;
  tint: string;
  ratio?: Ratio;
  className?: string;
  /** Draw a garment (still) or an abstract field. */
  silhouette?: Silhouette;
  /** Alternate angle — used for the hover cross-fade. */
  variant?: number;
  /** Optional real photograph; the drawing stays behind it. */
  src?: string;
  alt?: string;
};

/* --- colour helpers ------------------------------------------------------ */

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  const channel = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** amount > 0 lightens toward white, < 0 darkens toward black. */
function shade(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const target = amount > 0 ? 255 : 0;
  const ratio = Math.abs(amount);
  return toHex([r + (target - r) * ratio, g + (target - g) * ratio, b + (target - b) * ratio]);
}

function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  return toHex([r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t]);
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const TRANSITION = "600ms cubic-bezier(0.16, 1, 0.3, 1)";

/* The frame every garment is fitted into, in stage units. */
const FRAME_WIDTH = 540;
const FRAME_HEIGHT = 630;
const FRAME_CX = 400;
const FRAME_CY = 486;

export function Media({
  seed,
  tint,
  ratio = "portrait",
  className,
  silhouette,
  variant = 0,
  src,
  alt,
}: MediaProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const art = useMemo(() => {
    const random = seededRandom(hashString(`${seed}::${variant}`));
    const light = luminance(tint) > 0.5;

    // The ground is a neutral that always contrasts the garment, warmed 20%
    // toward the colourway so the picture reads as one lit scene.
    const neutral = light ? "#a79c8b" : "#e4dbca";
    const ground = mixHex(neutral, tint, 0.2);

    const blobs = Array.from({ length: 3 }, (_, index) => ({
      cx: 100 + random() * 600,
      cy: 100 + random() * 800,
      r: 260 + random() * 220,
      color: index % 2 === 0 ? shade(ground, 0.2) : shade(ground, -0.18),
      opacity: 0.5 + random() * 0.25,
    }));

    // Garments sit slightly off-centre and off-square; alternate angles mirror.
    const tilt = (random() - 0.5) * (silhouette ? 7 : 30);
    const mirrored = variant % 2 === 1;
    const stroke = light ? shade(tint, -0.55) : shade(tint, 0.45);

    return {
      light,
      ground,
      groundTop: shade(ground, 0.17),
      groundBottom: shade(ground, -0.13),
      blobs,
      tilt,
      mirrored,
      stroke,
      fieldShape: Math.floor(random() * 3),
    };
  }, [seed, tint, variant, silhouette]);

  const drawing = silhouette ? SILHOUETTES[silhouette] : null;

  /* Fit the garment's own bounding box into a consistent frame, so a cap, a
     pair of trousers and a coat all read at a comparable weight on the page. */
  const fit = useMemo(() => {
    if (!drawing) return { transform: "", shadowY: 0, shadowRx: 0 };
    const [x0, y0, x1, y1] = drawing.box;
    const width = x1 - x0;
    const height = y1 - y0;
    const scale = Math.min(FRAME_WIDTH / width, FRAME_HEIGHT / height);
    const midX = (x0 + x1) / 2;
    const midY = (y0 + y1) / 2;
    const direction = art.mirrored ? -scale : scale;
    return {
      transform: `translate(${FRAME_CX} ${FRAME_CY}) rotate(${art.tilt}) scale(${direction} ${scale}) translate(${-midX} ${-midY})`,
      shadowY: FRAME_CY + (height / 2) * scale + 34,
      shadowRx: (width * scale) / 2.6,
    };
  }, [drawing, art.mirrored, art.tilt]);

  return (
    <div
      className={cx(
        "relative overflow-hidden bg-sand",
        ratio === "fill" ? RATIO_CLASS.fill : RATIO_CLASS[ratio],
        className,
      )}
    >
      <svg
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`ground-${uid}`} x1="0.1" y1="0" x2="0.6" y2="1">
            <stop
              offset="0%"
              stopColor={art.groundTop}
              style={{ transition: `stop-color ${TRANSITION}` }}
            />
            <stop
              offset="100%"
              stopColor={art.groundBottom}
              style={{ transition: `stop-color ${TRANSITION}` }}
            />
          </linearGradient>

          {/* Directional light across the garment itself. */}
          <linearGradient id={`shade-${uid}`} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.26)" />
            <stop offset="42%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </linearGradient>

          <radialGradient id={`vignette-${uid}`} cx="50%" cy="42%" r="76%">
            <stop offset="55%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
          </radialGradient>

          <filter id={`soft-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="95" />
          </filter>

          <filter id={`shadow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="26" />
          </filter>

          <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="11" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
          </filter>

          <pattern id={`weave-${uid}`} width="7" height="7" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 0 7" stroke={rgba(art.stroke, 0.12)} strokeWidth="1" />
            <path d="M 0 0 L 7 0" stroke={rgba(art.stroke, 0.07)} strokeWidth="1" />
          </pattern>
        </defs>

        {/* --- ground ---------------------------------------------------- */}
        <rect width="800" height="1000" fill={`url(#ground-${uid})`} />
        <g filter={`url(#soft-${uid})`}>
          {art.blobs.map((blob, index) => (
            <circle
              key={index}
              cx={blob.cx}
              cy={blob.cy}
              r={blob.r}
              fill={blob.color}
              opacity={blob.opacity}
              style={{ transition: `fill ${TRANSITION}` }}
            />
          ))}
        </g>

        {/* --- subject --------------------------------------------------- */}
        {drawing ? (
          <>
            {/* Contact shadow lives outside the fitted group so it never
                rotates or mirrors with the garment. */}
            <ellipse
              cx="400"
              cy={fit.shadowY}
              rx={fit.shadowRx}
              ry={fit.shadowRx * 0.13}
              fill="rgba(0,0,0,0.22)"
              filter={`url(#shadow-${uid})`}
            />

            <g transform={fit.transform}>
            <path
              d={drawing.body}
              fill={tint}
              stroke={rgba(art.stroke, 0.45)}
              strokeWidth="2"
              strokeLinejoin="round"
              style={{ transition: `fill ${TRANSITION}, stroke ${TRANSITION}` }}
            />
            <path d={drawing.body} fill={`url(#shade-${uid})`} />

            {drawing.panels?.map((panel, index) => (
              <path
                key={`panel-${index}`}
                d={panel}
                fill={rgba(art.stroke, 0.06)}
                stroke={rgba(art.stroke, 0.34)}
                strokeWidth="1.75"
                strokeLinejoin="round"
                style={{ transition: `stroke ${TRANSITION}` }}
              />
            ))}

            {drawing.seams.map((seam, index) => (
              <path
                key={`seam-${index}`}
                d={seam}
                fill="none"
                stroke={rgba(art.stroke, 0.3)}
                strokeWidth="1.75"
                strokeLinecap="round"
                style={{ transition: `stroke ${TRANSITION}` }}
              />
            ))}

            {drawing.buttons?.map(([cx1, cy1], index) => (
              <circle
                key={`button-${index}`}
                cx={cx1}
                cy={cy1}
                r="6"
                fill={rgba(art.stroke, 0.42)}
                style={{ transition: `fill ${TRANSITION}` }}
              />
            ))}
            </g>
          </>
        ) : (
          <g
            transform={`translate(400 500) rotate(${art.tilt}) translate(-400 -500)`}
            opacity="0.5"
          >
            {/* Abstract field: a few long, calm strokes. Atmosphere, not product. */}
            {[0, 1, 2].map((line) => (
              <path
                key={line}
                d={`M ${-100 + line * 60} ${180 + line * 240} C 260 ${120 + line * 240}, 520 ${320 + line * 240}, 900 ${200 + line * 240}`}
                fill="none"
                stroke={rgba(art.stroke, 0.22)}
                strokeWidth="1.5"
                style={{ transition: `stroke ${TRANSITION}` }}
              />
            ))}
          </g>
        )}

        {/* --- finish ----------------------------------------------------- */}
        <rect width="800" height="1000" fill={`url(#weave-${uid})`} opacity="0.45" />
        <rect width="800" height="1000" fill={`url(#vignette-${uid})`} />
        <rect
          width="800"
          height="1000"
          filter={`url(#grain-${uid})`}
          opacity="0.22"
          style={{ mixBlendMode: "overlay" }}
        />
      </svg>

      {src ? (
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}

export default Media;
