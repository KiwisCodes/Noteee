// Ramer-Douglas-Peucker (RDP) Point Simplification Implementation
export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export function simplifyStrokeRDP(points: StrokePoint[], epsilon: number = 0.75): StrokePoint[] {
  if (points.length <= 2) return points;

  let maxDistance = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > maxDistance) {
      maxDistance = d;
      index = i;
    }
  }

  if (maxDistance > epsilon) {
    const recursiveResults1 = simplifyStrokeRDP(points.slice(0, index + 1), epsilon);
    const recursiveResults2 = simplifyStrokeRDP(points.slice(index), epsilon);
    return recursiveResults1.slice(0, recursiveResults1.length - 1).concat(recursiveResults2);
  } else {
    return [start, end];
  }
}

function perpendicularDistance(p: StrokePoint, lineStart: StrokePoint, lineEnd: StrokePoint): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lineSqLen = dx * dx + dy * dy;
  
  if (lineSqLen === 0) {
    return Math.hypot(p.x - lineStart.x, p.y - lineStart.y);
  }

  const t = Math.max(0, Math.min(1, ((p.x - lineStart.x) * dx + (p.y - lineStart.y) * dy) / lineSqLen));
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}