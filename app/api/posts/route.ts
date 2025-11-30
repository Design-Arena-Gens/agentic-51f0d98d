import { NextResponse } from 'next/server';
import { getAgentInstance } from '@/lib/agent';

export async function GET() {
  try {
    const agent = getAgentInstance();
    const posts = agent.getScheduledPosts();

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
