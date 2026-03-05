import { WebSearchResult } from '@/types';

export async function webSearch(query: string): Promise<WebSearchResult[]> {
  try {
    // Using DuckDuckGo Instant Answer API
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_html=1&skip_disambig=1`;

    const response = await fetch(url);
    const data = await response.json();

    const results: WebSearchResult[] = [];

    // Add abstract if available
    if (data.Abstract) {
      results.push({
        title: data.Heading || 'DuckDuckGo Result',
        snippet: data.Abstract,
        link: data.AbstractURL || 'https://duckduckgo.com',
      });
    }

    // Add related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 5)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            snippet: topic.Text,
            link: topic.FirstURL,
          });
        }
      }
    }

    if (results.length === 0) {
      throw new Error('No search results found');
    }

    return results;
  } catch (error) {
    console.error('Web search error:', error);
    throw new Error('Failed to perform web search');
  }
}
