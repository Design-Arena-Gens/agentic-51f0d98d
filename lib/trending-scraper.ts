import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';

const rssParser = new Parser();

export interface TrendingTopic {
  title: string;
  description: string;
  url: string;
  source: string;
  timestamp: Date;
  keywords: string[];
}

export class TrendingScraper {

  // Scrape Google News for AI topics
  async scrapeGoogleNews(): Promise<TrendingTopic[]> {
    try {
      const searchQuery = 'artificial+intelligence+OR+machine+learning+OR+AI+OR+ChatGPT+OR+LLM';
      const url = `https://news.google.com/rss/search?q=${searchQuery}&hl=en-US&gl=US&ceid=US:en`;

      const feed = await rssParser.parseURL(url);

      return feed.items.slice(0, 10).map(item => ({
        title: item.title || '',
        description: item.contentSnippet || item.content || '',
        url: item.link || '',
        source: 'Google News',
        timestamp: new Date(item.pubDate || Date.now()),
        keywords: this.extractKeywords(item.title + ' ' + item.contentSnippet)
      }));
    } catch (error) {
      console.error('Error scraping Google News:', error);
      return [];
    }
  }

  // Scrape Reddit's AI subreddits
  async scrapeReddit(): Promise<TrendingTopic[]> {
    try {
      const subreddits = ['artificial', 'MachineLearning', 'ChatGPT', 'LocalLLaMA'];
      const topics: TrendingTopic[] = [];

      for (const subreddit of subreddits) {
        const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=5`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.data?.data?.children) {
          const posts = response.data.data.children.slice(0, 5);

          for (const post of posts) {
            const data = post.data;
            topics.push({
              title: data.title,
              description: data.selftext || data.title,
              url: `https://www.reddit.com${data.permalink}`,
              source: `Reddit r/${subreddit}`,
              timestamp: new Date(data.created_utc * 1000),
              keywords: this.extractKeywords(data.title + ' ' + data.selftext)
            });
          }
        }
      }

      return topics;
    } catch (error) {
      console.error('Error scraping Reddit:', error);
      return [];
    }
  }

  // Scrape Hacker News for AI content
  async scrapeHackerNews(): Promise<TrendingTopic[]> {
    try {
      const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
      const topStoryIds = response.data.slice(0, 30);
      const topics: TrendingTopic[] = [];

      for (const id of topStoryIds) {
        const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const story = storyResponse.data;

        if (story && story.title && this.isAIRelated(story.title)) {
          topics.push({
            title: story.title,
            description: story.text || story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${id}`,
            source: 'Hacker News',
            timestamp: new Date(story.time * 1000),
            keywords: this.extractKeywords(story.title)
          });

          if (topics.length >= 10) break;
        }
      }

      return topics;
    } catch (error) {
      console.error('Error scraping Hacker News:', error);
      return [];
    }
  }

  // Get trending topics from multiple sources
  async getAllTrending(): Promise<TrendingTopic[]> {
    const [googleNews, reddit, hackerNews] = await Promise.all([
      this.scrapeGoogleNews(),
      this.scrapeReddit(),
      this.scrapeHackerNews()
    ]);

    return [...googleNews, ...reddit, ...hackerNews]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 30);
  }

  // Extract keywords from text
  private extractKeywords(text: string): string[] {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);

    const words = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  // Check if content is AI-related
  private isAIRelated(text: string): boolean {
    const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
                        'neural network', 'llm', 'chatgpt', 'gpt', 'claude', 'openai', 'anthropic',
                        'transformer', 'nlp', 'computer vision', 'generative', 'model', 'training'];

    const lowerText = text.toLowerCase();
    return aiKeywords.some(keyword => lowerText.includes(keyword));
  }
}
