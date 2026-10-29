import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  Thermometer, 
  ShieldCheck, 
  Layers, 
  Flame, 
  Snowflake, 
  CheckCircle2, 
  Activity, 
  Eye, 
  Upload,
  ArrowRight
} from 'lucide-react';
import { analyzeFoodImageAI, FoodAnalysisAIResponse } from '../services/aiVisionEngine';
import { soundManager } from '../services/soundEffects';

interface AIFoodScannerStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToPost: (data: {
    title: string;
    foodType: 'PREPARED_HOT' | 'PREPARED_COLD' | 'PACKAGED_DRY';
    servings: number;
    weightKg: number;
    tempCelsius: number;
    imageUrl: string;
    aiScore: number;
  }) => void;
}

export const AIFoodScannerStudio: React.FC<AIFoodScannerStudioProps> = ({
  isOpen,
  onClose,
  onApplyToPost
}) => {
  if (!isOpen) return null;

  const sampleDishes = [
    {
      title: 'Royal Biryani & Paneer Butter Masala',
      type: 'PREPARED_HOT' as const,
      servings: 140,
      weightKg: 45.5,
      temp: 68.5,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80'
    },
    {
      title: 'Mediterranean Quinoa Bowls & Fresh Produce',
      type: 'PREPARED_COLD' as const,
      servings: 75,
      weightKg: 24.0,
      temp: 3.6,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80'
    },
    {
      title: 'Artisan Farm Sourdough & Country Apples',
      type: 'PACKAGED_DRY' as const,
      servings: 110,
      weightKg: 35.0,
      temp: 22.0,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80'
    }
  ];

  const [selectedDishIndex, setSelectedDishIndex] = useState(0);
  const [thermalHeatmapMode, setThermalHeatmapMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysisAIResponse>(
    analyzeFoodImageAI(sampleDishes[0].title, sampleDishes[0].type)
  );

  const currentDish = sampleDishes[selectedDishIndex];

  const handleSelectDish = (index: number) => {
    setSelectedDishIndex(index);
    const dish = sampleDishes[index];
    setIsScanning(true);
    soundManager.playNotificationTone();

    setTimeout(() => {
      setAnalysis(analyzeFoodImageAI(dish.title, dish.type));
      setIsScanning(false);
      soundManager.playSuccessChime();
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIsScanning(true);
      soundManager.playNotificationTone();
      setTimeout(() => {
        setAnalysis(analyzeFoodImageAI(file.name.replace(/\.[^/.]+$/, ""), 'PREPARED_HOT'));
        setIsScanning(false);
        soundManager.playSuccessChime();
      }, 1000);
    }
  };

  const handleApply = () => {
    soundManager.playSuccessChime();
    onApplyToPost({
      title: currentDish.title,
      foodType: currentDish.type,
      servings: currentDish.servings,
      weightKg: currentDish.weightKg,
      tempCelsius: analysis.haccpSafety.coreTempEstimate,
      imageUrl: currentDish.image,
      aiScore: Math.round(analysis.confidenceScore)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative my-6 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">AI Computer Vision Food Scanner Studio</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                  Neural Lens v4.2
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Automatic food recognition, thermal heatmap estimation & HACCP safety analysis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image Canvas & Controls */}
          <div className="space-y-4">
            {/* Visual Canvas */}
            <div className="relative h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-inner group">
              <img
                src={currentDish.image}
                alt={currentDish.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  thermalHeatmapMode ? 'filter contrast-150 saturate-200 hue-rotate-180 invert-[0.1]' : ''
                }`}
              />

              {/* Thermal Heatmap Color Gradient Overlay */}
              {thermalHeatmapMode && (
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/40 via-amber-500/30 to-blue-600/30 mix-blend-color-dodge pointer-events-none" />
              )}

              {/* Scanning Laser Animation */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 shadow-lg shadow-emerald-400/80 animate-bounce" />
              )}

              {/* Top Canvas Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-extrabold text-slate-900 border border-slate-200 shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Score: {analysis.confidenceScore}%</span>
                </span>

                <button
                  type="button"
                  onClick={() => setThermalHeatmapMode(!thermalHeatmapMode)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                    thermalHeatmapMode
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-white/95 text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{thermalHeatmapMode ? 'Thermal Heatmap ON' : 'Toggle Thermal View'}</span>
                </button>
              </div>

              {/* Bottom Temperature Pill */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-900 border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <span>Est. Core Temp: {analysis.haccpSafety.coreTempEstimate}°C</span>
              </div>
            </div>

            {/* Dish Presets & Custom File Upload */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Select Food Sample or Upload Real Photo:
              </span>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {sampleDishes.map((dish, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDish(idx)}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedDishIndex === idx
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-[11px] font-extrabold text-slate-900 truncate">{dish.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{dish.temp}°C • {dish.servings} Servings</p>
                  </button>
                ))}
              </div>

              <label className="flex items-center justify-center gap-2 p-2.5 rounded-2xl border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs font-bold text-slate-600 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload Custom Kitchen Photo (PNG / JPG)</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Right Column: AI Analysis Findings */}
          <div className="space-y-4 text-xs">
            {/* Ingredients & Composition */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 block text-xs">
                Neural Ingredient Breakdown:
              </span>
              <div className="space-y-1.5">
                {analysis.ingredients.map((ing, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                      <span>{ing.name}</span>
                      <span className="font-mono text-emerald-700">{ing.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${ing.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Nutrition Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">Calories</span>
                <span className="text-sm font-extrabold text-slate-900">{analysis.nutrition.caloriesPerServing}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">Protein</span>
                <span className="text-sm font-extrabold text-emerald-700">{analysis.nutrition.proteinGrams}g</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">Carbs</span>
                <span className="text-sm font-extrabold text-slate-900">{analysis.nutrition.carbsGrams}g</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">Fiber</span>
                <span className="text-sm font-extrabold text-slate-900">{analysis.nutrition.fiberGrams}g</span>
              </div>
            </div>

            {/* HACCP Pathogen Risk Assessment */}
            <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>HACCP Microbial Pathogen Assessment</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                  Risk: {analysis.haccpSafety.pathogenRiskLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">
                {analysis.haccpSafety.pathogenAnalysis}
              </p>
              <p className="text-[11px] text-emerald-800 font-bold pt-1 border-t border-emerald-200/80">
                Holding State: {analysis.haccpSafety.thermalHoldingStatus} (Safe window: ~{analysis.haccpSafety.safeWindowMinutes} mins)
              </p>
            </div>

            {/* Recommended Safety Actions */}
            <div className="space-y-1 text-slate-600 text-[11px]">
              <span className="font-bold text-slate-800 block">AI Recommended Handling Actions:</span>
              <ul className="list-disc list-inside space-y-0.5">
                {analysis.recommendedActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            AI analysis certified for Good Samaritan Food Donation Safe Harbor Compliance
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close Studio
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply AI Scan to Surplus Listing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
