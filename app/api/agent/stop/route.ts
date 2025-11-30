import { NextResponse } from 'next/server';
import { getAgentInstance } from '@/lib/agent';

export async function POST() {
  try {
    const agent = getAgentInstance();
    agent.stop();

    return NextResponse.json({
      success: true,
      message: 'Agent stopped successfully',
      status: agent.getStatus()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to stop agent' },
      { status: 500 }
    );
  }
}
