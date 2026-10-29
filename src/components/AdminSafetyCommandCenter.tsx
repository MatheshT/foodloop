import React, { useState } from 'react';
import { DonationItem, Organization } from '../types';
import { calculateESGMetrics } from '../services/esgService';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Leaf, 
  TrendingUp, 
  Flame, 
  Zap,
  Activity,
  Award,
  Clock,
  Printer
} from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface AdminSafetyCommandCenterProps {
  donations: DonationItem[];
  organizations: Organization[];
  onQuarantineBatch: (donationId: string, reason: string) => void;
  onViewEsg: (donation: DonationItem) => void;
  onViewHaccp: (donation: DonationItem) => void;
}

export const AdminSafetyCommandCenter: React.FC<AdminSafetyCommandCenterProps> = ({
  donations,
  organizations,
  onQuarantineBatch,
  onViewEsg,
  onViewHaccp
}) => {
  const [selectedDayForecast, setSelectedDayForecast] = useState<'TODAY' | 'TOMORROW' | 'WEEKEND'>('TOMORROW');
  const esgMetrics = calculateESGMetrics(donations);

  // Quarantine modal state
  const [quarantineTargetId, setQuarantineTargetId] = useState<string | null>(null);
  const [quarantineReason, setQuarantineReason] = useState('Temperature breach: Ambient dwell time exceeded 90 minutes in danger zone');

  // Simulated Machine Learning Predictive Forecast
  const predictiveHourly = [
    { time: '13:00 - 15:00 (Lunch Rush)', predictedKg: 180, source: 'Buffets & Corporate Canteens', confidence: 94 },
    { time: '17:00 - 19:00 (Tea/Snacks)', predictedKg: 45, source: 'Bakeries & Supermarkets', confidence: 89 },
    { time: '21:30 - 23:30 (Dinner Peak)', predictedKg: 420, source: 'Hostel Messes & Wedding Halls', confidence: 97 },
    { time: '00:00 - 02:00 (Late Night)', predictedKg: 95, source: 'Cloud Kitchens', confidence: 91 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner in Crisp White */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-full bg-emerald-100 text-emerald-800">
                Food Safety Authority & ESG Ledger
              </span>
              <span className="text-xs text-slate-500 font-mono">HACCP Automated Compliance Protocol</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Global Command & Safety Center</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Real-time monitoring of food safety limits, dynamic quarantine controls, and audit-grade ESG reporting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Pathogen Incidents</span>
            </span>
          </div>
        </div>
      </div>

      {/* ESG Impact Stats Grid in Crisp Light Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-md shadow-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">Total Food Diverted</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{esgMetrics.totalWeightRedistributedKg} <span className="text-xs text-slate-500 font-medium">kg</span></p>
          <p className="text-[11px] text-emerald-700 mt-1 font-bold">{esgMetrics.totalServingsRedistributed} healthy meals served</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-md shadow-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">CO₂e Emissions Averted</span>
            <Zap className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-800">{esgMetrics.totalCo2eAvoidedKg} <span className="text-xs text-slate-500 font-medium">kg</span></p>
          <p className="text-[11px] text-teal-700 mt-1 font-bold">{(esgMetrics.totalCo2eAvoidedKg * 2.4).toFixed(0)} passenger car km averted</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-md shadow-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">Water Footprint Saved</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-sky-800">{esgMetrics.totalWaterSavedLiters.toLocaleString()} <span className="text-xs text-slate-500 font-medium">L</span></p>
          <p className="text-[11px] text-sky-700 mt-1 font-bold">Fresh agricultural water preserved</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-md shadow-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold">Landfill Methane Diverted</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-800">{esgMetrics.totalMethaneDivertedKg} <span className="text-xs text-slate-500 font-medium">kg CH₄</span></p>
          <p className="text-[11px] text-amber-700 mt-1 font-bold">99.4% Landfill diversion rate</p>
        </div>
      </div>

      {/* Real-Time Food Safety & Danger Zone Control */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Live HACCP Safety Audits & Risk Control</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">Protocol: FSSAI / FDA / Codex Alimentarius</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="p-3 rounded-l-xl">Donation Batch</th>
                <th className="p-3">Donor / Category</th>
                <th className="p-3">Core Temp</th>
                <th className="p-3">Status</th>
                <th className="p-3">AI Freshness</th>
                <th className="p-3 text-right rounded-r-xl">Safety Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((d) => {
                const latestLog = d.haccpLogs[d.haccpLogs.length - 1];
                const temp = latestLog?.temperatureCelsius || 0;
                const isTempDanger = d.foodType === 'PREPARED_HOT' && temp < 60 && temp > 10;

                return (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">{d.title}</div>
                      <div className="font-mono text-[10px] text-slate-400">{d.id}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 font-semibold">{d.donorName}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{d.foodType.replace('_', ' ')}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-md text-xs ${
                        isTempDanger
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {temp}°C
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        d.status === 'QUARANTINED' ? 'bg-rose-100 text-rose-800' :
                        d.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      {d.aiFreshnessScore}%
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onViewHaccp(d)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Audit Trail
                      </button>

                      {d.status !== 'DELIVERED' && d.status !== 'QUARANTINED' && (
                        <button
                          onClick={() => {
                            soundManager.playAlertTone();
                            setQuarantineTargetId(d.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Immediately divert to anaerobic digester / compost if compromised"
                        >
                          Quarantine
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictive Food Surplus Machine Learning Forecaster */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Predictive AI Surplus Forecaster</h2>
              <p className="text-xs text-slate-500 font-medium">Neural time-series anticipation of surplus spikes across regional kitchens</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            {(['TODAY', 'TOMORROW', 'WEEKEND'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundManager.playNotificationTone();
                  setSelectedDayForecast(tab);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedDayForecast === tab
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {predictiveHourly.map((slot, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-teal-700 font-mono uppercase tracking-wider block font-bold mb-1">
                  {slot.time}
                </span>
                <p className="text-xl font-extrabold text-slate-900">{slot.predictedKg} kg</p>
                <p className="text-xs text-slate-600 mt-1 font-medium">{slot.source}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">ML Confidence:</span>
                <span className="text-emerald-700 font-mono font-extrabold">{slot.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quarantine Modal in Clean White */}
      {quarantineTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-rose-300 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Emergency HACCP Quarantine Trigger</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              This action terminates human consumption routing and diverts the food to registered Biogas / Composting units.
            </p>

            <label className="block text-xs font-bold text-slate-700 mb-1">Quarantine Justification:</label>
            <textarea
              rows={3}
              value={quarantineReason}
              onChange={(e) => setQuarantineReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 mb-4 focus:outline-none focus:border-rose-600 font-medium"
            />

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setQuarantineTargetId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  soundManager.playAlertTone();
                  onQuarantineBatch(quarantineTargetId, quarantineReason);
                  setQuarantineTargetId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Confirm Quarantine Divert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
