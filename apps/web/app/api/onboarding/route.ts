import { NextResponse } from 'next/server';

type OnboardingPayload = {
  profile?: 'resident' | 'integrator';
  homeName?: string;
  priorities?: string[];
};

export async function POST(request: Request) {
  const apiUrl = process.env.HHA_CORE_API_URL ?? 'http://core-api:3001/v1/onboarding';

  try {
    const payload = (await request.json()) as OnboardingPayload;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'content