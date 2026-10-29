import { Organization, DonationItem } from './types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  // Donors
  {
    id: 'donor-1',
    name: 'The Grand Regency Banquet & Hotel',
    type: 'DONOR_RESTAURANT',
    verified: true,
    licenseNumber: 'FSSAI-10023011009842',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: '142 Grand Trunk Blvd, Metro Central'
    },
    contactPerson: 'Executive Chef Vikram Rao',
    phone: '+91 98401 23456',
  },
  {
    id: 'donor-2',
    name: 'SRM University Mega-Hostel Mess #3',
    type: 'DONOR_HOSTEL',
    verified: true,
    licenseNumber: 'FSSAI-11222044001923',
    location: {
      lat: 13.0604,
      lng: 80.2496,
      address: 'Hostel Block C, SRM Tech Campus'
    },
    contactPerson: 'Mess Warden Ramanathan K.',
    phone: '+91 98405 88910',
  },
  {
    id: 'donor-3',
    name: 'GreenBite Corporate Cloud Kitchens',
    type: 'DONOR_CATERER',
    verified: true,
    licenseNumber: 'FSSAI-10021022003411',
    location: {
      lat: 13.0950,
      lng: 80.2850,
      address: 'Unit 4B, Cyber Towers Hub'
    },
    contactPerson: 'Anita Sundaram',
    phone: '+91 97890 11223',
  },
  {
    id: 'donor-4',
    name: 'FreshMart Organics Superstore',
    type: 'DONOR_SUPERMARKET',
    verified: true,
    licenseNumber: 'FSSAI-10020011008821',
    location: {
      lat: 13.0450,
      lng: 80.2250,
      address: 'Bay 12, South Avenue Mall'
    },
    contactPerson: 'Farhan Akhtar',
    phone: '+91 98200 44556',
  },

  // Recipient Organizations (NGOs, Shelters, Community Kitchens)
  {
    id: 'recip-1',
    name: 'Mother Teresa Hope Shelter & Care Home',
    type: 'RECIPIENT_SHELTER',
    verified: true,
    licenseNumber: 'NGO-TN-2018-88392',
    location: {
      lat: 13.0780,
      lng: 80.2610,
      address: '88 St. Mary Road, Alwarpet'
    },
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
    location: {
      lat: 13.0520,
      lng: 80.2410,
      address: '24 Anna Nagar Main Way'
    },
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
    location: {
      lat: 13.0910,
      lng: 80.2790,
      address: '15 Gandhi Nagar 2nd Street'
    },
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
    location: {
      lat: 13.0380,
      lng: 80.2190,
      address: 'Sector 5 Transit Campsite'
    },
    contactPerson: 'Karthik Raja',
    phone: '+91 97910 88344',
    capacityServings: 320,
    hasColdStorage: true,
    dietaryRestrictions: ['VEG_AND_NON_VEG'],
  }
];

export const INITIAL_DONATIONS: DonationItem[] = [
  {
    id: 'DON-2026-081',
    donorId: 'donor-1',
    donorName: 'The Grand Regency Banquet & Hotel',
    donorType: 'Luxury Banquet Catering',
    donorLocation: {
      lat: 13.0827,
      lng: 80.2707,
      address: '142 Grand Trunk Blvd, Metro Central'
    },
    title: 'Gourmet Basmati Biryani & Paneer Butter Masala',
    foodType: 'PREPARED_HOT',
    cuisine: 'North Indian / Mughlai',
    quantityServings: 140,
    weightKg: 45.5,
    preparedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    safeUntilDeadline: new Date(Date.now() + 155 * 60 * 1000).toISOString(), // ~2.5 hrs left
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
    co2eAvoidedKg: 113.75, // 45.5 kg * 2.5
    waterSavedLiters: 38220, // 45.5 kg * 840L
  },
  {
    id: 'DON-2026-082',
    donorId: 'donor-2',
    donorName: 'SRM University Mega-Hostel Mess #3',
    donorType: 'Hostel Mega-Kitchen',
    donorLocation: {
      lat: 13.0604,
      lng: 80.2496,
      address: 'Hostel Block C, SRM Tech Campus'
    },
    title: 'Wholesome Sambar Rice, Steamed Idlis & Mix Veg Poriyal',
    foodType: 'PREPARED_HOT',
    cuisine: 'South Indian Traditional',
    quantityServings: 220,
    weightKg: 78.0,
    preparedAt: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
    safeUntilDeadline: new Date(Date.now() + 110 * 60 * 1000).toISOString(), // ~1.8 hrs left
    storageRequirement: 'Stainless Steel Insulated Vessels',
    allergens: ['Mustard Seeds'],
    dietaryTags: ['Pure Vegetarian', 'Gluten-Free', 'High Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    aiFreshnessScore: 92,
    aiShelfLifeConfidence: 'High (Standard thermal holding condition)',
    status: 'MATCHED',
    matchedRecipientId: 'recip-2',
    matchedRecipientName: 'Akshaya Seva Community Kitchen',
    matchedRecipientLocation: {
      lat: 13.0520,
      lng: 80.2410,
      address: '24 Anna Nagar Main Way'
    },
    pickupOtp: '3910',
    deliveryQrToken: 'FOODLOOP-VERIFIED-DON2026082',
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
  },
  {
    id: 'DON-2026-083',
    donorId: 'donor-3',
    donorName: 'GreenBite Corporate Cloud Kitchens',
    donorType: 'Corporate Food Tech',
    donorLocation: {
      lat: 13.0950,
      lng: 80.2850,
      address: 'Unit 4B, Cyber Towers Hub'
    },
    title: 'Individual Packed Quinoa Bowls, Wraps & Fresh Fruit Cups',
    foodType: 'PREPARED_COLD',
    cuisine: 'Healthy Continental',
    quantityServings: 65,
    weightKg: 22.0,
    preparedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    safeUntilDeadline: new Date(Date.now() + 240 * 60 * 1000).toISOString(), // 4 hrs left
    storageRequirement: 'Chilled Storage (Keep < 4°C)',
    allergens: ['Sesame', 'Soy'],
    dietaryTags: ['Vegan', 'Nut-Free', 'Eco-Packaged'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    aiFreshnessScore: 98,
    aiShelfLifeConfidence: 'Maximum (Sealed compostable packaging under cold-chain)',
    status: 'IN_TRANSIT',
    matchedRecipientId: 'recip-3',
    matchedRecipientName: 'Little Angels Orphanage & Learning Center',
    matchedRecipientLocation: {
      lat: 13.0910,
      lng: 80.2790,
      address: '15 Gandhi Nagar 2nd Street'
    },
    driverId: 'drv-1',
    driverName: 'Alex Rivera',
    driverVehicleType: 'Electric Cargo Bike (Active Cold-Pouch)',
    currentCourierLocation: {
      lat: 13.0935,
      lng: 80.2820
    },
    pickupOtp: '6721',
    deliveryQrToken: 'FOODLOOP-VERIFIED-DON2026083',
    haccpLogs: [
      {
        id: 'haccp-3a',
        stage: 'PREPARATION',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        temperatureCelsius: 3.2,
        visualIntegrityPass: true,
        smellSensoryPass: true,
        tamperSealIntact: true,
        inspectorName: 'Anita Sundaram (Quality Lead)',
        notes: 'Chilled immediately after assembly.'
      },
      {
        id: 'haccp-3b',
        stage: 'PICKUP_INSPECTION',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        temperatureCelsius: 3.8,
        visualIntegrityPass: true,
        smellSensoryPass: true,
        tamperSealIntact: true,
        inspectorName: 'Alex Rivera (Certified Volunteer Courier)',
        notes: 'Inspected with infrared digital probe. Tamper seals verified.'
      }
    ],
    co2eAvoidedKg: 55.0,
    waterSavedLiters: 18480,
  },
  {
    id: 'DON-2026-084',
    donorId: 'donor-4',
    donorName: 'FreshMart Organics Superstore',
    donorType: 'Organic Grocery Chain',
    donorLocation: {
      lat: 13.0450,
      lng: 80.2250,
      address: 'Bay 12, South Avenue Mall'
    },
    title: 'Artisan Whole Wheat Sourdough Loaves & Farm Apples',
    foodType: 'PACKAGED_DRY',
    cuisine: 'Bakery & Fresh Produce',
    quantityServings: 110,
    weightKg: 35.0,
    preparedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    safeUntilDeadline: new Date(Date.now() + 480 * 60 * 1000).toISOString(), // 8 hrs left
    storageRequirement: 'Dry Ambient Storage (18°C - 24°C)',
    allergens: ['Wheat (Gluten)'],
    dietaryTags: ['Vegetarian', 'Fiber-Rich', 'Direct Farm Source'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    aiFreshnessScore: 94,
    aiShelfLifeConfidence: 'High (Dry baked surplus from morning bake batch)',
    status: 'AVAILABLE',
    pickupOtp: '1159',
    deliveryQrToken: 'FOODLOOP-VERIFIED-DON2026084',
    haccpLogs: [
      {
        id: 'haccp-4',
        stage: 'PREPARATION',
        timestamp: new Date(Date.now() - 170 * 60 * 1000).toISOString(),
        temperatureCelsius: 22.0,
        visualIntegrityPass: true,
        smellSensoryPass: true,
        tamperSealIntact: true,
        inspectorName: 'Farhan Akhtar (Store Ops)',
        notes: 'Packaged in sealed brown recyclable paper liners'
      }
    ],
    co2eAvoidedKg: 87.5,
    waterSavedLiters: 29400,
  }
];
