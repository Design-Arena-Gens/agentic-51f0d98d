import { TrendingScraper, TrendingTopic } from './trending-scraper';
import { ContentGenerator, GeneratedContent } from './content-generator';
import { ContentScheduler, ScheduledPost } from './scheduler';

export interface AgentStatus {
  isRunning: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  topicsFound: number;
  contentGenerated: number;
  postsScheduled: number;
  errors: string[];
}

export interface AgentConfig {
  autoRun: boolean;
  intervalHours: number;
  maxTopicsPerRun: number;
  platforms: string[];
}

export class SocialMediaAgent {
  private scraper: TrendingScraper;
  private generator: ContentGenerator;
  private scheduler: ContentScheduler;
  private status: AgentStatus;
  private config: AgentConfig;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config?: Partial<AgentConfig>) {
    this.scraper = new TrendingScraper();
    this.generator = new ContentGenerator();
    this.scheduler = new ContentScheduler();

    this.config = {
      autoRun: config?.autoRun ?? true,
      intervalHours: config?.intervalHours ?? 6,
      maxTopicsPerRun: config?.maxTopicsPerRun ?? 5,
      platforms: config?.platforms ?? ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Pinterest']
    };

    this.status = {
      isRunning: false,
      lastRun: null,
      nextRun: null,
      topicsFound: 0,
      contentGenerated: 0,
      postsScheduled: 0,
      errors: []
    };
  }

  // Start the agent
  async start(): Promise<void> {
    if (this.status.isRunning) {
      console.log('Agent is already running');
      return;
    }

    this.status.isRunning = true;
    console.log('🤖 Social Media Agent started');

    // Run immediately
    await this.run();

    // Schedule recurring runs
    if (this.config.autoRun) {
      this.intervalId = setInterval(async () => {
        await this.run();
      }, this.config.intervalHours * 60 * 60 * 1000);

      this.status.nextRun = new Date(Date.now() + this.config.intervalHours * 60 * 60 * 1000);
    }
  }

  // Stop the agent
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.status.isRunning = false;
    this.status.nextRun = null;
    console.log('🛑 Social Media Agent stopped');
  }

  // Main agent loop
  async run(): Promise<void> {
    console.log('🔄 Running agent cycle...');

    try {
      // Step 1: Find trending topics
      console.log('📊 Fetching trending AI topics...');
      const topics = await this.scraper.getAllTrending();
      this.status.topicsFound = topics.length;
      console.log(`✅ Found ${topics.length} trending topics`);

      // Step 2: Select top topics
      const selectedTopics = topics.slice(0, this.config.maxTopicsPerRun);
      console.log(`🎯 Selected ${selectedTopics.length} topics for content generation`);

      // Step 3: Generate content for each topic
      console.log('✍️ Generating content...');
      const allContent: GeneratedContent[] = [];

      for (const topic of selectedTopics) {
        const content = await this.generator.generateContentForAllPlatforms(topic);
        allContent.push(...content);
      }

      this.status.contentGenerated = allContent.length;
      console.log(`✅ Generated ${allContent.length} pieces of content`);

      // Step 4: Schedule posts
      console.log('📅 Scheduling posts...');
      const scheduledPosts = this.scheduler.scheduleContent(allContent);
      this.status.postsScheduled = scheduledPosts.length;
      console.log(`✅ Scheduled ${scheduledPosts.length} posts`);

      // Update status
      this.status.lastRun = new Date();
      if (this.config.autoRun) {
        this.status.nextRun = new Date(Date.now() + this.config.intervalHours * 60 * 60 * 1000);
      }

      console.log('✨ Agent cycle completed successfully');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.status.errors.push(errorMessage);
      console.error('❌ Error during agent run:', errorMessage);
    }
  }

  // Get agent status
  getStatus(): AgentStatus {
    return { ...this.status };
  }

  // Get scheduled posts
  getScheduledPosts(): ScheduledPost[] {
    return this.scheduler.getAllPosts();
  }

  // Get due posts (ready to be published)
  getDuePosts(): ScheduledPost[] {
    return this.scheduler.getDuePosts();
  }

  // Get statistics
  getStatistics() {
    return {
      agent: this.status,
      scheduler: this.scheduler.getStatistics(),
      calendar: this.scheduler.generateWeekCalendar()
    };
  }

  // Get latest trending topics
  async getLatestTopics(): Promise<TrendingTopic[]> {
    return await this.scraper.getAllTrending();
  }

  // Generate content for specific topic
  async generateContentForTopic(topic: TrendingTopic): Promise<GeneratedContent[]> {
    return await this.generator.generateContentForAllPlatforms(topic);
  }

  // Update configuration
  updateConfig(config: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...config };

    // Restart if interval changed
    if (config.intervalHours && this.status.isRunning && this.intervalId) {
      this.stop();
      this.start();
    }
  }

  // Get configuration
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  // Manual trigger
  async triggerRun(): Promise<void> {
    await this.run();
  }
}

// Singleton instance
let agentInstance: SocialMediaAgent | null = null;

export function getAgentInstance(): SocialMediaAgent {
  if (!agentInstance) {
    agentInstance = new SocialMediaAgent();
  }
  return agentInstance;
}
