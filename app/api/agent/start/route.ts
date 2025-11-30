import { NextResponse } from 'next/server';
import { getAgentInstance } from '@/lib/agent';

export async function POST() {
  try {
    const agent = getAgentInstance();
    await agent.start();

    return NextResponse.json({
      success: true,
      message: 'Agent started successfully',
      status: agent.getStatus()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to start agent' },
      { status: 500 }
    );
  }
}
