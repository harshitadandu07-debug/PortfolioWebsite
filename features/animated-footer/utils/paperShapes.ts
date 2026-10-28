// Polygon shapes for the paper that morphs postcard -> airplane -> envelope. Every shape has 8 points, so the
// browser can interpolate between them with a plain clip-path polygon().
type Pt = readonly [number, number];

const RECT: Pt[] = [[0, 0], [50, 0], [100, 0], [100, 50], [100, 100], [50, 100], [0, 100], [0, 50]];
// Paper airplane pointing right (nose at the right edge): tail corner, nose, keel, lower wing, centre fold.
const PLANE: Pt[] = [[2, 6], [51, 27], [100, 48], [100, 48], [62, 58], [35, 76], [8, 94], [34, 47]];

/** `m` runs 0 (rectangle) -> 1 (airplane) -> 2 (rectangle again, for the envelope). */
export function paperClip(m: number): string {
  const [a, b, t] = m <= 1 ? [RECT, PLANE, Math.max(0, m)] : [PLANE, RECT, Math.min(1, m - 1)];
  return `polygon(${a.map((p, i) => `${(p[0] + (b[i][0] - p[0]) * t).toFixed(2)}% ${(p[1] + (b[i][1] - p[1]) * t).toFixed(2)}%`).join(",")})`;
}
