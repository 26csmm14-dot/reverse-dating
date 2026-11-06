import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbService } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const cookieStore = cookies();
    let applicantId = cookieStore.get('applicant_id')?.value;

    if (!applicantId && request) {
      try {
        const { searchParams } = new URL(request.url);
        applicantId = searchParams.get('applicant_id');
      } catch (e) {}
      if (!applicantId) {
        applicantId = request.headers?.get('x-applicant-id');
      }
    }

    if (!applicantId) {
      return NextResponse.json({ authenticated: false, status: 'unauthenticated' });
    }

    const applicant = await dbService.findById(applicantId);

    if (!applicant) {
      return NextResponse.json({ authenticated: false, status: 'unauthenticated' });
    }

    return NextResponse.json({
      authenticated: true,
      status: applicant.status,
      applicant: {
        id: (applicant._id || applicant.id).toString(),
        name: applicant.name,
        contact: applicant.contact,
        status: applicant.status,
        appliedAt: applicant.appliedAt,
      },
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ authenticated: false, error: 'Database check failed' }, { status: 500 });
  }
}
