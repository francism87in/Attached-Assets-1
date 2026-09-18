/**
 * Film grain + vignette. The grain is a single inline SVG turbulence tile drawn
 * once by the browser and tiled by CSS — no JS, no per-frame work — and it sits
 * under a radial vignette to give the dark ground some depth on large screens.
 */
const grain =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
       <filter id="n">
         <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
         <feColorMatrix type="saturate" values="0"/>
       </filter>
       <rect width="160" height="160" filter="url(#n)" opacity="0.42"/>
     </svg>`,
  );

export function Grain() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{ backgroundImage: `url("${grain}")`, backgroundSize: "160px 160px" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, transparent 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}
