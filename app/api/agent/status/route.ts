import { NextResponse } from 'next/server';
import { getAgentInstance } from '@/lib/agent';

export async function GET() {
  try {
    const agent = getAgentInstance();

    return NextResponse.json({
      success: true,
      status: agent.getStatus(),
      config: agent.getConfig(),
      statistics: agent.getStatistics()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get agent status' },
      { status: 500 }
    );
  }
}
