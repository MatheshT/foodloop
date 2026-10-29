export interface AIFreshnessAnalysisResult {
  freshnessScore: number; // 0 - 100
  shelfLifeMinutes: number;
  qualityGrade: 'PRISTINE_GRADE_A' | 'COMMERCIAL_GRADE_B' | 'URGENT_CONSUMPTION' | 'UNSAFE_REJECT';
  detectedVisualCues: string[];
  bacterialRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  estimatedSurfaceTempCelsius: number;
  recommendedHACCPAction: string;
}

export function simulateAIFreshnessScan(
  foodName: string,
  foodType: string,
  cookHoursAgo: number
): AIFreshnessAnalysisResult {
  // Simulate intelligent neural analysis
  let baseScore = 98 - (cookHoursAgo * 5);
  baseScore = Math.max(40, Math.min(99, baseScore));

  let shelfLifeMinutes = Math.max(60, Math.round(240 - (cookHoursAgo * 45)));

  let qualityGrade: AIFreshnessAnalysisResult['qualityGrade'] = 'PRISTINE_GRADE_A';
  let bacterialRisk: AIFreshnessAnalysisResult['bacterialRiskLevel'] = 'LOW';
  let tempCelsius = 66.5;

  if (foodType === 'PREPARED_COLD') {
    tempCelsius = 3.8;
  } else if (foodType === 'PACKAGED_DRY') {
    tempCelsius = 22.0;
    shelfLifeMinutes = 720;
  }

  const cues: string[] = [
    'No oil oxidation or discoloration detected',
    'Steam vapor signature confirms hot holding integrity',
    'Food surface hydration level: 88% (Optimal)',
    'Zero mold, yeast, or physical foreign particulates identified'
  ];

  if (baseScore < 75) {
    qualityGrade = 'URGENT_CONSUMPTION';
    bacterialRisk = 'MODERATE';
    cues.push('Minor surface drying observed; priority consumption recommended within 90 minutes');
  }

  return {
    freshnessScore: Math.round(baseScore),
    shelfLifeMinutes,
    qualityGrade,
    detectedVisualCues: cues,
    bacterialRiskLevel: bacterialRisk,
    estimatedSurfaceTempCelsius: tempCelsius,
    recommendedHACCPAction: foodType === 'PREPARED_HOT' 
      ? 'Maintain core temperature >= 60°C. Transport in thermally sealed insulated carriers.' 
      : 'Maintain refrigerated chain <= 4°C.'
  };
}
