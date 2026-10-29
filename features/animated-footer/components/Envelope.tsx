/**
 * The face of the folded envelope the dog carries. It is drawn over the paper once the airplane has become an
 * envelope, matching the cream envelope the girl holds in her sprites (warm cream paper, tan outline, V flap).
 */
export default function Envelope({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}>
      <rect x="0" y="0" width="100" height="64" fill="#f3dfc6" />
      <path d="M0 0 L50 38 L100 0 Z" fill="#ead6bd" stroke="#cdb89c" strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M0 64 L38 29 M100 64 L62 29" fill="none" stroke="#dcc7ab" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <rect x="0.5" y="0.5" width="99" height="63" fill="none" stroke="#cdb89c" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
