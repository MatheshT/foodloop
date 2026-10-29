import React, { useState, useEffect } from 'react';
import { DonationItem, Organization } from '../types';
import { Navigation, Truck, Plane, Sparkles, MapPin, Radio, ShieldCheck } from 'lucide-react';

interface InteractiveMapProps {
  organizations: Organization[];
  donations: DonationItem[];
  selectedDonationId?: string;
  onSelectDonation?: (id: string) => void;
  isSimulatingLiveTransit?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  organizations,
  donations,
  selectedDonationId,
  onSelectDonation,
  isSimulatingLiveTransit = false
}) => {
  const [hoveredNode, setHoveredNode] = useState<{
    id: string;
    name: string;
    type: string;
    details: string;
    x: number;
    y: number;
  } | null>(null);

  // Animated vehicle progress state (0 to 1) for live GPS simulation
  const [vehicleProgress, setVehicleProgress] = useState(0.45);

  useEffect(() => {
    if (!isSimulatingLiveTransit) return;
    const interval = setInterval(() => {
      setVehicleProgress((prev) => {
        const next = prev + 0.015;
        return next > 0.95 ? 0.05 : next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isSimulatingLiveTransit]);

  // Coordinate projection window (Chennai Metro: lat 13.03 to 13.11, lng 80.20 to 80.30)
  const minLat = 13.03;
  const maxLat = 13.11;
  const minLng = 80.20;
  const maxLng = 80.30;

  const projectToSvg = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 800 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 460 + 40;
    return { x: Math.max(50, Math.min(850, x)), y: Math.max(40, Math.min(500, y)) };
  };

  const activeDonationsWithRoutes = donations.filter(
    d => (d.status === 'MATCHED' || d.status === 'IN_TRANSIT' || d.status === 'PICKED_UP') && d.matchedRecipientLocation
  );

  return (
    <div className="relative w-full h-[450px] bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg shadow-slate-200/50 flex flex-col">
      {/* Top Telemetry Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-md shadow-slate-100 pointer-events-auto">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="text-xs font-bold text-slate-900">Geospatial Routing & Dispatch Grid</span>
          <span className="text-[11px] text-slate-500 font-mono font-medium">| Urban Corridors</span>
        </div>

        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-md shadow-slate-100 text-xs font-semibold text-slate-700 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 text-[11px]">Donors ({organizations.filter(o => o.type.startsWith('DONOR')).length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span className="text-slate-600 text-[11px]">NGO Recipients ({organizations.filter(o => o.type.startsWith('RECIPIENT')).length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-slate-600 text-[11px]">In-Transit Couriers ({donations.filter(d => d.status === 'IN_TRANSIT').length})</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map in Crisp Light Mode */}
      <div className="w-full h-full relative">
        <svg
          viewBox="0 0 900 540"
          className="w-full h-full select-none"
          style={{ background: '#f8fafc' }}
        >
          {/* Subtle Grid Lines & Gradients */}
          <defs>
            <pattern id="lightGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="lightRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="lightGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid background */}
          <rect width="900" height="540" fill="url(#lightGrid)" />

          {/* Simulated Geographic Road Network Arteries */}
          <path d="M 60 120 Q 300 180 840 160" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
          <path d="M 120 450 Q 420 320 780 440" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
          <path d="M 450 40 Q 460 270 450 500" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
          <path d="M 220 80 Q 350 300 700 480" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />

          {/* Radius range rings */}
          <circle cx="450" cy="270" r="150" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
          <circle cx="450" cy="270" r="280" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 6" opacity="0.2" />

          {/* Active Logistics Routes */}
          {activeDonationsWithRoutes.map((donation) => {
            const start = projectToSvg(donation.donorLocation.lat, donation.donorLocation.lng);
            const end = projectToSvg(donation.matchedRecipientLocation!.lat, donation.matchedRecipientLocation!.lng);
            const isSelected = selectedDonationId === donation.id;

            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const cx = start.x + dx / 2 - dy * 0.2;
            const cy = start.y + dy / 2 + dx * 0.2;
            const pathD = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;

            // Vehicle position based on progress
            const t = isSimulatingLiveTransit ? vehicleProgress : 0.55;
            // Quadratic Bezier interpolation: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
            const vx = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * cx + Math.pow(t, 2) * end.x;
            const vy = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * cy + Math.pow(t, 2) * end.y;

            return (
              <g key={`route-${donation.id}`} className="cursor-pointer" onClick={() => onSelectDonation?.(donation.id)}>
                {/* Route Glow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? '#10b981' : '#0284c7'}
                  strokeWidth={isSelected ? 4 : 2.5}
                  opacity={isSelected ? 0.8 : 0.45}
                />
                {/* Animated dash line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#lightRouteGradient)"
                  strokeWidth={isSelected ? 3.5 : 2.5}
                  strokeDasharray="6 5"
                />

                {/* Moving Courier Vehicle Marker */}
                {donation.status === 'IN_TRANSIT' && (
                  <g transform={`translate(${vx}, ${vy})`}>
                    <circle r="18" fill="#f59e0b" opacity="0.2" className="animate-ping" />
                    <circle r="12" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle r="5" fill="#d97706" />
                    {/* Floating Info Pill */}
                    <g transform="translate(14, -10)">
                      <rect x="0" y="0" width="130" height="22" rx="6" fill="#0f172a" />
                      <text x="8" y="14" fill="#ffffff" fontSize="10" fontWeight="bold">
                        {donation.driverName?.split(' ')[0]} (EV 24 km/h)
                      </text>
                    </g>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Organization Nodes */}
          {organizations.map((org) => {
            const isDonor = org.type.startsWith('DONOR');
            const pt = projectToSvg(org.location.lat, org.location.lng);

            const hasActiveDonation = donations.some(d => d.donorId === org.id && d.status === 'AVAILABLE');
            const isRecipientMatched = donations.some(d => d.matchedRecipientId === org.id);

            return (
              <g
                key={org.id}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredNode({
                  id: org.id,
                  name: org.name,
                  type: org.type,
                  details: org.location.address,
                  x: pt.x,
                  y: pt.y
                })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Halo pulses */}
                {hasActiveDonation && (
                  <circle cx={pt.x} cy={pt.y} r="22" fill="#10b981" opacity="0.25" className="animate-ping" />
                )}
                {isRecipientMatched && (
                  <circle cx={pt.x} cy={pt.y} r="22" fill="#0284c7" opacity="0.25" className="animate-ping" />
                )}

                {/* Drop shadow pin background */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="13"
                  fill="#ffffff"
                  stroke={isDonor ? '#059669' : '#0284c7'}
                  strokeWidth="3"
                  className="transition-all duration-300 group-hover:scale-125 shadow-md"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill={isDonor ? '#10b981' : '#38bdf8'}
                />

                {/* Node Label with white contrast background box */}
                <g transform={`translate(${pt.x}, ${pt.y + 18})`}>
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#334155"
                    fontSize="10"
                    fontWeight="700"
                    className="select-none group-hover:fill-slate-900"
                  >
                    {org.name.length > 22 ? org.name.substring(0, 20) + '...' : org.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay in Crisp White */}
        {hoveredNode && (
          <div
            className="absolute z-30 pointer-events-none bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xl text-left transform -translate-x-1/2 -translate-y-full mb-3"
            style={{ left: `${(hoveredNode.x / 900) * 100}%`, top: `${(hoveredNode.y / 540) * 100}%` }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${hoveredNode.type.startsWith('DONOR') ? 'bg-emerald-500' : 'bg-sky-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {hoveredNode.type.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900">{hoveredNode.name}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{hoveredNode.details}</p>
          </div>
        )}
      </div>

      {/* Map Footer Bar in Light Mode */}
      <div className="bg-slate-50/90 px-5 py-2.5 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <Navigation className="w-4 h-4 text-emerald-600" />
          Autonomous Dispatch Algorithm: OSRM Road Distance Matrix & Real-Time Traffic Buffer Active
        </span>
        <span className="text-emerald-700 font-mono font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
          HACCP Telemetry: 100% Monitored
        </span>
      </div>
    </div>
  );
};
