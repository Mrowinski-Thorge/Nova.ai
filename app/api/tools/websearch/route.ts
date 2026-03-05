import { NextRequest, NextResponse } from 'next/server';
import { webSearch } from '@/lib/tools/websearch';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const results = await webSearch(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Web search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform web search' },
      { status: 500 }
    );
  }
}
