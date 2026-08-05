import { prisma } from '@limen/db';
import { launchBriefSchema } from '@limen/shared/schemas/launch-brief';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = launchBriefSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid launch brief.',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const run = await prisma.auditRun.create({
      data: {
        url: parsed.data.url,
        audience: parsed.data.audience,
        trafficChannel: parsed.data.trafficChannel,
        desiredAction: parsed.data.desiredAction,
        offer: parsed.data.offer,
        objectionsJson: parsed.data.objections,
        competitorsJson: parsed.data.competitors ?? [],
        brandVoice: parsed.data.brandVoice,
        status: 'queued',
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      runId: run.id,
      status: run.status,
    });
  } catch (error) {
    console.error('Failed to create launch run', error);

    return NextResponse.json(
      {
        error: 'Unable to create launch run right now.',
      },
      { status: 500 },
    );
  }
}
