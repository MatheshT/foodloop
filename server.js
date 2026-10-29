import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const SEED_DATA = {
  organizations: [
    {
      id: 'donor-1',
      name: 'The Grand Regency Banquet & Hotel',
      type: 'DONOR_RESTAURANT',
      verified: true,
      licenseNumber: 'FSSAI-10023011009842',
      location: { lat: 13.0827, lng: 80.2707, address: '142 Grand Trunk Blvd, Metro Central' },
      contactPerson: 'Executive Chef Vikram Rao',
      phone: '+91 98401 23456',
    },
    {
      id: 'donor-2',
      name: 'SRM University Mega-Hostel Mess #3',
      type: 'DONOR_HOSTEL',
      verified: true,
      licenseNumber: 'FSSAI-11222044001923',
      location: { lat: 13.0604, lng: 80.2496, address: 'Hostel Block C, SRM Tech Campus' },
      contactPerson: 'Mess Warden Ramanathan K.',
      phone: '+91 98405 88910',
    },
    {
      id: 'donor-3',
      name: 'GreenBite Corporate Cloud Kitchens',
      type: 'DONOR_CATERER',
      verified: true,
      licenseNumber: 'FSSAI-10021022003411',
      location: { lat: 13.0950, lng: 80.2850, address: 'Unit 4B, Cyber Towers Hub' },
      contactPerson: 'Anita Sundaram',
      phone: '+91 97890 11223',
    },
    {
      id: 'donor-4',
      name: 'FreshMart Organics Superstore',
      type: 'DONOR_SUPERMARKET',
      verified: true,
      licenseNumber: 'FSSAI-10020011008821',
      location: { lat: 13.0450, lng: 80.2250, address: 'Bay 12, South Avenue Mall' },
      contactPerson: 'Farhan Akhtar',
      phone: '+91 98200 44556',
    },
    {
      id: 'recip-1',
      name: 'Mother Teresa Hope Shelter & Care Home',
      type: 'RECIPIENT_SHELTER',
      verified: true,
      licenseNumber: 'NGO-TN-2018-88392',
      location: { lat: 13.0780, lng: 80.2610, address: '88 St. Mary Road, Alwarpet' },
      contactPerson: 'Sister Mary Angela',
      phone: '+91 94441 55678',
      capacityServings: 180,
      hasColdStorage: true,
      dietaryRestrictions: ['VEG_AND_NON_VEG', 'HALAL'],
    },
    {
      id: 'recip-2',
      name: 'Akshaya Seva Community Kitchen',
      type: 'RECIPIENT_COMMUNITY_KITCHEN',
      verified: true,
      licenseNumber: 'NGO-TN-2015-11029',
      location: { lat: 13.0520, lng: 80.2410, address: '24 Anna Nagar Main Way' },
      contactPerson: 'Gopalakrishnan Swamy',
      phone: '+91 94440 99881',
      capacityServings: 500,
      hasColdStorage: true,
      dietaryRestrictions: ['PURE_VEG'],
    },
    {
      id: 'recip-3',
      name: 'Little Angels Orphanage & Learning Center',
      type: 'RECIPIENT_SHELTER',
      verified: true,
      licenseNumber: 'NGO-TN-2020-44910',
      location: { lat: 13.0910, lng: 80.2790, address: '15 Gandhi Nagar 2nd Street' },
      contactPerson: 'Devi Meenakshi',
      phone: '+91 98402 77112',
      capacityServings: 85,
      hasColdStorage: false,
      dietaryRestrictions: ['VEG_AND_NON_VEG'],
    },
    {
      id: 'recip-4',
      name: 'Urban Slum Uplift & Hunger Relief Foundation',
      type: 'RECIPIENT_FOODBANK',
      verified: true,
      licenseNumber: 'NGO-TN-2019-33821',
      location: { lat: 13.0380, lng: 80.2190, address: 'Sector 5 Transit Campsite' },
      contactPerson: 'Karthik Raja',
      phone: '+91 97910 88344',
      capacityServings: 320,
      hasColdStorage: true,
      dietaryRestrictions: ['VEG_AND_NON_VEG'],
    }
  ],
  donations: [
    {
      id: 'DON-2026-081',
      donorId: 'donor-1',
      donorName: 'The Grand Regency Banquet & Hotel',
      donorType: 'Luxury Banquet Catering',
      donorLocation: { lat: 13.0827, lng: 80.2707, address: '142 Grand Trunk Blvd, Metro Central' },
      title: 'Gourmet Basmati Biryani & Paneer Butter Masala',
      foodType: 'PREPARED_HOT',
      cuisine: 'North Indian / Mughlai',
      quantityServings: 140,
      weightKg: 45.5,
      preparedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      safeUntilDeadline: new Date(Date.now() + 155 * 60 * 1000).toISOString(),
      storageRequirement: 'Insulated Hot-Box (Keep > 60°C)',
      allergens: ['Dairy (Paneer)', 'Cashews'],
      dietaryTags: ['Vegetarian', 'Nutrient-Dense'],
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      aiFreshnessScore: 96,
      aiShelfLifeConfidence: 'Optimal (Freshly cooked buffet reserves)',
      status: 'AVAILABLE',
      pickupOtp: '8492',
      deliveryQrToken: 'FOODLOOP-VERIFIED-DON2026081',
      haccpLogs: [
        {
          id: 'haccp-1',
          stage: 'PREPARATION',
          timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
          temperatureCelsius: 68.5,
          visualIntegrityPass: true,
          smellSensoryPass: true,
          tamperSealIntact: true,
          inspectorName: 'Chef Vikram Rao (FSSAI Certified)',
          notes: 'Held in commercial food-grade thermal containers at 68.5°C'
        }
      ],
      co2eAvoidedKg: 113.75,
      waterSavedLiters: 38220,
    },
    {
      id: 'DON-2026-082',
      donorId: 'donor-2',
      donorName: 'SRM University Mega-Hostel Mess #3',
      donorType: 'Hostel Mega-Kitchen',
      donorLocation: { lat: 13.0604, lng: 80.2496, address: 'Hostel Block C, SRM Tech Campus' },
      title: 'Wholesome Sambar Rice, Steamed Idlis & Mix Veg Poriyal',
      foodType: 'PREPARED_HOT',
      cuisine: 'South Indian Traditional',
      quantityServings: 220,
      weightKg: 78.0,
      preparedAt: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
      safeUntilDeadline: new Date(Date.now() + 110 * 60 * 1000).toISOString(),
      storageRequirement: 'Stainless Steel Insulated Vessels',
      allergens: ['Mustard Seeds'],
      dietaryTags: ['Pure Vegetarian', 'Gluten-Free', 'High Protein'],
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      aiFreshnessScore: 92,
      aiShelfLifeConfidence: 'High (Standard thermal holding condition)',
      status: 'MATCHED',
      matchedRecipientId: 'recip-2',
      matchedRecipientName: 'Akshaya Seva Community Kitchen',
      matchedRecipientLocation: { lat: 13.0520, lng: 80.2410, address: '24 Anna Nagar Main Way' },
      pickupOtp: '3910',
      deliveryQrToken: 'FOODLOOP-VERIFIED-DON2026082',
      driverId: 'drv-1',
      driverName: 'Alex Rivera',
      driverVehicleType: 'Eco Cargo E-Bike (Active Cold Pouch)',
      haccpLogs: [
        {
          id: 'haccp-2',
          stage: 'PREPARATION',
          timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
          temperatureCelsius: 64.2,
          visualIntegrityPass: true,
          smellSensoryPass: true,
          tamperSealIntact: true,
          inspectorName: 'Ramanathan K. (Hostel Hygiene Officer)',
          notes: 'Excess prepared batch from dinner service; sealed in food-grade carriers'
        }
      ],
      co2eAvoidedKg: 195.0,
      waterSavedLiters: 65520,
    }
  ],
  schedules: [
    {
      id: 'sch-1',
      name: 'Hostel Mess Daily Lunch Surplus',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      time: '14:30',
      expectedServings: 120,
      foodType: 'Prepared Hot (Rice & Dal)',
      autoDispatch: true
    },
    {
      id: 'sch-2',
      name: 'Weekend Banquet Dinner Buffet Overflow',
      days: ['Sat', 'Sun'],
      time: '23:00',
      expectedServings: 250,
      foodType: 'Prepared Hot (Festive Catering)',
      autoDispatch: true
    }
  ],
  messages: []
};

// Database helper
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db.json, re-initializing seed data', err);
  }
  saveDB(SEED_DATA);
  return SEED_DATA;
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving to db.json', err);
  }
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  const db = loadDB();
  res.json({
    status: 'online',
    system: 'FoodLoop Next-Gen Surplus Food Redistribution Network',
    version: '4.0.0-PROD',
    activeDonations: db.donations.filter(d => d.status === 'AVAILABLE').length,
    inTransitDonations: db.donations.filter(d => d.status === 'IN_TRANSIT').length,
    deliveredDonations: db.donations.filter(d => d.status === 'DELIVERED').length,
    registeredOrganizations: db.organizations.length,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/organizations', (req, res) => {
  const db = loadDB();
  res.json(db.organizations);
});

app.get('/api/donations', (req, res) => {
  const db = loadDB();
  res.json(db.donations);
});

app.post('/api/donations', (req, res) => {
  const db = loadDB();
  const weightKg = parseFloat(req.body.weightKg) || 20;
  const newDonation = {
    ...req.body,
    id: req.body.id || `DON-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    status: req.body.status || 'AVAILABLE',
    pickupOtp: req.body.pickupOtp || `${Math.floor(1000 + Math.random() * 9000)}`,
    deliveryQrToken: req.body.deliveryQrToken || `FOODLOOP-VERIFIED-${Date.now().toString(36).toUpperCase()}`,
    co2eAvoidedKg: Math.round(weightKg * 2.5 * 10) / 10,
    waterSavedLiters: Math.round(weightKg * 840)
  };
  db.donations.unshift(newDonation);
  saveDB(db);
  res.status(201).json(newDonation);
});

// Claim / Match
app.post('/api/donations/:id/claim', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const { recipientId, recipientName, recipientLocation } = req.body;
  const donation = db.donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ error: 'Donation not found' });

  donation.status = 'MATCHED';
  donation.matchedRecipientId = recipientId;
  donation.matchedRecipientName = recipientName;
  donation.matchedRecipientLocation = recipientLocation;
  donation.driverId = 'drv-1';
  donation.driverName = 'Alex Rivera';
  donation.driverVehicleType = 'Eco Cargo E-Bike (Active Cold Pouch)';
  donation.currentCourierLocation = {
    lat: (donation.donorLocation.lat + (recipientLocation ? recipientLocation.lat : donation.donorLocation.lat)) / 2,
    lng: (donation.donorLocation.lng + (recipientLocation ? recipientLocation.lng : donation.donorLocation.lng)) / 2
  };

  saveDB(db);
  res.json(donation);
});

// Pickup Handshake
app.post('/api/donations/:id/pickup-handshake', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const { otp, probeTemperatureCelsius, inspectorName } = req.body;
  const donation = db.donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ error: 'Donation not found' });

  if (donation.pickupOtp !== otp) {
    return res.status(400).json({ error: 'Invalid 4-digit pickup OTP' });
  }

  donation.status = 'IN_TRANSIT';
  donation.haccpLogs.push({
    id: `haccp-pickup-${Date.now()}`,
    stage: 'PICKUP_INSPECTION',
    timestamp: new Date().toISOString(),
    temperatureCelsius: probeTemperatureCelsius || (donation.foodType === 'PREPARED_HOT' ? 66.5 : 3.8),
    visualIntegrityPass: true,
    smellSensoryPass: true,
    tamperSealIntact: true,
    inspectorName: inspectorName || 'Alex Rivera (Certified Courier)',
    notes: 'Temperature and seals verified at pickup bay.'
  });

  saveDB(db);
  res.json(donation);
});

// Delivery Handshake
app.post('/api/donations/:id/delivery-handshake', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const { qrToken, inspectorName } = req.body;
  const donation = db.donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ error: 'Donation not found' });

  if (donation.deliveryQrToken !== qrToken) {
    return res.status(400).json({ error: 'Invalid delivery QR token' });
  }

  donation.status = 'DELIVERED';
  donation.haccpLogs.push({
    id: `haccp-delivery-${Date.now()}`,
    stage: 'DELIVERY_ACCEPTANCE',
    timestamp: new Date().toISOString(),
    temperatureCelsius: donation.foodType === 'PREPARED_HOT' ? 63.4 : 3.9,
    visualIntegrityPass: true,
    smellSensoryPass: true,
    tamperSealIntact: true,
    inspectorName: inspectorName || donation.matchedRecipientName || 'NGO Intake Team',
    notes: 'Food delivered safely within required temperature window. Immediate distribution underway.'
  });

  saveDB(db);
  res.json(donation);
});

// Quarantine
app.post('/api/donations/:id/quarantine', (req, res) => {
  const db = loadDB();
  const { id } = req.params;
  const { reason } = req.body;
  const donation = db.donations.find(d => d.id === id);
  if (!donation) return res.status(404).json({ error: 'Donation not found' });

  donation.status = 'QUARANTINED';
  donation.quarantineReason = reason || 'Temperature violation in danger zone';
  donation.haccpLogs.push({
    id: `haccp-quarantine-${Date.now()}`,
    stage: 'TRANSIT_TELEMETRY',
    timestamp: new Date().toISOString(),
    temperatureCelsius: 48.0,
    visualIntegrityPass: false,
    smellSensoryPass: false,
    tamperSealIntact: true,
    inspectorName: 'Autonomous Food Safety Algorithmic Monitor',
    notes: `QUARANTINE ENFORCED: ${reason}. Diverted to Biogas anaerobic digester.`
  });

  saveDB(db);
  res.json(donation);
});

// Schedules
app.get('/api/schedules', (req, res) => {
  const db = loadDB();
  res.json(db.schedules || []);
});

app.post('/api/schedules', (req, res) => {
  const db = loadDB();
  if (!db.schedules) db.schedules = [];
  const newSchedule = {
    id: `sch-${Date.now()}`,
    ...req.body
  };
  db.schedules.push(newSchedule);
  saveDB(db);
  res.status(201).json(newSchedule);
});

app.delete('/api/schedules/:id', (req, res) => {
  const db = loadDB();
  if (db.schedules) {
    db.schedules = db.schedules.filter(s => s.id !== req.params.id);
    saveDB(db);
  }
  res.json({ success: true });
});

// Live Mission Chat Messages
app.get('/api/messages/:donationId', (req, res) => {
  const db = loadDB();
  const donationMessages = (db.messages || []).filter(m => m.donationId === req.params.donationId);
  res.json(donationMessages);
});

app.post('/api/messages', (req, res) => {
  const db = loadDB();
  if (!db.messages) db.messages = [];
  const newMsg = {
    id: `msg-${Date.now()}`,
    donationId: req.body.donationId,
    sender: req.body.sender,
    text: req.body.text,
    timestamp: new Date().toISOString()
  };
  db.messages.push(newMsg);
  saveDB(db);
  res.status(201).json(newMsg);
});

// Reset Database
app.post('/api/reset', (req, res) => {
  saveDB(SEED_DATA);
  res.json({ success: true, message: 'Database reset to seed data' });
});

// Serve frontend static build if present
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`FoodLoop Next-Gen API Server live on http://localhost:${PORT}`);
});
