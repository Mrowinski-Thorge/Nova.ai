import { WikipediaResult } from '@/types';

export async function searchWikipedia(query: string): Promise<WikipediaResult> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&format=json&origin=*`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.query?.search?.length) {
      throw new Error('No results found');
    }

    const firstResult = searchData.query.search[0];
    const pageTitle = firstResult.title;

    // Get page summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      pageTitle
    )}`;

    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();

    return {
      title: summaryData.title,
      summary: summaryData.extract,
      link: summaryData.content_urls.desktop.page,
    };
  } catch (error) {
    console.error('Wikipedia search error:', error);
    throw new Error('Failed to search Wikipedia');
  }
}
