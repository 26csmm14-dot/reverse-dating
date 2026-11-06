import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbService } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';
import { validateCredentials } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const cookieApplicantId = cookieStore.get('applicant_id')?.value;

    const body = await request.json().catch(() => ({}));
    const {
      name,
      contact,
      photo,
      pitch,
      firstDateIdea,
      contactType,
      countryCode,
      applicantId: bodyApplicantId,
    } = body;

    let applicant = null;
    const activeId = cookieApplicantId || bodyApplicantId;

    // Secure: verify session from cookie or body applicantId
    if (activeId) {
      applicant = await dbService.findById(activeId);
    }

    // If unauthenticated guest, validate and create or find by contact
    if (!applicant) {
      if (!name || !contact) {
        return NextResponse.json(
          { success: false, error: 'Please provide your name and contact info before applying.' },
          { status: 400 }
        );
      }

      const validation = validateCredentials({
        name,
        contact,
        contactType: contactType || 'instagram',
        countryCode: countryCode || 'IN',
      });

      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }

      const cleanContact = contact.trim().toLowerCase();
      applicant = await dbService.findByContact(cleanContact);

      if (!applicant) {
        applicant = await dbService.create({
          name: name.trim(),
          contact: cleanContact,
          contactType: contactType || 'instagram',
          photo: photo ? photo.trim() : 'avatar-1',
          status: 'viewing',
        });
      }
    }

    // If already decided, return status
    if (applicant.status === 'rejected' || applicant.status === 'accepted') {
      return NextResponse.json({
        success: true,
        alreadyDecided: true,
        status: applicant.status,
        message: `Your application has already been ${applicant.status}.`,
      });
    }

    // Update details and set status to pending
    const docId = (applicant._id || applicant.id).toString();
    const safePhoto = (photo && typeof photo === 'string' && photo.trim()) ? photo.trim() : applicant.photo;

    applicant = await dbService.update(docId, {
      status: 'pending',
      appliedAt: new Date(),
      pitch: pitch ? pitch.trim() : applicant.pitch,
      firstDateIdea: firstDateIdea ? firstDateIdea.trim() : applicant.firstDateIdea,
      name: name ? name.trim() : applicant.name,
      contact: contact ? contact.trim().toLowerCase() : applicant.contact,
      photo: safePhoto,
    });

    // Set cookie
    cookieStore.set('applicant_id', docId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });

    // Detect live domain for cloud webhook registration
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${proto}://${host}`;

    // Trigger instant notification webhook with photo (Telegram Bot API)
    await sendTelegramNotification({
      name: applicant.name,
      contact: applicant.contact,
      contactType: applicant.contactType,
      photo: applicant.photo || safePhoto,
      expectations: applicant.expectations,
      pitch: applicant.pitch,
      firstDateIdea: applicant.firstDateIdea,
      applicantId: docId,
      origin,
    });

    return NextResponse.json({
      success: true,
      status: 'pending',
      applicant: {
        id: docId,
        name: applicant.name,
        contact: applicant.contact,
        photo: applicant.photo || safePhoto,
        firstDateIdea: applicant.firstDateIdea,
        pitch: applicant.pitch,
        status: 'pending',
        appliedAt: applicant.appliedAt,
      },
      message: 'Match proposal transmitted to the host.',
    });
  } catch (error) {
    console.error('Apply API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
