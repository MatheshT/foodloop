import { DonationItem, Organization, MatchScoreResult } from '../types';

// Calculate Haversine distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Estimate city transit duration based on distance (assuming avg 20 km/h in dense urban area + 8 min dispatch buffer)
export function estimateTransitMinutes(distanceKm: number): number {
  const transitTime = Math.round((distanceKm / 22) * 60) + 8;
  return Math.max(10, transitTime);
}

// Multi-Objective Match Scoring
export function computeMatchScore(
  donation: DonationItem,
  recipient: Organization
): MatchScoreResult {
  const distanceKm = calculateDistanceKm(
    donation.donorLocation.lat,
    donation.donorLocation.lng,
    recipient.location.lat,
    recipient.location.lng
  );

  const estimatedTransitMinutes = estimateTransitMinutes(distanceKm);

  // 1. Time-Decay & Urgency Score
  const now = Date.now();
  const deadlineTime = new Date(donation.safeUntilDeadline).getTime();
  const remainingMinutes = Math.max(1, Math.round((deadlineTime - now) / (60 * 1000)));

  // If transit time > remaining minutes, safety window is violated
  let timeDecayScore = 100;
  if (estimatedTransitMinutes >= remainingMinutes) {
    timeDecayScore = 0;
  } else {
    // Score proportionally higher if delivery happens safely within first 40% of remaining shelf-life
    const bufferMinutes = remainingMinutes - estimatedTransitMinutes;
    timeDecayScore = Math.min(100, Math.round((bufferMinutes / remainingMinutes) * 100));
  }

  // 2. Capacity Score
  const capacity = recipient.capacityServings || 100;
  let capacityMatchScore = 100;
  if (donation.quantityServings > capacity * 1.5) {
    // Excessive surplus that recipient cannot consume or store
    capacityMatchScore = Math.max(20, Math.round((capacity / donation.quantityServings) * 100));
  } else if (donation.quantityServings < capacity * 0.2) {
    // Underfills capacity significantly
    capacityMatchScore = 70;
  } else {
    // Perfect sweet spot
    capacityMatchScore = 95;
  }

  // 3. Storage Compatibility
  let storageCompatible = true;
  if (donation.foodType === 'PREPARED_COLD' && !recipient.hasColdStorage) {
    storageCompatible = false;
  }

  // 4. Dietary Compliance Score
  let dietaryScore = 100;
  if (recipient.dietaryRestrictions?.includes('PURE_VEG')) {
    const isVeg = donation.dietaryTags.some(t => t.toLowerCase().includes('veg'));
    if (!isVeg) {
      dietaryScore = 0;
    }
  }

  // 5. Distance Penalty (Max radius 15 km)
  const maxRadiusKm = 15;
  const distanceScore = Math.max(0, Math.round((1 - distanceKm / maxRadiusKm) * 100));

  // Weighted aggregate formula:
  // 35% Urgency/Time Decay + 25% Distance + 20% Capacity + 20% Dietary/Storage
  const reasoning: string[] = [];

  if (distanceKm <= 3.5) {
    reasoning.push(`Hyper-local proximity (${distanceKm} km, ~${estimatedTransitMinutes} mins travel)`);
  } else {
    reasoning.push(`Accessible corridor (${distanceKm} km, ~${estimatedTransitMinutes} mins travel)`);
  }

  if (storageCompatible) {
    reasoning.push(`Cold-chain / holding storage verified at recipient facility`);
  } else {
    reasoning.push(`Warning: Recipient lacks dedicated cold storage for this cold meal`);
  }

  if (capacityMatchScore >= 80) {
    reasoning.push(`Optimum serving size: ${donation.quantityServings} servings aligns with recipient shelter intake`);
  }

  let totalScore = Math.round(
    timeDecayScore * 0.35 +
    distanceScore * 0.25 +
    capacityMatchScore * 0.20 +
    dietaryScore * 0.20
  );

  if (!storageCompatible || dietaryScore === 0) {
    totalScore = Math.min(totalScore, 35); // Critical constraint down-rank
  }

  return {
    recipient,
    totalScore: Math.max(5, Math.min(99, totalScore)),
    distanceKm,
    estimatedTransitMinutes,
    timeDecayScore,
    capacityMatchScore,
    dietaryScore,
    storageCompatible,
    reasoning
  };
}
