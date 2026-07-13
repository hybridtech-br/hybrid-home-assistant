import { NextResponse } from 'next/server';

type OnboardingPayload = {
  profile?: 'resident' | 'integrator';
  homeName?: string;
  priorities?: string[];
};

export async function POST(request: Request) {
  let payload: OnboardingPayload;

  try {
    payload = (await request.json()) as OnboardingPayload;
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_JSON', message: 'Não foi possível interpretar os dados enviados.' } },
      { status: 400 },
    );
  }

  const homeName = payload.homeName?.trim();
  const priorities = Array.isArray(payload.priorities) ? payload.priorities : [];

  if (!homeName || homeName.length < 2) {
    return NextResponse.json(
      { error: { code: 'INVALID_HOME_NAME', message: 'Informe um nome válido para a residência.' } },
      { status: 422 },
    );
  }

  if (payload.profile !== 'resident' && payload.profile !== 'integrator') {
    return NextResponse.json(
      { error: { code: 'INVALID_PROFILE', message: 'Selecione um perfil válido.' } },
      { status: 422 },
    );
  }

  const session = {
    id: `onb_${crypto.randomUUID()}`,
    profile: payload.profile,
    home: {
      id: `home_${crypto.randomUUID()}`,
      name: homeName,
      priorities,
      healthStatus: 'preparing',
    },
    nextStep: 'device-discovery',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: session }, { status: 201 });
}
