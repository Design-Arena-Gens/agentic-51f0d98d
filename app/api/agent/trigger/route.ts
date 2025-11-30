import { NextResponse } from 'next/server';
import { getAgentInstance } from '@/lib/agent';

export async function POST() {
  try {
    const agent = getAgentInstance();
    await agent.triggerRun();

    return NextResponse.json({
      success: true,
      message: 'Agent run triggered successfully',
      status: agent.getStatus()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to trigger agent run' },
      { status: 500 }
    );
  }
}
