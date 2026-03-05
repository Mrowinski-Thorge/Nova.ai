import { NextRequest, NextResponse } from 'next/server';
import { searchWikipedia } from '@/lib/tools/wikipedia';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await searchWikipedia(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return NextResponse.json(
      { error: 'Failed to search Wikipedia' },
      { status: 500 }
    );
  }
}
