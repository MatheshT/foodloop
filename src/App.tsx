import React, { useState, useEffect } from 'react';
import { UserRole, DonationItem, Organization } from './types';
import { INITIAL_ORGANIZATIONS, INITIAL_DONATIONS } from './mockData';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { DonorPortal } from './components/DonorPortal';
import { RecipientPortal } from './components/RecipientPortal';
import { DriverLogisticsPortal } from './components/DriverLogisticsPortal';
import { AdminSafetyCommandCenter } from './components/AdminSafetyCommandCenter';
import { HACCPModal } from './components/HACCPModal';
import { ESGCertificateModal } from './components/ESGCertificateModal';
import { 
  apiFetchDonations, 
  apiCreateDonation, 
  apiClaimDonation, 
  apiPickupDonation, 
  apiDeliverDonation, 
  apiQuarantineDonation,
  apiResetDatabase 
} from './services/apiClient';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('DONOR');
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [donations, setDonations] = useState<DonationItem[]>(() => {
    const cached = localStorage.getItem('foodloop_donations');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return INITIAL_DONATIONS;
  });

  // Live GPS vehicle animation toggle
  const [isSimulatingLiveTransit, setIsSimulatingLiveTransit] = useState(true);

  // Selected organizations for demo context
  const donorOrg = organizations.find(o => o.id === 'donor-1') || organizations[0];
  const recipientOrg = organizations.find(o => o.id === 'recip-1') || organizations[4];

  // Modals state
  const [selectedDonationForMap, setSelectedDonationForMap] = useState<string | undefined>(donations[0]?.id);
  const [viewingHaccpDonation, setViewingHaccpDonation] = useState<DonationItem | null>(null);
  const [viewingEsgDonation, setViewingEsgDonation] = useState<DonationItem | null>(null);

  // Sync initial state from backend on mount
  useEffect(() => {
    apiFetchDonations().then(data => {
      if (data && data.length > 0) {
        setDonations(data);
      }
    });
  }, []);

  // Save to localStorage whenever donations change
  useEffect(() => {
    localStorage.setItem('foodloop_donations', JSON.stringify(donations));
  }, [donations]);

  // Handlers
  const handleAddDonation = (newDonation: DonationItem) => {
    setDonations([newDonation, ...donations]);
    setSelectedDonationForMap(newDonation.id);
    apiCreateDonation(newDonation);
  };

  const handleClaimDonation = (donationId: string, claimantOrg: Organization) => {
    setDonations(prev =>
      prev.map(d => {
        if (d.id === donationId) {
          return {
            ...d,
            status: 'MATCHED',
            matchedRecipientId: claimantOrg.id,
            matchedRecipientName: claimantOrg.name,
            matchedRecipientLocation: claimantOrg.location,
            driverId: 'drv-1',
            driverName: 'Alex Rivera',
            driverVehicleType: 'Eco Cargo E-Bike (Active Cold Pouch)',
            currentCourierLocation: {
              lat: (d.donorLocation.lat + claimantOrg.location.lat) / 2,
              lng: (d.donorLocation.lng + claimantOrg.location.lng) / 2
            }
          };
        }
        return d;
      })
    );
    apiClaimDonation(donationId, claimantOrg);
  };

  const handlePickupDonation = (donationId: string, otp: string, tempCelsius: number): boolean => {
    const target = donations.find(d => d.id === donationId);
    if (!target) return false;

    if (target.pickupOtp !== otp) {
      return false;
    }

    setDonations(prev =>
      prev.map(d => {
        if (d.id === donationId) {
          return {
            ...d,
            status: 'IN_TRANSIT',
            haccpLogs: [
              ...d.haccpLogs,
              {
                id: `haccp-pickup-${Date.now()}`,
                stage: 'PICKUP_INSPECTION',
                timestamp: new Date().toISOString(),
                temperatureCelsius: tempCelsius,
                visualIntegrityPass: true,
                smellSensoryPass: true,
                tamperSealIntact: true,
                inspectorName: `${d.driverName || 'Volunteer Driver'} (Certified Courier)`,
                notes: `Core probe temp recorded at ${tempCelsius}°C. Tamper-proof thermal seal confirmed.`
              }
            ]
          };
        }
        return d;
      })
    );
    apiPickupDonation(donationId, otp, tempCelsius);
    return true;
  };

  const handleDeliverDonation = (donationId: string, qrToken: string): boolean => {
    const target = donations.find(d => d.id === donationId);
    if (!target) return false;

    if (target.deliveryQrToken !== qrToken) {
      return false;
    }

    setDonations(prev =>
      prev.map(d => {
        if (d.id === donationId) {
          return {
            ...d,
            status: 'DELIVERED',
            haccpLogs: [
              ...d.haccpLogs,
              {
                id: `haccp-delivery-${Date.now()}`,
                stage: 'DELIVERY_ACCEPTANCE',
                timestamp: new Date().toISOString(),
                temperatureCelsius: d.foodType === 'PREPARED_HOT' ? 62.8 : 3.9,
                visualIntegrityPass: true,
                smellSensoryPass: true,
                tamperSealIntact: true,
                inspectorName: `${d.matchedRecipientName || 'NGO Intake Officer'}`,
                notes: 'Food delivered safely within required temperature window. Immediate distribution underway.'
              }
            ]
          };
        }
        return d;
      })
    );
    apiDeliverDonation(donationId, qrToken);
    return true;
  };

  const handleQuarantineBatch = (donationId: string, reason: string) => {
    setDonations(prev =>
      prev.map(d => {
        if (d.id === donationId) {
          return {
            ...d,
            status: 'QUARANTINED',
            quarantineReason: reason,
            haccpLogs: [
              ...d.haccpLogs,
              {
                id: `haccp-quarantine-${Date.now()}`,
                stage: 'TRANSIT_TELEMETRY',
                timestamp: new Date().toISOString(),
                temperatureCelsius: 48.0,
                visualIntegrityPass: false,
                smellSensoryPass: false,
                tamperSealIntact: true,
                inspectorName: 'Autonomous Food Safety Algorithmic Monitor',
                notes: `QUARANTINE ENFORCED: ${reason}. Diverted to Biogas anaerobic digester.`
              }
            ]
          };
        }
        return d;
      })
    );
    apiQuarantineDonation(donationId, reason);
  };

  const handleTriggerSurge = () => {
    const surgeItem: DonationItem = {
      id: `DON-${new Date().getFullYear()}-${Math.floor(500 + Math.random() * 400)}`,
      donorId: 'donor-1',
      donorName: 'The Grand Regency Banquet & Hotel',
      donorType: 'Luxury Banquet Catering',
      donorLocation: {
        lat: 13.0827,
        lng: 80.2707,
        address: '142 Grand Trunk Blvd, Metro Central'
      },
      title: 'Convention Banquet Surplus: Royal Pulao & Vegetable Jalfrezi',
      foodType: 'PREPARED_HOT',
      cuisine: 'Indian Royal Festive',
      quantityServings: 280,
      weightKg: 95.0,
      preparedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      safeUntilDeadline: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
      storageRequirement: 'Commercial Thermal Cabinets (> 60°C)',
      allergens: ['Dairy (Butter)'],
      dietaryTags: ['Vegetarian', 'Nut-Free'],
      imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80',
      aiFreshnessScore: 97,
      aiShelfLifeConfidence: 'Optimal Freshness',
      status: 'AVAILABLE',
      pickupOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryQrToken: `FOODLOOP-VERIFIED-SURGE-${Date.now().toString(36).toUpperCase()}`,
      haccpLogs: [
        {
          id: `haccp-surge-${Date.now()}`,
          stage: 'PREPARATION',
          timestamp: new Date().toISOString(),
          temperatureCelsius: 69.4,
          visualIntegrityPass: true,
          smellSensoryPass: true,
          tamperSealIntact: true,
          inspectorName: 'Chef Vikram Rao',
          notes: 'Freshly packed from corporate convention lunch buffet reserve.'
        }
      ],
      co2eAvoidedKg: 237.5,
      waterSavedLiters: 79800
    };

    setDonations([surgeItem, ...donations]);
    setSelectedDonationForMap(surgeItem.id);
    apiCreateDonation(surgeItem);
  };

  const handleResetDemo = () => {
    setDonations(INITIAL_DONATIONS);
    setSelectedDonationForMap(INITIAL_DONATIONS[0].id);
    apiResetDatabase();
  };

  const activeSurplusCount = donations.filter(d => d.status === 'AVAILABLE').length;
  const inTransitCount = donations.filter(d => d.status === 'IN_TRANSIT').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        activeSurplusCount={activeSurplusCount}
        inTransitCount={inTransitCount}
        onResetDemo={handleResetDemo}
        onTriggerSurge={handleTriggerSurge}
        isSimulatingLiveTransit={isSimulatingLiveTransit}
        onToggleLiveSimulation={() => setIsSimulatingLiveTransit(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Interactive Autonomous Proximity Map */}
        <div>
          <InteractiveMap
            organizations={organizations}
            donations={donations}
            selectedDonationId={selectedDonationForMap}
            onSelectDonation={(id) => setSelectedDonationForMap(id)}
            isSimulatingLiveTransit={isSimulatingLiveTransit}
          />
        </div>

        {/* Dynamic Role Views */}
        <div>
          {currentRole === 'DONOR' && (
            <DonorPortal
              donations={donations}
              donorOrg={donorOrg}
              onAddDonation={handleAddDonation}
              onViewHaccp={(d) => setViewingHaccpDonation(d)}
              onViewEsg={(d) => setViewingEsgDonation(d)}
            />
          )}

          {currentRole === 'RECIPIENT' && (
            <RecipientPortal
              donations={donations}
              recipientOrg={recipientOrg}
              onClaimDonation={handleClaimDonation}
              onViewHaccp={(d) => setViewingHaccpDonation(d)}
              onViewEsg={(d) => setViewingEsgDonation(d)}
            />
          )}

          {currentRole === 'DRIVER' && (
            <DriverLogisticsPortal
              donations={donations}
              onPickupDonation={handlePickupDonation}
              onDeliverDonation={handleDeliverDonation}
              onViewHaccp={(d) => setViewingHaccpDonation(d)}
            />
          )}

          {currentRole === 'ADMIN' && (
            <AdminSafetyCommandCenter
              donations={donations}
              organizations={organizations}
              onQuarantineBatch={handleQuarantineBatch}
              onViewEsg={(d) => setViewingEsgDonation(d)}
              onViewHaccp={(d) => setViewingHaccpDonation(d)}
            />
          )}
        </div>
      </main>

      {/* Footer in Crisp White */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 text-center shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">© 2026 FoodLoop Autonomous Surplus Food Redistribution System • Zero Hunger (UN SDG 2) & Climate Action (UN SDG 13)</p>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span>HACCP Rule Engine v4.2</span>
            <span>•</span>
            <span>AI Dynamic Shelf-Life Computer Vision</span>
            <span>•</span>
            <span>Dual Handshake QR Cryptography</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HACCPModal
        donation={viewingHaccpDonation}
        onClose={() => setViewingHaccpDonation(null)}
      />

      <ESGCertificateModal
        donation={viewingEsgDonation}
        onClose={() => setViewingEsgDonation(null)}
      />
    </div>
  );
};
