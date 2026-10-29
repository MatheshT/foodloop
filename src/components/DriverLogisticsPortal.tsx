import React, { useState, useEffect } from 'react';
import { DonationItem } from '../types';
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Key, 
  QrCode, 
  CheckCircle2, 
  Thermometer, 
  Radio, 
  Sparkles,
  Plane,
  Zap,
  BatteryCharging,
  MessageSquare,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../services/soundEffects';

interface DriverLogisticsPortalProps {
  donations: DonationItem[];
  onPickupDonation: (donationId: string, otp: string, tempCelsius: number) => boolean;
  onDeliverDonation: (donationId: string, qrToken: string) => boolean;
  onViewHaccp: (donation: DonationItem) => void;
}

interface ChatMessage {
  sender: 'driver' | 'donor' | 'recipient';
  text: string;
  time: string;
}

export const DriverLogisticsPortal: React.FC<DriverLogisticsPortalProps> = ({
  donations,
  onPickupDonation,
  onDeliverDonation,
  onViewHaccp
}) => {
  const activeMission = donations.find(
    d => d.status === 'MATCHED' || d.status === 'PICKED_UP' || d.status === 'IN_TRANSIT'
  );

  // Fleet vehicle selection
  const [vehicleMode, setVehicleMode] = useState<'E_BIKE' | 'DRONE' | 'EV_VAN'>('E_BIKE');

  // Form states for pickup
  const [enteredOtp, setEnteredOtp] = useState('');
  const [probeTemp, setProbeTemp] = useState<number>(66.4);
  const [tamperSealChecked, setTamperSealChecked] = useState(true);
  const [visualChecked, setVisualChecked] = useState(true);
  const [pickupError, setPickupError] = useState('');

  // Form states for delivery
  const [enteredToken, setEnteredToken] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  // Live sensor tick simulation
  const [liveTemp, setLiveTemp] = useState(65.1);
  const [batteryPct, setBatteryPct] = useState(94);

  // Live Driver-Kitchen Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'donor', text: 'Food is packed in insulated cambro containers at loading bay 3.', time: '10 mins ago' },
    { sender: 'driver', text: 'On my way! ETA is 7 minutes via EV cargo bike.', time: '8 mins ago' }
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  useEffect(() => {
    if (!activeMission || activeMission.status !== 'IN_TRANSIT') return;
    const interval = setInterval(() => {
      setLiveTemp(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Math.round((prev + delta) * 10) / 10;
      });
      setBatteryPct(prev => Math.max(20, prev - 0.05));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeMission]);

  const handleVerifyPickup = () => {
    if (!activeMission) return;
    setPickupError('');
    const success = onPickupDonation(activeMission.id, enteredOtp.trim(), probeTemp);
    if (!success) {
      soundManager.playAlertTone();
      setPickupError('Invalid 4-Digit Pickup OTP! Check with donor kitchen staff.');
    } else {
      soundManager.playSuccessChime();
      setEnteredOtp('');
    }
  };

  const handleVerifyDelivery = () => {
    if (!activeMission) return;
    setDeliveryError('');
    const success = onDeliverDonation(activeMission.id, enteredToken.trim());
    if (!success) {
      soundManager.playAlertTone();
      setDeliveryError('Invalid Delivery Handshake QR Token! Must match recipient shelter.');
    } else {
      soundManager.playSuccessChime();
      setEnteredToken('');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    soundManager.playNotificationTone();
    setMessages([
      ...messages,
      {
        sender: 'driver',
        text: newMsgText.trim(),
        time: 'Just now'
      }
    ]);
    setNewMsgText('');
  };

  return (
    <div className="space-y-6">
      {/* Driver Cockpit Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-full bg-teal-100 text-teal-800">
                Eco-Fleet Certified Courier
              </span>
              <span className="text-xs text-slate-500 font-mono">Responder ID: FL-408</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Alex Rivera (Active Courier)</h1>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span className="text-teal-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping inline-block" /> GPS Online
              </span>
              <span>•</span>
              <span className="text-slate-700 font-medium">IoT BLE Cold-Chain Sensor: Paired</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">48 Successful Rescues</span>
            </p>
          </div>

          {/* Fleet Mode Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner text-xs font-bold">
            <button
              onClick={() => setVehicleMode('E_BIKE')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                vehicleMode === 'E_BIKE' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Cargo E-Bike</span>
            </button>
            <button
              onClick={() => setVehicleMode('DRONE')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                vehicleMode === 'DRONE' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Air Drone</span>
            </button>
            <button
              onClick={() => setVehicleMode('EV_VAN')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                vehicleMode === 'EV_VAN' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>EV Van</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mission Controller */}
      {activeMission ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">Active Food Rescue Mission</span>
                <h2 className="text-xl font-extrabold text-slate-900">{activeMission.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Volume: {activeMission.quantityServings} servings ({activeMission.weightKg} kg)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-amber-700 block font-bold">Priority Redistribution</span>
                <span className="text-xs text-slate-500 font-medium">{activeMission.storageRequirement}</span>
              </div>
            </div>

            {/* Interactive 5-Step Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-6 text-xs">
              {[
                { num: '1', title: 'Assigned', done: true, current: false },
                { num: '2', title: 'HACCP Audit', done: activeMission.haccpLogs.length >= 2 || activeMission.status !== 'MATCHED', current: activeMission.status === 'MATCHED' },
                { num: '3', title: 'Donor OTP', done: activeMission.status === 'PICKED_UP' || activeMission.status === 'IN_TRANSIT' || activeMission.status === 'DELIVERED', current: activeMission.status === 'MATCHED' },
                { num: '4', title: 'In Transit', done: activeMission.status === 'DELIVERED', current: activeMission.status === 'IN_TRANSIT' || activeMission.status === 'PICKED_UP' },
                { num: '5', title: 'NGO Handshake', done: activeMission.status === 'DELIVERED', current: activeMission.status === 'IN_TRANSIT' }
              ].map((step) => (
                <div
                  key={step.num}
                  className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                    step.done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                      : step.current
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px]">STEP {step.num}</span>
                    {step.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  </div>
                  <span className="font-extrabold text-slate-800 text-[11px]">{step.title}</span>
                </div>
              ))}
            </div>

            {/* Mission Details & Route Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>PICKUP LOCATION (DONOR)</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">{activeMission.donorName}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{activeMission.donorLocation.address}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sky-700 font-bold text-xs mb-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>DESTINATION SHELTER (RECIPIENT)</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900">{activeMission.matchedRecipientName}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{activeMission.matchedRecipientLocation?.address}</p>
              </div>
            </div>

            {/* Action Zone: Step 2 & 3 for MATCHED */}
            {activeMission.status === 'MATCHED' && (
              <div className="bg-amber-50/60 border border-amber-300/80 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                  <Thermometer className="w-5 h-5 text-amber-700" />
                  <span>Perform On-Site HACCP Safety Audit & Handshake</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-800 font-bold">Digital Infrared Probe Reading (°C):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={probeTemp}
                        onChange={(e) => setProbeTemp(parseFloat(e.target.value) || 0)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-sm w-32 shadow-xs"
                      />
                      <span className="text-slate-600 font-medium">
                        {activeMission.foodType === 'PREPARED_HOT' ? 'Must be >= 60°C' : 'Must be <= 4°C'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-800 font-bold">Enter Donor 4-Digit Pickup OTP:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 8492"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-lg font-extrabold tracking-widest text-center w-36 shadow-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">(Ask kitchen staff)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-700 pt-2 font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tamperSealChecked}
                      onChange={(e) => setTamperSealChecked(e.target.checked)}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Tamper-evident seals intact & containers sanitized</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visualChecked}
                      onChange={(e) => setVisualChecked(e.target.checked)}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Sensory aroma & appearance inspection passed</span>
                  </label>
                </div>

                {pickupError && (
                  <p className="text-xs text-rose-700 font-bold">{pickupError}</p>
                )}

                <button
                  onClick={handleVerifyPickup}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Pickup & Begin Cold-Chain Delivery Transit</span>
                </button>
              </div>
            )}

            {/* Action Zone: Step 4 & 5 for IN_TRANSIT */}
            {(activeMission.status === 'PICKED_UP' || activeMission.status === 'IN_TRANSIT') && (
              <div className="bg-sky-50/60 border border-sky-300 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm">
                    <Radio className="w-5 h-5 text-sky-600 animate-pulse" />
                    <span>Real-Time In-Transit Cold-Chain Telemetry Stream</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono font-medium">
                    <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    <span>Sensor FL-889 • {batteryPct.toFixed(0)}% Battery</span>
                  </div>
                </div>

                {/* Telemetry Display */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">Container Core Temperature</span>
                    <span className="text-2xl font-extrabold font-mono text-emerald-700">
                      {activeMission.foodType === 'PREPARED_HOT' ? `${liveTemp}°C` : '3.6°C'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] font-bold">Pathogen Risk Audit</span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Pathogen Safe
                    </span>
                  </div>
                </div>

                {/* Recipient Handshake Verification Form */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Scan / Enter Recipient NGO Delivery QR Token:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`e.g. ${activeMission.deliveryQrToken}`}
                      value={enteredToken}
                      onChange={(e) => setEnteredToken(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono text-xs shadow-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playNotificationTone();
                        setEnteredToken(activeMission.deliveryQrToken);
                      }}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      title="Simulate scanning QR directly from shelter device"
                    >
                      Simulate QR Scan
                    </button>
                  </div>

                  {deliveryError && (
                    <p className="text-xs text-rose-700 font-bold">{deliveryError}</p>
                  )}

                  <button
                    onClick={handleVerifyDelivery}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Finalize Delivery Handshake & Issue ESG Certificate</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Driver-Kitchen Mission Chat */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-md shadow-slate-100 flex flex-col h-[520px]">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Mission Comms Channel</h3>
                <p className="text-[11px] text-slate-500 font-medium">Direct Kitchen & Shelter Dispatch</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'driver' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">
                    {m.sender}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed font-medium shadow-xs ${
                      m.sender === 'driver'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Message kitchen staff..."
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-teal-600"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
          <Truck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-slate-800 font-bold mb-1">No Active Fleet Missions Currently</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Switch to the <strong>Recipient NGO</strong> or <strong>Donor</strong> tab to claim a batch and dispatch a courier mission!
          </p>
        </div>
      )}
    </div>
  );
};
