import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAuthorized(request) {
  const secret = process.env.ADMIN_SECRET || 'senku10billion';
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const querySecret = url.searchParams.get('secret');

  if (querySecret === secret) return true;
  if (authHeader && authHeader.replace('Bearer ', '').trim() === secret) return true;

  return false;
}

export async function GET(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const applicants = await dbService.listAll();

    const stats = {
      total: applicants.length,
      pending: applicants.filter((a) => a.status === 'pending').length,
      accepted: applicants.filter((a) => a.status === 'accepted').length,
      rejected: applicants.filter((a) => a.status === 'rejected').length,
      viewing: applicants.filter((a) => a.status === 'viewing').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      applicants,
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch applicants' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const { applicantId, action, decisionNote } = await request.json();

    if (!applicantId || !['accept', 'reject', 'reset'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid applicant ID or action' },
        { status: 400 }
      );
    }

    const updates = {};
    if (action === 'accept') {
      updates.status = 'accepted';
      updates.decidedAt = new Date();
    } else if (action === 'reject') {
      updates.status = 'rejected';
      updates.decidedAt = new Date();
    } else if (action === 'reset') {
      updates.status = 'pending';
      updates.decidedAt = null;
    }

    if (decisionNote !== undefined) {
      updates.decisionNote = decisionNote;
    }

    const applicant = await dbService.update(applicantId, updates);
    if (!applicant) {
      return NextResponse.json({ success: false, error: 'Applicant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      applicant,
      message: `Applicant status updated to ${applicant.status}`,
    });
  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update applicant' },
      { status: 500 }
    );
  }
}
