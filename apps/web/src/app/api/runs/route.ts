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

  const runId = crypto.randomUUID();

  return NextResponse.json({
    runId,
    status: 'queued',
    brief: parsed.data,
  });
}
