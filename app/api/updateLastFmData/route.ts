import { NextResponse } from 'next/server';
import { updateLastFmData } from './updateLastFmData';

export async function GET() {
  const res = updateLastFmData({});

  return NextResponse.json(res);
}
