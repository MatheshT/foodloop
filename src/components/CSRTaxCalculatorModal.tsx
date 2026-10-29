import React, { useState } from 'react';
import { Calculator, DollarSign, Award, Leaf, Download, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface CSRTaxCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CSRTaxCalculatorModal: React.FC<CSRTaxCalculatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [monthlyMeals, setMonthlyMeals] = useState<number>(3500);
  const [costBasisPerMeal, setCostBasisPerMeal] = useState<number>(3.5); // USD or approx INR equivalent normalized
  const [corporateTaxRate, setCorporateTaxRate] = useState<number>(25); // 25% corporate tax rate

  // US IRC §170(e)(3) / India Section 80G enhanced deduction formula:
  // Fair market value deduction = Cost basis + 50% of markup (up to 2x cost)
  const annualMeals = monthlyMeals * 12;
  const rawCostBasis = annualMeals * costBasisPerMeal;
  const enhancedDeductionValuation = rawCostBasis * 1.5; // 150% valuation permitted by law
  const totalTaxSavings = enhancedDeductionValuation * (corporateTaxRate / 100);
  const carbonOffsetKg = annualMeals * 0.4 * 2.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-6 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Corporate Tax & CSR Savings Estimator</h2>
              <p className="text-xs text-slate-500 font-medium">Under US IRC §170(e)(3) & India Section 80G Provisions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Estimated Monthly Surplus Meals Donated:</span>
              <span className="font-mono text-emerald-700 text-sm font-extrabold">{monthlyMeals.toLocaleString()} meals</span>
            </div>
            <input
              type="range"
              min={200}
              max={25000}
              step={100}
              value={monthlyMeals}
              onChange={(e) => setMonthlyMeals(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Average Production Cost Basis per Meal:</span>
              <span className="font-mono text-emerald-700 text-sm font-extrabold">${costBasisPerMeal.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={15.0}
              step={0.5}
              value={costBasisPerMeal}
              onChange={(e) => setCostBasisPerMeal(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Corporate Income Tax Bracket (%):</span>
              <span className="font-mono text-emerald-700 text-sm font-extrabold">{corporateTaxRate}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={35}
              value={corporateTaxRate}
              onChange={(e) => setCorporateTaxRate(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Results Bento Box in Clean White */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-3xl p-5 space-y-3 mt-4">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
              Projected Annual Financial & Environmental Return
            </span>

            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block">Annual Tax Deductible Value</span>
                <span className="text-xl font-extrabold text-slate-900">
                  ${enhancedDeductionValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">150% Enhanced Basis</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block">Net Corporate Cash Savings</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  ${totalTaxSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Direct tax credit offset</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <Leaf className="w-3.5 h-3.5" />
                <span>Annual Carbon Diversion: {carbonOffsetKg.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg CO₂e</span>
              </span>
              <span className="font-bold text-slate-800">CSR Rating: Tier 1 Gold</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            FoodLoop automatically generates audit-ready ESG & 80G tax summaries.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
