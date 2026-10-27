// Mathematical model mimicking trained ensemble regressor
// Predicts ETA considering distance, velocity, congestion multiplier, and roadside bottlenecks
export function calculatePredictedEta(
  distanceKmRemaining: number,
  currentSpeedKmh: number,
  congestionFactor: number,
  riskWeight: number
): number {
  if (distanceKmRemaining <= 0.05) return 0;
  
  const effectiveSpeed = Math.max(12, currentSpeedKmh / Math.max(1.0, congestionFactor * 0.9));
  const baseTimeSeconds = (distanceKmRemaining / effectiveSpeed) * 3600;
  
  // Scikit-Learn non-linear penalty for intersections and route risks
  const intersectionPenalty = (distanceKmRemaining / 2.0) * 18; 
  const riskVariance = riskWeight * 12;

  return Math.round(baseTimeSeconds + intersectionPenalty + riskVariance);
}

// Haversine distance in KM
export function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Interpolate coordinate along waypoints array given progress 0..1
export function interpolateRoutePosition(
  waypoints: [number, number][],
  progressRatio: number
): [number, number] {
  if (progressRatio <= 0) return waypoints[0];
  if (progressRatio >= 1) return waypoints[waypoints.length - 1];

  const totalSegments = waypoints.length - 1;
  const targetFloat = progressRatio * totalSegments;
  const index = Math.floor(targetFloat);
  const remainder = targetFloat - index;

  if (index >= totalSegments) return waypoints[waypoints.length - 1];

  const p1 = waypoints[index];
  const p2 = waypoints[index + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * remainder;
  const lng = p1[1] + (p2[1] - p1[1]) * remainder;
  return [lat, lng];
}
