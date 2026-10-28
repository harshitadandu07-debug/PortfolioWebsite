/**
 * The face of the folded envelope the dog carries. It is drawn over the paper once the airplane has become an
 * envelope, matching the cream envelope in the girl's hand-off sprites (cream paper, soft grey outline, V flap).
 */
export default function Envelope({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}>
      <rect x="0" y="0" width="100" height="64" fill="#f8f4ec" />
      <path d="M0 0 L50 38 L100 0" fill="#efe9de" stroke="#b9b1a4" strokeWidth="2.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M0 64 L36 30 M100 64 L64 30" fill="none" stroke="#cfc7ba" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <rect x="1" y="1" width="98" height="62" fill="none" stroke="#b9b1a4" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
