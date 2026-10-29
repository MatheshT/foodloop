import React, { useState } from 'react';
import { DonationItem, Organization, MatchScoreResult } from '../types';
import { computeMatchScore } from '../services/matchingEngine';
import { 
  HeartHandshake, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Flame, 
  Snowflake, 
  Truck, 
  Split,
  Search,
  Filter
} from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface RecipientPortalProps {
  donations: DonationItem[];
  recipientOrg: Organization;
  onClaimDonation: (donationId: string, recipientOrg: Organization) => void;
  onViewHaccp: (donation: DonationItem) => void;
  onViewEsg: (donation: DonationItem) => void;
}

export const RecipientPortal: React.FC<RecipientPortalProps> = ({
  donations,
  recipientOrg,
  onClaimDonation,
  onViewHaccp,
  onViewEsg
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchScoreResult | null>(null);
  const [qrModalDonation, setQrModalDonation] = useState<DonationItem | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'HOT' | 'COLD' | 'DRY'>('ALL');

  // Available donations filtered for this recipient
  const availableDonations = donations.filter(d => {
    if (d.status !== 'AVAILABLE') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = d.title.toLowerCase().includes(q);
      const matchesDonor = d.donorName.toLowerCase().includes(q);
      const matchesCuisine = d.cuisine?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDonor && !matchesCuisine) return false;
    }
    if (selectedCategory === 'HOT' && d.foodType !== 'PREPARED_HOT') return false;
    if (selectedCategory === 'COLD' && d.foodType !== 'PREPARED_COLD') return false;
    if (selectedCategory === 'DRY' && d.foodType !== 'PACKAGED_DRY') return false;
    return true;
  });

  // Donations claimed by or in transit to this recipient
  const myIncomingDonations = donations.filter(
    d => d.matchedRecipientId === recipientOrg.id
  );

  const handleClaim = (donationId: string) => {
    soundManager.playSuccessChime();
    onClaimDonation(donationId, recipientOrg);
  };

  return (
    <div className="space-y-6">
      {/* Recipient Profile Banner in Crisp White */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-full bg-sky-100 text-sky-800">
                Verified Recipient Organization
              </span>
              <span className="text-xs text-slate-500 font-mono">Reg: {recipientOrg.licenseNumber}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{recipientOrg.name}</h1>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>{recipientOrg.location.address}</span>
              <span>•</span>
              <span className="text-sky-700 font-bold">Intake Capacity: {recipientOrg.capacityServings} servings</span>
              <span>•</span>
              <span className="text-slate-700 font-medium">Cold Chain: {recipientOrg.hasColdStorage ? '✅ Available' : '❌ Ambient Only'}</span>
            </p>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-2xl px-5 py-3 text-right">
            <span className="text-[10px] text-sky-700 uppercase tracking-wider block font-bold">Active Deliveries</span>
            <span className="text-xl font-extrabold text-sky-900">
              {myIncomingDonations.filter(d => d.status !== 'DELIVERED').length} Incoming
            </span>
          </div>
        </div>
      </div>

      {/* Active Deliveries En Route to This Recipient */}
      {myIncomingDonations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900">Incoming Deliveries & Secure Handshake</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myIncomingDonations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white border border-sky-200/90 rounded-3xl p-6 shadow-md shadow-sky-50 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-sky-100 text-sky-800 mb-1 inline-block">
                      {donation.status.replace('_', ' ')}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">{donation.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">From: {donation.donorName}</p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playNotificationTone();
                      setQrModalDonation(donation);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-300 hover:bg-sky-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <QrCode className="w-4 h-4 text-sky-600" />
                    <span>Show Delivery QR</span>
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2 text-xs mb-3 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Courier Assigned:</span>
                    <span className="text-slate-900 font-bold">{donation.driverName || 'Dispatching Eco-Fleet...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Volume:</span>
                    <span className="text-emerald-700 font-extrabold">{donation.quantityServings} servings ({donation.weightKg} kg)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Delivery Status:</span>
                    <span className="text-sky-800 font-mono font-bold">
                      {donation.status === 'DELIVERED' ? 'Successfully Received & Verified' : 'In Transit / Courier Dispatched'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onViewHaccp(donation)}
                    className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>View HACCP Safety Pass</span>
                  </button>

                  <button
                    onClick={() => onViewEsg(donation)}
                    className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold transition-colors cursor-pointer"
                  >
                    <span>View ESG Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Surplus Radar Header & Filters */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Surplus Discovery Radar</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {availableDonations.length} Available
            </span>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              {(['ALL', 'HOT', 'COLD', 'DRY'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {availableDonations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-700 font-bold">No surplus batches found matching your filter</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or food category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableDonations.map((donation) => {
              const matchResult = computeMatchScore(donation, recipientOrg);
              const isLargeBatch = donation.quantityServings > (recipientOrg.capacityServings || 100);

              return (
                <div
                  key={donation.id}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-6 shadow-md shadow-slate-100 flex flex-col justify-between transition-all group"
                >
                  <div>
                    {/* Top Match Score & Category */}
                    <div className="flex items-start justify-between gap-2 mb-3">
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

                      {/* Intelligent Match Score Pill */}
                      <div
                        onClick={() => {
                          soundManager.playNotificationTone();
                          setSelectedMatch(matchResult);
                        }}
                        className="cursor-pointer flex items-center gap-1 bg-emerald-50 border border-emerald-300 hover:border-emerald-500 px-3 py-1 rounded-xl text-emerald-800 font-extrabold text-xs transition-all shadow-xs"
                        title="Click to view AI matching formula breakdown"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{matchResult.totalScore}% Match</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                      {donation.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 font-medium">{donation.donorName}</p>

                    <img
                      src={donation.imageUrl}
                      alt={donation.title}
                      className="w-full h-36 object-cover rounded-2xl border border-slate-200 mb-3"
                    />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block">Quantity</span>
                        <span className="font-bold text-slate-900">{donation.quantityServings} servings</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block">Distance & ETA</span>
                        <span className="font-bold text-slate-900">{matchResult.distanceKm} km (~{matchResult.estimatedTransitMinutes}m)</span>
                      </div>
                    </div>

                    {/* Split Allocation Indicator if large */}
                    {isLargeBatch && (
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 p-2 rounded-xl mb-3 text-[11px] text-amber-800 font-medium">
                        <Split className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Smart Split Eligible: Will balance across secondary community centers if claimed</span>
                      </div>
                    )}

                    {/* Reasoning Snippet */}
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-4 border border-slate-200">
                      <span className="text-emerald-700 font-bold">Why it fits: </span>
                      {matchResult.reasoning[0]}
                    </div>
                  </div>

                  {/* Claim Button */}
                  <button
                    onClick={() => handleClaim(donation.id)}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Claim Donation & Dispatch Fleet</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Match Breakdown Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Multi-Objective Matching Breakdown</span>
              </h3>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-900">Composite Match Score</span>
                <span className="text-xl font-extrabold text-emerald-700">{selectedMatch.totalScore} / 100</span>
              </div>

              <div className="space-y-2 text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span>Proximity / Distance ({selectedMatch.distanceKm} km):</span>
                  <span className="font-mono font-bold text-emerald-700">ETA ~{selectedMatch.estimatedTransitMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Safe Shelf-Life Score:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedMatch.timeDecayScore}% safe buffer</span>
                </div>
                <div className="flex justify-between">
                  <span>Intake Capacity Alignment:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedMatch.capacityMatchScore}% optimal</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Chain Compatibility:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedMatch.storageCompatible ? '100% Compliant' : 'Storage Warning'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-slate-900 font-bold mb-1.5">Algorithmic Justification:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {selectedMatch.reasoning.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery QR Modal */}
      {qrModalDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Delivery Handshake QR</h3>
            <p className="text-xs text-slate-500 mb-4">
              Present this token to the volunteer courier upon arrival to confirm safe dropoff
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-200 shadow-inner mb-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrModalDonation.deliveryQrToken)}`}
                alt="Delivery Handshake QR"
                className="w-44 h-44 mx-auto rounded-xl"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-4 text-xs font-mono font-bold text-sky-800">
              Token: {qrModalDonation.deliveryQrToken}
            </div>

            <button
              onClick={() => setQrModalDonation(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
