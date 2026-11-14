import { NextRequest, NextResponse } from 'next/server';
import { getFeedPage } from 'data-access/feed/getMonthSummaries';

export const revalidate = 43200;

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor');

  try {
    // Reads the same cached timeline the page rendered from, so this is a slice.
    return NextResponse.json(await getFeedPage(cursor));
  } catch {
    return NextResponse.json({ months: [], nextCursor: null, done: true });
  }
}
