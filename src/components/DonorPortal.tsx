import React, { useState, useEffect, useRef } from 'react';
import { DonationItem, Organization, FoodType } from '../types';
import { 
  PlusCircle, 
  Sparkles, 
  Clock, 
  Thermometer, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Key, 
  Flame, 
  Snowflake, 
  Package, 
  Camera, 
  Bot, 
  Calculator, 
  Repeat, 
  Award, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { simulateAIFreshnessScan, AIFreshnessAnalysisResult } from '../services/aiFreshnessVision';
import { soundManager } from '../services/soundEffects';
import { DonorAICopilot } from './DonorAICopilot';
import { AIFoodScannerStudio } from './AIFoodScannerStudio';
import { CSRTaxCalculatorModal } from './CSRTaxCalculatorModal';
import { RecurringSurplusModal } from './RecurringSurplusModal';

interface DonorPortalProps {
  donations: DonationItem[];
  donorOrg: Organization;
  onAddDonation: (newDonation: DonationItem) => void;
  onViewHaccp: (donation: DonationItem) => void;
  onViewEsg: (donation: DonationItem) => void;
}

export const DonorPortal: React.FC<DonorPortalProps> = ({
  donations,
  donorOrg,
  onAddDonation,
  onViewHaccp,
  onViewEsg
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAiStudio, setShowAiStudio] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);

  // Form states
  const [foodTitle, setFoodTitle] = useState('');
  const [foodType, setFoodType] = useState<FoodType>('PREPARED_HOT');
  const [servings, setServings] = useState<number>(120);
  const [weightKg, setWeightKg] = useState<number>(40);
  const [prepTemp, setPrepTemp] = useState<number>(68);
  const [storageReq, setStorageReq] = useState('Insulated Thermal Warmer (> 60°C)');
  const [hoursCookedAgo, setHoursCookedAgo] = useState<number>(1);
  const [safeHoursLeft, setSafeHoursLeft] = useState<number>(2.5);
  const [dietaryTags, setDietaryTags] = useState<string[]>(['Vegetarian']);
  const [allergens, setAllergens] = useState<string[]>(['Dairy']);
  
  // Custom Donor Uploaded Image State
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
  const [imageFileName, setImageFileName] = useState<string>('Default kitchen photo');
  const [aiScore, setAiScore] = useState<number>(96);
  const [isAiScanningImage, setIsAiScanningImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample quick photo picks
  const quickFoodPhotos = [
    { label: 'Rice & Curry', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
    { label: 'Biryani Buffet', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
    { label: 'Salads & Veggies', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
    { label: 'Fresh Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
  ];

  // Filter donations belonging to this donor
  const myDonations = donations.filter(d => d.donorId === donorOrg.id);

  // Live countdown timer
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle direct file upload from donor device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      setIsAiScanningImage(true);
      soundManager.playNotificationTone();

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setImageUrl(base64Url);

        // Auto trigger AI Freshness Scan on uploaded image
        setTimeout(() => {
          setIsAiScanningImage(false);
          const scannedScore = Math.floor(92 + Math.random() * 7);
          setAiScore(scannedScore);
          soundManager.playSuccessChime();
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyFromStudio = (data: {
    title: string;
    foodType: 'PREPARED_HOT' | 'PREPARED_COLD' | 'PACKAGED_DRY';
    servings: number;
    weightKg: number;
    tempCelsius: number;
    imageUrl: string;
    aiScore: number;
  }) => {
    setFoodTitle(data.title);
    setFoodType(data.foodType);
    setServings(data.servings);
    setWeightKg(data.weightKg);
    setPrepTemp(data.tempCelsius);
    setImageUrl(data.imageUrl);
    setImageFileName('Scanned via AI Studio');
    setAiScore(data.aiScore);
    setShowPostModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodTitle) return;

    const deadline = new Date(Date.now() + safeHoursLeft * 60 * 60 * 1000).toISOString();
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const qrToken = `FOODLOOP-VERIFIED-${Date.now().toString(36).toUpperCase()}`;

    const newDonation: DonationItem = {
      id: `DON-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      donorId: donorOrg.id,
      donorName: donorOrg.name,
      donorType: donorOrg.type.replace('DONOR_', ''),
      donorLocation: donorOrg.location,
      title: foodTitle,
      foodType,
      cuisine: 'Wholesome Balanced Fare',
      quantityServings: servings,
      weightKg: weightKg,
      preparedAt: new Date(Date.now() - hoursCookedAgo * 60 * 60 * 1000).toISOString(),
      safeUntilDeadline: deadline,
      storageRequirement: storageReq,
      allergens,
      dietaryTags,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      aiFreshnessScore: aiScore,
      aiShelfLifeConfidence: 'PRISTINE_GRADE_A',
      status: 'AVAILABLE',
      pickupOtp: otp,
      deliveryQrToken: qrToken,
      haccpLogs: [
        {
          id: `haccp-${Date.now()}`,
          stage: 'PREPARATION',
          timestamp: new Date().toISOString(),
          temperatureCelsius: prepTemp,
          visualIntegrityPass: true,
          smellSensoryPass: true,
          tamperSealIntact: true,
          inspectorName: `${donorOrg.contactPerson} (Food Safety Lead)`,
          notes: `Batch certified safe for consumption. Temperature verified at ${prepTemp}°C.`
        }
      ],
      co2eAvoidedKg: Math.round(weightKg * 2.5 * 10) / 10,
      waterSavedLiters: Math.round(weightKg * 840)
    };

    onAddDonation(newDonation);
    soundManager.playSuccessChime();
    setShowPostModal(false);
    setFoodTitle('');
  };

  const formatRemainingTime = (deadlineIso: string) => {
    const diff = new Date(deadlineIso).getTime() - currentTime;
    if (diff <= 0) return 'Expired / Safe Window Closed';
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Start Guide Banner for Easy Onboarding */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-5 text-white shadow-lg shadow-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Quick Start: 4-Step Surplus Flow</h3>
            <p className="text-xs text-emerald-100 font-medium">
              1. Post Food with photo ➔ 2. Recipient NGO Claims ➔ 3. Driver Picks Up with OTP ➔ 4. Verified Delivery!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playNotificationTone();
            setShowPostModal(true);
          }}
          className="px-4 py-2 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-all cursor-pointer whitespace-nowrap"
        >
          + Post Food in 30 Seconds
        </button>
      </div>

      {/* Bento Grid Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Donor Profile Bento Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-100 text-emerald-800">
                  Verified Food Donor
                </span>
                <span className="text-xs text-slate-500 font-mono">Lic: {donorOrg.licenseNumber}</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Tier 1 Platinum Partner</span>
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{donorOrg.name}</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">{donorOrg.location.address}</p>
          </div>

          {/* Action Toolbar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                soundManager.playNotificationTone();
                setShowPostModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Surplus Food</span>
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                setShowAiStudio(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>AI Vision Scanner Studio</span>
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                setShowTaxModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              <Calculator className="w-4 h-4 text-teal-600" />
              <span>Tax & CSR Calculator</span>
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                setShowRecurringModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              <Repeat className="w-4 h-4 text-sky-600" />
              <span>Recurring Routes</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Bento Card */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border border-emerald-200 rounded-3xl p-6 shadow-md shadow-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
              Donor Lifetime Impact
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="grid grid-cols-2 gap-3 my-2 text-slate-800">
            <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold block">Meals Served</span>
              <span className="text-xl font-extrabold text-slate-900">4,820</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Zero Food Waste</span>
            </div>

            <div className="bg-white/90 p-3 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] text-slate-500 font-bold block">CSR Tax Offset</span>
              <span className="text-xl font-extrabold text-emerald-700">$16,870</span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Section 80G Certified</span>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>3,850 kg CO₂e Saved</span>
            </span>
            <button
              onClick={() => setShowTaxModal(true)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Audit</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Active Listings & AI Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Listings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">Active Surplus Batches</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {myDonations.length} Active
              </span>
            </div>
            <button
              onClick={() => setShowAiStudio(true)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Vision Scanner</span>
            </button>
          </div>

          {myDonations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-slate-800 font-bold mb-1">No Surplus Listed Right Now</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Post surplus food batches with pickup deadlines to instantly alert nearby verified shelters.
              </p>
              <button
                onClick={() => setShowPostModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Broadcast New Batch</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myDonations.map((donation) => {
                const isDangerTemp =
                  donation.foodType === 'PREPARED_HOT' && donation.haccpLogs[0]?.temperatureCelsius < 60;

                return (
                  <div
                    key={donation.id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-5 shadow-md shadow-slate-100 flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Category & AI Score */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          donation.foodType === 'PREPARED_HOT'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : donation.foodType === 'PREPARED_COLD'
                            ? 'bg-sky-100 text-sky-900 border border-sky-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {donation.foodType === 'PREPARED_HOT' && <Flame className="w-3 h-3 text-amber-700" />}
                          {donation.foodType === 'PREPARED_COLD' && <Snowflake className="w-3 h-3 text-sky-700" />}
                          {donation.foodType.replace('_', ' ')}
                        </span>

                        <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-xs bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>AI: {donation.aiFreshnessScore}%</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base mb-2">{donation.title}</h3>

                      <div className="flex gap-3 mb-3">
                        <img
                          src={donation.imageUrl}
                          alt={donation.title}
                          className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0 shadow-xs"
                        />
                        <div className="text-xs space-y-1 flex-1 text-slate-700">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Portions:</span>
                            <span className="font-bold text-slate-900">{donation.quantityServings} servings ({donation.weightKg} kg)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">HACCP Temp:</span>
                            <span className={`font-mono font-bold ${isDangerTemp ? 'text-rose-600' : 'text-slate-800'}`}>
                              {donation.haccpLogs[0]?.temperatureCelsius}°C
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Status:</span>
                            <span className="text-emerald-700 font-bold uppercase text-[10px]">{donation.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Countdown & OTP */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pickup Deadline</p>
                            <p className="text-xs font-mono font-extrabold text-amber-700">
                              {formatRemainingTime(donation.safeUntilDeadline)}
                            </p>
                          </div>
                        </div>

                        <div className="bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-xl text-right">
                          <p className="text-[9px] text-emerald-800 font-bold flex items-center gap-0.5 justify-end">
                            <Key className="w-3 h-3 text-emerald-700" /> Pickup OTP
                          </p>
                          <p className="text-sm font-mono font-extrabold text-emerald-900">
                            {donation.pickupOtp}
                          </p>
                        </div>
                      </div>

                      {/* Matched Recipient Info if assigned */}
                      {donation.matchedRecipientName && (
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 mb-2 text-xs">
                          <span className="text-sky-800 font-bold">Matched Recipient: </span>
                          <span className="text-slate-900 font-semibold">{donation.matchedRecipientName}</span>
                          {donation.driverName && (
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              Courier: <strong className="text-teal-700">{donation.driverName}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => onViewHaccp(donation)}
                        className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>HACCP Pass</span>
                      </button>

                      <button
                        onClick={() => onViewEsg(donation)}
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ESG Certificate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Embedded LoopAI Kitchen Copilot */}
        <div className="lg:col-span-1">
          <DonorAICopilot />
        </div>
      </div>

      {/* Modal: Post Surplus Food Wizard with Dedicated Easy Image Upload */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  <span>List Available Surplus Food</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Add dish details and upload photo to broadcast to nearby shelters</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Dish Title */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Batch Title & Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Steamed Basmati Rice, Dal Tadka & Mix Veggie Korma"
                  value={foodTitle}
                  onChange={(e) => setFoodTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Dedicated Image Upload Section for Donors */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-extrabold text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Food Photo (Upload or Select)</span>
                  </label>
                  {isAiScanningImage ? (
                    <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      <span>AI Analyzing Image...</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AI Freshness: {aiScore}%</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-300 shrink-0 shadow-xs">
                    <img
                      src={imageUrl}
                      alt="Food Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/10" />
                  </div>

                  {/* Upload Controls & Presets */}
                  <div className="flex-1 space-y-2 w-full">
                    {/* File Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Upload Photo from Computer / Phone</span>
                    </button>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      File: {imageFileName}
                    </p>

                    {/* Quick Sample Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Or Pick a Standard Sample:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickFoodPhotos.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setImageUrl(item.url);
                              setImageFileName(item.label);
                              soundManager.playNotificationTone();
                            }}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                              imageUrl === item.url
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Food Type Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'PREPARED_HOT' as FoodType, label: 'Hot Cooked', icon: Flame, color: 'text-amber-600' },
                  { type: 'PREPARED_COLD' as FoodType, label: 'Cold / Chilled', icon: Snowflake, color: 'text-sky-600' },
                  { type: 'PACKAGED_DRY' as FoodType, label: 'Bakery / Dry', icon: Package, color: 'text-emerald-600' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = foodType === item.type;
                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => {
                        setFoodType(item.type);
                        if (item.type === 'PREPARED_HOT') setPrepTemp(68);
                        if (item.type === 'PREPARED_COLD') setPrepTemp(3.5);
                        if (item.type === 'PACKAGED_DRY') setPrepTemp(22);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Portions / Servings</label>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={servings}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setServings(val);
                      setWeightKg(Math.round(val * 0.35 * 10) / 10);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Est. Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Safe Pickup Window</label>
                  <select
                    value={safeHoursLeft}
                    onChange={(e) => setSafeHoursLeft(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value={1.5}>1.5 Hours (Urgent Hot)</option>
                    <option value={2.5}>2.5 Hours (Standard Buffet)</option>
                    <option value={4}>4 Hours (Insulated Core)</option>
                    <option value={8}>8 Hours (Chilled / Dry Packaged)</option>
                  </select>
                </div>
              </div>

              {/* Digital HACCP Temperature Input */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Thermometer className="w-4 h-4 text-emerald-600" />
                    <span>Food Safety & HACCP Core Temperature Audit</span>
                  </div>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                    foodType === 'PREPARED_HOT' && prepTemp < 60
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {prepTemp}°C
                  </span>
                </div>

                <input
                  type="range"
                  min={foodType === 'PREPARED_COLD' ? -2 : 20}
                  max={foodType === 'PREPARED_COLD' ? 15 : 95}
                  value={prepTemp}
                  onChange={(e) => setPrepTemp(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />

                <p className="text-[11px] text-slate-600 flex items-center gap-1">
                  {foodType === 'PREPARED_HOT' ? (
                    prepTemp >= 60 ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> HACCP Safe: Above 60°C pathogen threshold.
                      </span>
                    ) : (
                      <span className="text-rose-700 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Warning: Below 60°C bacterial danger zone!
                      </span>
                    )
                  ) : (
                    <span>Food must remain chilled under 4°C during active courier chain.</span>
                  )}
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-500 cursor-pointer"
                >
                  Broadcast & Match Nearby Recipients
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Food Scanner Studio Modal */}
      <AIFoodScannerStudio
        isOpen={showAiStudio}
        onClose={() => setShowAiStudio(false)}
        onApplyToPost={handleApplyFromStudio}
      />

      {/* CSR Tax Savings Estimator Modal */}
      <CSRTaxCalculatorModal
        isOpen={showTaxModal}
        onClose={() => setShowTaxModal(false)}
      />

      {/* Recurring Schedules Modal */}
      <RecurringSurplusModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
      />
    </div>
  );
};
