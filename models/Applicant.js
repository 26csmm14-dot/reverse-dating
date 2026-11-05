import mongoose from 'mongoose';

const ApplicantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [80, 'Name cannot be longer than 80 characters'],
    },
    contactType: {
      type: String,
      enum: ['phone', 'instagram', 'whatsapp', 'twitter', 'telegram', 'email'],
      default: 'instagram',
    },
    contact: {
      type: String,
      required: [true, 'Please provide your contact handle or number'],
      trim: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: 'avatar-1',
    },
    expectations: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Expectations cannot be longer than 1000 characters'],
    },
    pitch: {
      type: String,
      trim: true,
      default: "Hey! Let's see if we pass the vibe check.",
      maxlength: [500, 'Pitch cannot be longer than 500 characters'],
    },
    firstDateIdea: {
      type: String,
      trim: true,
      default: 'Coffee and a walk',
    },
    status: {
      type: String,
      enum: ['viewing', 'pending', 'accepted', 'rejected'],
      default: 'viewing',
    },
    appliedAt: {
      type: Date,
      default: null,
    },
    decidedAt: {
      type: Date,
      default: null,
    },
    decisionNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development during hot-reloads
export default mongoose.models.Applicant || mongoose.model('Applicant', ApplicantSchema);
