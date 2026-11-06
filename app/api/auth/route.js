import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbService } from '@/lib/db';
import { validateCredentials } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, contact, contactType, photo, expectations, countryCode } = body;

    const validation = validateCredentials({
      name,
      contactType,
      contact,
      expectations,
      countryCode: countryCode || 'IN',
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const cleanContact = contact.trim().toLowerCase();
    const validContactType = ['phone', 'instagram', 'whatsapp', 'twitter', 'telegram', 'email'].includes(contactType)
      ? contactType
      : 'instagram';

    const safePhoto = (photo && typeof photo === 'string' && photo.trim()) ? photo.trim() : 'avatar-1';
    const safeExpectations = (expectations && typeof expectations === 'string') ? expectations.trim() : '';

    // Check if applicant already exists with this contact handle
    let applicant = await dbService.findByContact(cleanContact);

    if (!applicant) {
      applicant = await dbService.create({
        name: name.trim(),
        contactType: validContactType,
        contact: cleanContact,
        photo: safePhoto,
        expectations: safeExpectations,
        status: 'viewing',
      });
    } else {
      // Update existing record
      applicant = await dbService.update(applicant._id || applicant.id, {
        name: name.trim(),
        contactType: validContactType,
        photo: safePhoto,
        expectations: safeExpectations,
      });
    }

    const applicantId = (applicant._id || applicant.id).toString();

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('applicant_id', applicantId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      applicant: {
        id: applicantId,
        name: applicant.name,
        contactType: applicant.contactType || validContactType,
        contact: applicant.contact,
        photo: applicant.photo || safePhoto,
        expectations: applicant.expectations || safeExpectations,
        status: applicant.status,
      },
    });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const cookieStore = cookies();
    let applicantId = cookieStore.get('applicant_id')?.value;

    // Resilient fallback for mobile browsers where cookies may be partitioned or blocked
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
      return NextResponse.json({ authenticated: false, applicant: null });
    }

    const applicant = await dbService.findById(applicantId);
    if (!applicant) {
      return NextResponse.json({ authenticated: false, applicant: null });
    }

    return NextResponse.json({
      authenticated: true,
      applicant: {
        id: (applicant._id || applicant.id).toString(),
        name: applicant.name,
        contactType: applicant.contactType || 'instagram',
        contact: applicant.contact,
        photo: applicant.photo || 'avatar-1',
        expectations: applicant.expectations || '',
        status: applicant.status,
        appliedAt: applicant.appliedAt,
      },
    });
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = cookies();
    // Clear the session cookie cleanly
    try {
      cookieStore.delete('applicant_id');
    } catch (e) {}

    cookieStore.set('applicant_id', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' }
    );
  }
}
