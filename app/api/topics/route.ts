import { NextResponse } from 'next/server';
import { getAgentInstance } from '@/lib/agent';

export async function GET() {
  try {
    const agent = getAgentInstance();
    const topics = await agent.getLatestTopics();

    return NextResponse.json({
      success: true,
      topics,
      count: topics.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
