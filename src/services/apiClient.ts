import { DonationItem, Organization } from '../types';
import { INITIAL_DONATIONS, INITIAL_ORGANIZATIONS } from '../mockData';

const BASE_URL = '';

export async function apiFetchDonations(): Promise<DonationItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/donations`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('foodloop_donations', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('API unavailable, falling back to local storage', err);
  }

  // Fallback to local storage or mock data
  const cached = localStorage.getItem('foodloop_donations');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  return INITIAL_DONATIONS;
}

export async function apiFetchOrganizations(): Promise<Organization[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/organizations`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return INITIAL_ORGANIZATIONS;
}

export async function apiCreateDonation(donation: DonationItem): Promise<DonationItem> {
  try {
    const res = await fetch(`${BASE_URL}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API create failed, saving locally', err);
  }
  return donation;
}

export async function apiClaimDonation(
  donationId: string,
  recipient: Organization
): Promise<DonationItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/donations/${donationId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId: recipient.id,
        recipientName: recipient.name,
        recipientLocation: recipient.location,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return null;
}

export async function apiPickupDonation(
  donationId: string,
  otp: string,
  probeTemperatureCelsius: number
): Promise<DonationItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/donations/${donationId}/pickup-handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, probeTemperatureCelsius }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return null;
}

export async function apiDeliverDonation(
  donationId: string,
  qrToken: string
): Promise<DonationItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/donations/${donationId}/delivery-handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return null;
}

export async function apiQuarantineDonation(
  donationId: string,
  reason: string
): Promise<DonationItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/donations/${donationId}/quarantine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}
  return null;
}

export async function apiResetDatabase(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/reset`, { method: 'POST' });
  } catch (err) {}
  localStorage.removeItem('foodloop_donations');
}
