import { GeneratedContent } from './content-generator';

export interface ScheduledPost {
  id: string;
  content: GeneratedContent;
  scheduledTime: Date;
  status: 'pending' | 'posted' | 'failed';
  platform: string;
}

export class ContentScheduler {
  private posts: ScheduledPost[] = [];

  // Optimal posting times for each platform (in hours, 24h format)
  private readonly optimalTimes: { [key: string]: number[] } = {
    LinkedIn: [8, 12, 17], // Business hours
    Twitter: [9, 12, 15, 18, 21], // Throughout the day
    Facebook: [9, 13, 19], // Morning, lunch, evening
    Instagram: [11, 14, 19], // Late morning, afternoon, evening
    TikTok: [7, 12, 19, 22], // Early morning, lunch, evening, late night
    YouTube: [14, 18, 20], // Afternoon and evening
    Pinterest: [14, 20, 21] // Afternoon and evening
  };

  // Days of week ranked by engagement (0 = Sunday)
  private readonly bestDays: number[] = [2, 3, 4, 1, 5]; // Tue, Wed, Thu, Mon, Fri

  // Create schedule for content across all platforms
  scheduleContent(contents: GeneratedContent[]): ScheduledPost[] {
    const now = new Date();
    const scheduledPosts: ScheduledPost[] = [];

    contents.forEach((content, index) => {
      const scheduledTime = this.getNextOptimalTime(content.platform, now, index);

      scheduledPosts.push({
        id: this.generateId(),
        content,
        scheduledTime,
        status: 'pending',
        platform: content.platform
      });
    });

    this.posts.push(...scheduledPosts);
    return scheduledPosts;
  }

  // Get next optimal posting time for platform
  private getNextOptimalTime(platform: string, baseTime: Date, offset: number): Date {
    const times = this.optimalTimes[platform] || [9, 14, 19];
    const currentHour = baseTime.getHours();

    // Find next optimal hour
    let nextHour = times.find(t => t > currentHour);

    // If no time found today, use first time tomorrow
    if (!nextHour) {
      const nextDay = new Date(baseTime);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(times[0], 0, 0, 0);
      return nextDay;
    }

    // Set to next optimal hour today
    const scheduledTime = new Date(baseTime);
    scheduledTime.setHours(nextHour, 0, 0, 0);

    // Add offset for spreading posts
    scheduledTime.setMinutes(offset * 15);

    return scheduledTime;
  }

  // Get posts due for publishing
  getDuePosts(): ScheduledPost[] {
    const now = new Date();
    return this.posts.filter(post =>
      post.status === 'pending' && post.scheduledTime <= now
    );
  }

  // Mark post as completed
  markAsPosted(postId: string): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.status = 'posted';
    }
  }

  // Mark post as failed
  markAsFailed(postId: string): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.status = 'failed';
    }
  }

  // Get all scheduled posts
  getAllPosts(): ScheduledPost[] {
    return this.posts;
  }

  // Get posts by platform
  getPostsByPlatform(platform: string): ScheduledPost[] {
    return this.posts.filter(p => p.platform === platform);
  }

  // Get posting statistics
  getStatistics() {
    const byPlatform: { [key: string]: number } = {};
    const byStatus: { [key: string]: number } = {
      pending: 0,
      posted: 0,
      failed: 0
    };

    this.posts.forEach(post => {
      byPlatform[post.platform] = (byPlatform[post.platform] || 0) + 1;
      byStatus[post.status]++;
    });

    return {
      total: this.posts.length,
      byPlatform,
      byStatus,
      successRate: this.posts.length > 0
        ? (byStatus.posted / this.posts.length * 100).toFixed(1) + '%'
        : '0%'
    };
  }

  // Generate unique ID
  private generateId(): string {
    return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate posting calendar for next 7 days
  generateWeekCalendar(): { [key: string]: ScheduledPost[] } {
    const calendar: { [key: string]: ScheduledPost[] } = {};
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      calendar[dateKey] = this.posts.filter(post => {
        const postDate = post.scheduledTime.toISOString().split('T')[0];
        return postDate === dateKey;
      });
    }

    return calendar;
  }
}
