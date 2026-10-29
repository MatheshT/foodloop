import React from 'react';
import { DonationItem } from '../types';
import { generateESGVerificationHash } from '../services/esgService';
import { Leaf, Award, ShieldCheck, Printer } from 'lucide-react';

interface ESGCertificateModalProps {
  donation: DonationItem | null;
  onClose: () => void;
}

export const ESGCertificateModal: React.FC<ESGCertificateModalProps> = ({ donation, onClose }) => {
  if (!donation) return null;

  const verificationHash = generateESGVerificationHash(donation.id, donation.weightKg);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
        >
          ✕
        </button>

        {/* Certificate Printable Canvas in Crisp White & Emerald */}
        <div className="border-2 border-emerald-500/40 bg-gradient-to-b from-white via-emerald-50/20 to-white p-7 rounded-2xl relative overflow-hidden shadow-xs">
          {/* Subtle Background Seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Award className="w-80 h-80 text-emerald-800" />
          </div>

          <div className="text-center relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 mx-auto flex items-center justify-center text-emerald-700">
              <Leaf className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] tracking-widest font-mono uppercase text-emerald-800 font-extrabold block">
                FoodLoop Global Sustainability Standard • ISO 14064 Compliant
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Official ESG & Hunger Relief Impact Certificate
              </h2>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
              This certifies that the surplus food batch below was successfully rescued and diverted from landfills, feeding verified vulnerable populations.
            </p>

            {/* Impact Metrics Box in Crisp White */}
            <div className="grid grid-cols-3 gap-3 bg-white border border-emerald-200 rounded-2xl p-3.5 my-4 shadow-sm">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Food Rescued</span>
                <span className="text-base font-extrabold text-emerald-700">{donation.weightKg} kg</span>
                <span className="text-[10px] text-slate-500 block font-medium">({donation.quantityServings} Meals)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">CO₂e Averted</span>
                <span className="text-base font-extrabold text-teal-700">{donation.co2eAvoidedKg} kg</span>
                <span className="text-[10px] text-slate-500 block font-medium">GHG Scope 3</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Water Saved</span>
                <span className="text-base font-extrabold text-sky-700">{donation.waterSavedLiters.toLocaleString()} L</span>
                <span className="text-[10px] text-slate-500 block font-medium">Agricultural saving</span>
              </div>
            </div>

            {/* Entity Transfer Record */}
            <div className="text-left text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-slate-700 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Donor Facility:</span>
                <span className="font-bold text-slate-900">{donation.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Organization:</span>
                <span className="font-bold text-slate-900">{donation.matchedRecipientName || 'Verified Community Kitchen'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cryptographic Seal Hash:</span>
                <span className="font-mono text-emerald-800 font-bold text-[11px]">{verificationHash}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
              <span>Issued Date: {new Date().toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Immutable Audit Verification
              </span>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-4 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Eligible for Corporate Social Responsibility (CSR) Tax Exemption</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
