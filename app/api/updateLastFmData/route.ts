import { NextResponse } from 'next/server';
import { updateLastFmData } from './updateLastFmData';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const backfill = searchParams.get('backfill');
  const days = backfill ? parseInt(backfill, 10) : undefined;

  const res = await updateLastFmData({ days });

  return NextResponse.json(res);
}
