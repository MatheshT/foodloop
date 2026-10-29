export type FoodType = 'PREPARED_HOT' | 'PREPARED_COLD' | 'PACKAGED_DRY' | 'RAW_PRODUCE';

export type DonationStatus = 
  | 'AVAILABLE' 
  | 'MATCHED' 
  | 'COURIER_ASSIGNED' 
  | 'PICKED_UP' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'QUARANTINED';

export type UserRole = 'DONOR' | 'RECIPIENT' | 'DRIVER' | 'ADMIN';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'DONOR_RESTAURANT' | 'DONOR_HOSTEL' | 'DONOR_CATERER' | 'DONOR_SUPERMARKET' | 'RECIPIENT_SHELTER' | 'RECIPIENT_FOODBANK' | 'RECIPIENT_COMMUNITY_KITCHEN';
  verified: boolean;
  licenseNumber: string; // FSSAI / FDA / Tax ID
  location: GeoLocation;
  contactPerson: string;
  phone: string;
  capacityServings?: number;
  hasColdStorage?: boolean;
  dietaryRestrictions?: string[]; // e.g., 'PURE_VEG', 'HALAL', 'NUT_FREE'
}

export interface HACCPLog {
  id: string;
  stage: 'PREPARATION' | 'PICKUP_INSPECTION' | 'TRANSIT_TELEMETRY' | 'DELIVERY_ACCEPTANCE';
  timestamp: string;
  temperatureCelsius: number;
  visualIntegrityPass: boolean;
  smellSensoryPass: boolean;
  tamperSealIntact: boolean;
  inspectorName: string;
  notes?: string;
}

export interface DonationItem {
  id: string;
  donorId: string;
  donorName: string;
  donorType: string;
  donorLocation: GeoLocation;
  title: string;
  foodType: FoodType;
  cuisine: string;
  quantityServings: number;
  weightKg: number;
  preparedAt: string;
  safeUntilDeadline: string; // ISO string
  storageRequirement: string;
  allergens: string[];
  dietaryTags: string[];
  imageUrl: string;
  aiFreshnessScore: number; // 0 - 100
  aiShelfLifeConfidence: string;
  status: DonationStatus;
  pickupOtp: string;
  deliveryQrToken: string;
  matchedRecipientId?: string;
  matchedRecipientName?: string;
  matchedRecipientLocation?: GeoLocation;
  driverId?: string;
  driverName?: string;
  driverVehicleType?: string;
  currentCourierLocation?: { lat: number; lng: number };
  haccpLogs: HACCPLog[];
  co2eAvoidedKg: number;
  waterSavedLiters: number;
  quarantineReason?: string;
}

export interface MatchScoreResult {
  recipient: Organization;
  totalScore: number; // 0 - 100
  distanceKm: number;
  estimatedTransitMinutes: number;
  timeDecayScore: number;
  capacityMatchScore: number;
  dietaryScore: number;
  storageCompatible: boolean;
  reasoning: string[];
}

export interface ESGImpactReport {
  totalDonationsCompleted: number;
  totalServingsRedistributed: number;
  totalWeightRedistributedKg: number;
  totalCo2eAvoidedKg: number;
  totalWaterSavedLiters: number;
  totalMethaneDivertedKg: number;
  landfillDiversionRatePercent: number;
}
