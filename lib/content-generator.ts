import { TrendingTopic } from './trending-scraper';

export interface GeneratedContent {
  platform: string;
  title: string;
  content: string;
  hashtags: string[];
  imagePrompt: string;
  scheduledTime?: Date;
}

export class ContentGenerator {

  // Generate content for all platforms from a trending topic
  async generateContentForAllPlatforms(topic: TrendingTopic): Promise<GeneratedContent[]> {
    return [
      this.generateLinkedInContent(topic),
      this.generateTwitterContent(topic),
      this.generateFacebookContent(topic),
      this.generateInstagramContent(topic),
      this.generateTikTokContent(topic),
      this.generateYouTubeContent(topic),
      this.generatePinterestContent(topic)
    ];
  }

  // LinkedIn: Professional, informative, 1300-2000 chars
  private generateLinkedInContent(topic: TrendingTopic): GeneratedContent {
    const hooks = [
      "Here's what everyone is missing about",
      "The truth about",
      "Why",
      "What I learned from",
      "The future of"
    ];

    const hook = hooks[Math.floor(Math.random() * hooks.length)];

    const content = `${hook} ${topic.title}

${this.expandTopic(topic.description, 'professional')}

This development has significant implications for:
• Businesses leveraging AI automation
• Developers building intelligent systems
• Companies seeking competitive advantage through AI

Want to stay ahead in the AI revolution? Follow for daily insights on AI automation and how to implement these technologies in your business.

---

💼 Need AI Automation for your business?

I help companies implement custom AI solutions that:
✅ Automate repetitive tasks
✅ Improve decision-making with data insights
✅ Scale operations without scaling headcount
✅ Reduce costs by 40-60%

DM "AUTOMATE" to discuss your specific needs. Zero upfront investment - ROI-based pricing available.

#ArtificialIntelligence #AIAutomation #MachineLearning #BusinessAutomation #DigitalTransformation`;

    return {
      platform: 'LinkedIn',
      title: topic.title,
      content,
      hashtags: this.generateHashtags(topic, 'linkedin'),
      imagePrompt: this.generateImagePrompt(topic, 'professional')
    };
  }

  // Twitter/X: Concise, engaging, under 280 chars
  private generateTwitterContent(topic: TrendingTopic): GeneratedContent {
    const shortTitle = topic.title.length > 100 ? topic.title.substring(0, 97) + '...' : topic.title;

    const content = `${shortTitle}

This changes everything. 🧵

DM "AI" for free automation setup guide.`;

    return {
      platform: 'Twitter',
      title: shortTitle,
      content,
      hashtags: this.generateHashtags(topic, 'twitter'),
      imagePrompt: this.generateImagePrompt(topic, 'modern')
    };
  }

  // Facebook: Conversational, story-driven, 500-1000 chars
  private generateFacebookContent(topic: TrendingTopic): GeneratedContent {
    const content = `🤖 ${topic.title}

${this.expandTopic(topic.description, 'conversational')}

The AI revolution is happening NOW, and businesses that don't adapt will be left behind.

Here's what this means for you:
→ More automation possibilities
→ Lower operational costs
→ Better customer experiences
→ Competitive advantages

🎯 Want to leverage AI in your business?

I'm offering FREE consultations this week to help you identify automation opportunities. No tools to buy, no expensive APIs - just smart, cost-effective solutions.

Comment "INTERESTED" or DM me to get started!

👉 Follow for daily AI updates and automation tips`;

    return {
      platform: 'Facebook',
      title: topic.title,
      content,
      hashtags: this.generateHashtags(topic, 'facebook'),
      imagePrompt: this.generateImagePrompt(topic, 'engaging')
    };
  }

  // Instagram: Visual-focused, inspirational, 2200 char max
  private generateInstagramContent(topic: TrendingTopic): GeneratedContent {
    const content = `${topic.title} ✨

The future is here, and it's powered by AI 🚀

Swipe to learn how this impacts YOU →

AI is transforming how we:
💼 Work
🎨 Create
💡 Innovate
📈 Grow businesses

And the best part? You don't need expensive tools to get started.

---

Want to automate your business with AI?

🔥 Free consultation available
🔥 Zero investment required
🔥 Results in 30 days

DM "AUTOMATE" to begin your transformation.

---

Follow @yourbrand for daily AI insights and automation strategies that actually work.

.
.
.`;

    return {
      platform: 'Instagram',
      title: topic.title,
      content,
      hashtags: this.generateHashtags(topic, 'instagram'),
      imagePrompt: this.generateImagePrompt(topic, 'vibrant')
    };
  }

  // TikTok: Script for short video, hook-first
  private generateTikTokContent(topic: TrendingTopic): GeneratedContent {
    const content = `[HOOK - First 3 seconds]
🚨 This AI breakthrough will change everything

[Content - Next 10 seconds]
${topic.title}

Here's why it matters:
• ${this.bulletPoint(topic.description, 1)}
• ${this.bulletPoint(topic.description, 2)}
• ${this.bulletPoint(topic.description, 3)}

[CTA - Last 3 seconds]
Want to leverage AI for your business?
Comment "AI" for free automation guide

Follow for daily AI updates! 🚀

#ai #artificialintelligence #automation #technology #business`;

    return {
      platform: 'TikTok',
      title: topic.title,
      content,
      hashtags: this.generateHashtags(topic, 'tiktok'),
      imagePrompt: this.generateImagePrompt(topic, 'dynamic')
    };
  }

  // YouTube: Video script with timestamps
  private generateYouTubeContent(topic: TrendingTopic): GeneratedContent {
    const content = `${topic.title} | AI Automation Explained

[VIDEO SCRIPT]

0:00 - Hook: "This AI development changes everything for businesses"
0:05 - Introduction to the topic
0:15 - Explain: ${topic.description}
0:45 - Why this matters
1:15 - Real-world applications
1:45 - How to implement this
2:30 - Common mistakes to avoid
2:50 - Call to action

---

📝 VIDEO DESCRIPTION:

${topic.title}

In this video, we break down the latest AI development and show you exactly how to leverage it for your business - without expensive tools or APIs.

🎯 What you'll learn:
• What this AI advancement means
• How it impacts your business
• Practical implementation steps
• Free tools you can use today

🚀 FREE AI AUTOMATION CONSULTATION
Want help implementing AI in your business? DM me "AUTOMATE" or comment below.

💼 AI AUTOMATION SERVICES
I help businesses implement zero-investment AI solutions that deliver results. Visit [your link] to learn more.

⏰ TIMESTAMPS
0:00 - Introduction
0:15 - The Development
0:45 - Why It Matters
1:15 - Real Applications
1:45 - Implementation Guide
2:30 - Common Mistakes
2:50 - Conclusion

#AIAutomation #ArtificialIntelligence #BusinessAutomation #MachineLearning`;

    return {
      platform: 'YouTube',
      title: topic.title,
      content,
      hashtags: this.generateHashtags(topic, 'youtube'),
      imagePrompt: this.generateImagePrompt(topic, 'thumbnail')
    };
  }

  // Pinterest: Pin description
  private generatePinterestContent(topic: TrendingTopic): GeneratedContent {
    const content = `${topic.title} | AI Automation Guide

Discover how this AI breakthrough can transform your business without expensive tools or APIs.

✨ What's Inside:
→ Complete explanation of this AI development
→ Step-by-step implementation guide
→ Free tools and resources
→ Real business applications
→ Automation strategies

Perfect for: Entrepreneurs | Small Business Owners | Tech Enthusiasts | Digital Marketers

🎯 Want personalized AI automation help?
Visit our profile for free consultation details.

Save this pin for later! 📌`;

    return {
      platform: 'Pinterest',
      title: topic.title,
      content,
      hashtags: this.generateHashtags(topic, 'pinterest'),
      imagePrompt: this.generateImagePrompt(topic, 'infographic')
    };
  }

  // Helper: Expand topic description based on tone
  private expandTopic(description: string, tone: 'professional' | 'conversational'): string {
    const expanded = description.substring(0, 300);

    if (tone === 'professional') {
      return `${expanded}

This represents a significant advancement in the AI landscape. As automation becomes more accessible, businesses of all sizes can leverage these technologies to streamline operations and drive growth.`;
    } else {
      return `${expanded}

I've been following this space closely, and let me tell you - this is game-changing. We're witnessing a shift in how businesses operate.`;
    }
  }

  // Helper: Extract bullet point from text
  private bulletPoint(text: string, index: number): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences[index]) {
      return sentences[index].trim().substring(0, 60) + '...';
    }
    return 'AI is transforming industries';
  }

  // Generate platform-specific hashtags
  private generateHashtags(topic: TrendingTopic, platform: string): string[] {
    const baseHashtags = ['AI', 'ArtificialIntelligence', 'MachineLearning', 'Automation', 'Technology'];
    const topicHashtags = topic.keywords.map(k => k.charAt(0).toUpperCase() + k.slice(1));

    const platformHashtags: { [key: string]: string[] } = {
      linkedin: ['BusinessAutomation', 'DigitalTransformation', 'Innovation', 'FutureOfWork'],
      twitter: ['AINews', 'TechNews', 'StartUp'],
      facebook: ['SmallBusiness', 'Entrepreneur', 'BusinessTips'],
      instagram: ['AIArt', 'TechLife', 'Innovation', 'FutureIsNow'],
      tiktok: ['AITikTok', 'TechTok', 'LearnOnTikTok'],
      youtube: ['AIExplained', 'TechTutorial'],
      pinterest: ['AITools', 'BusinessTools', 'Productivity']
    };

    return [...baseHashtags, ...topicHashtags, ...(platformHashtags[platform] || [])]
      .slice(0, platform === 'instagram' ? 30 : 10);
  }

  // Generate image prompt for AI image generation
  private generateImagePrompt(topic: TrendingTopic, style: string): string {
    const styles: { [key: string]: string } = {
      professional: 'professional, corporate, clean, modern, business setting',
      modern: 'modern, sleek, minimalist, tech-focused',
      engaging: 'colorful, engaging, eye-catching, social media style',
      vibrant: 'vibrant colors, Instagram aesthetic, visually striking',
      dynamic: 'dynamic, energetic, fast-paced, short-form video style',
      thumbnail: 'YouTube thumbnail, bold text, high contrast, attention-grabbing',
      infographic: 'infographic style, Pinterest-friendly, informative, clean layout'
    };

    return `${topic.title}, ${styles[style]}, AI theme, futuristic elements, high quality, professional photography`;
  }
}
