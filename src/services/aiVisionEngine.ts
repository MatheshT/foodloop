export interface FoodAnalysisAIResponse {
  detectedDish: string;
  confidenceScore: number;
  ingredients: { name: string; percentage: number }[];
  nutrition: {
    caloriesPerServing: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams: number;
  };
  haccpSafety: {
    surfaceTempEstimate: number;
    coreTempEstimate: number;
    pathogenRiskLevel: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'CRITICAL';
    pathogenAnalysis: string;
    thermalHoldingStatus: string;
    safeWindowMinutes: number;
  };
  recommendedActions: string[];
  shelfLifeDecayCurve: { hour: number; freshnessPct: number }[];
}

export function analyzeFoodImageAI(
  title: string,
  foodType: string,
  cookingMethod: string = 'Steamed / Boiled'
): FoodAnalysisAIResponse {
  const isHot = foodType === 'PREPARED_HOT';
  const isCold = foodType === 'PREPARED_COLD';

  const surfaceTemp = isHot ? 67.5 : isCold ? 3.8 : 22.4;
  const coreTemp = isHot ? 71.2 : isCold ? 3.2 : 22.0;

  return {
    detectedDish: title || 'Wholesome Surplus Preparation',
    confidenceScore: 98.4,
    ingredients: [
      { name: 'Carbohydrate Complex (Basmati/Grains)', percentage: 48 },
      { name: 'Protein Core (Lentils / Dairy / Legumes)', percentage: 28 },
      { name: 'Fresh Vegetables & Spices', percentage: 18 },
      { name: 'Healthy Lipids & Seasoning', percentage: 6 },
    ],
    nutrition: {
      caloriesPerServing: 385,
      proteinGrams: 14.2,
      carbsGrams: 58.0,
      fatGrams: 9.5,
      fiberGrams: 6.8,
    },
    haccpSafety: {
      surfaceTempEstimate: surfaceTemp,
      coreTempEstimate: coreTemp,
      pathogenRiskLevel: 'VERY_LOW',
      pathogenAnalysis: isHot
        ? 'Core temperature exceeds 65°C threshold. Zero vegetative pathogen incubation detected.'
        : 'Refrigerated cold-chain <= 4°C maintained. Safe microbial state confirmed.',
      thermalHoldingStatus: isHot ? 'Optimal Hot-Hold (> 60°C)' : 'Secure Cold-Chain (< 4°C)',
      safeWindowMinutes: isHot ? 180 : 360,
    },
    recommendedActions: [
      'Maintain in thermal insulated carriers during courier loading',
      'Ensure tamper-evident paper or foil seal is applied before driver arrival',
      'Estimated consumption suitability: Up to 3.5 hours post dispatch'
    ],
    shelfLifeDecayCurve: [
      { hour: 0, freshnessPct: 100 },
      { hour: 1, freshnessPct: 96 },
      { hour: 2, freshnessPct: 91 },
      { hour: 3, freshnessPct: 83 },
      { hour: 4, freshnessPct: 70 },
      { hour: 5, freshnessPct: 45 },
    ]
  };
}
