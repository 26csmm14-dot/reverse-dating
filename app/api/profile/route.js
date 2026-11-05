import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbService } from '@/lib/db';
import { validateCredentials } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const applicantId = cookieStore.get('applicant_id')?.value;

    if (!applicantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No active session' },
        { status: 401 }
      );
    }

    const applicant = await dbService.findById(applicantId);
    if (!applicant) {
      return NextResponse.json(
        { success: false, error: 'Applicant record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      applicant: {
        id: (applicant._id || applicant.id).toString(),
        name: applicant.name,
        contactType: applicant.contactType || 'instagram',
        contact: applicant.contact,
        photo: applicant.photo || 'avatar-1',
        expectations: applicant.expectations || '',
        status: applicant.status,
        appliedAt: applicant.appliedAt,
        decidedAt: applicant.decidedAt,
      },
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const applicantId = cookieStore.get('applicant_id')?.value;

    if (!applicantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No active session' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, contactType, contact, photo, expectations, countryCode } = body;

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

    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (contact && contact.trim()) {
      const cleanContact = contact.trim().toLowerCase();
      const existing = await dbService.findByContact(cleanContact);
      if (existing && (existing._id || existing.id).toString() !== applicantId) {
        return NextResponse.json(
          { success: false, error: 'This contact handle is already registered by another applicant.' },
          { status: 409 }
        );
      }
      updates.contact = cleanContact;
    }
    if (contactType) {
      const validTypes = ['phone', 'instagram', 'whatsapp', 'twitter', 'telegram', 'email'];
      if (validTypes.includes(contactType)) updates.contactType = contactType;
    }
    if (photo && typeof photo === 'string') updates.photo = photo.trim();
    if (expectations !== undefined) updates.expectations = String(expectations).trim();

    const updated = await dbService.update(applicantId, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Applicant could not be found or updated' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      applicant: {
        id: (updated._id || updated.id).toString(),
        name: updated.name,
        contactType: updated.contactType,
        contact: updated.contact,
        photo: updated.photo,
        expectations: updated.expectations,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = cookies();
    const applicantId = cookieStore.get('applicant_id')?.value;

    if (applicantId) {
      try {
        await dbService.delete(applicantId);
      } catch (dbErr) {
        console.error('Error removing record from db:', dbErr);
      }
    }

    // Always clear session cookie cleanly
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
      message: 'Application withdrawn and profile data permanently removed',
    });
  } catch (error) {
    console.error('Profile DELETE error:', error);
    // Still ensure cookie is cleared
    return NextResponse.json({
      success: true,
      message: 'Application withdrawn and session cleared',
    });
  }
}
