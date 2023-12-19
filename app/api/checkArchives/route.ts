import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  if (!path) {
    return new Response('No path parameter given', { status: 500 });
  }

  const v0 = await fetch(`https://v0.jackmorrison.xyz/${path}`);
  const v1 = await fetch(`https://v1.jackmorrison.xyz/${path}`);
  const v2 = await fetch(`https://v2.jackmorrison.xyz/${path}`);
  const v4 = await fetch(`https://v4.jackmorrison.xyz/${path}`);

  return NextResponse.json({ v0: v0.status, v1: v1.status, v2: v2.status, v4: v4.status });
}
