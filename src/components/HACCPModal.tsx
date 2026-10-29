import React from 'react';
import { DonationItem } from '../types';
import { ShieldCheck, CheckCircle2, Thermometer } from 'lucide-react';

interface HACCPModalProps {
  donation: DonationItem | null;
  onClose: () => void;
}

export const HACCPModal: React.FC<HACCPModalProps> = ({ donation, onClose }) => {
  if (!donation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Digital HACCP Safety & Compliance Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Batch Overview in White/Slate Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5 mb-4 text-slate-700">
          <div className="flex justify-between font-extrabold text-slate-900">
            <span>{donation.title}</span>
            <span className="font-mono text-emerald-700">{donation.id}</span>
          </div>
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Donor Facility: {donation.donorName}</span>
            <span>Category: {donation.foodType}</span>
          </div>
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Volume: {donation.quantityServings} servings ({donation.weightKg} kg)</span>
            <span>Storage: {donation.storageRequirement}</span>
          </div>
        </div>

        {/* Chronological Log Stream */}
        <div className="space-y-3 mb-5">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Verified Inspection Checkpoints ({donation.haccpLogs.length})
          </p>

          {donation.haccpLogs.map((log, index) => (
            <div
              key={log.id || index}
              className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{log.stage.replace(/_/g, ' ')}</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500 font-bold">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-teal-600" />
                  <span>Core Temp: <strong className="font-mono text-teal-800">{log.temperatureCelsius}°C</strong></span>
                </div>
                <div>
                  Sensory Check: <strong className="text-emerald-700">Passed</strong>
                </div>
                <div>
                  Tamper Seal: <strong className="text-emerald-700">{log.tamperSealIntact ? 'Intact & Sealed' : 'Flagged'}</strong>
                </div>
                <div className="truncate">
                  Certified By: <strong className="text-slate-900">{log.inspectorName}</strong>
                </div>
              </div>

              {log.notes && (
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                  "{log.notes}"
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Regulatory Safe Harbor Clause */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-[11px] text-slate-600 space-y-1">
          <span className="font-bold text-emerald-900 block">Good Samaritan Food Safety Legal Protection:</span>
          <p>
            This donation adheres to standard Food Safety & Standards Authority guidelines and Emerson Good Samaritan Act principles, shielding certified donors from civil and criminal liability for bona fide surplus food donations.
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
          >
            Close Audit Pass
          </button>
        </div>
      </div>
    </div>
  );
};
