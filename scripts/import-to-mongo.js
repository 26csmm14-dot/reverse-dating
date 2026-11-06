const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_FILE = path.join(__dirname, '..', 'data', 'applicants.json');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://26csmm14_db_user:btRXu57YKBaPR82i@cluster0.zhvganu.mongodb.net/reverse_dating?retryWrites=true&w=majority';

// Use standard Applicant schema definition
const ApplicantSchema = new mongoose.Schema(
  {
    name: String,
    contactType: String,
    contact: { type: String, unique: true },
    photo: String,
    expectations: String,
    pitch: String,
    firstDateIdea: String,
    status: String,
    appliedAt: Date,
    decidedAt: Date,
    decisionNote: String,
  },
  { timestamps: true }
);

const Applicant = mongoose.models.Applicant || mongoose.model('Applicant', ApplicantSchema);

async function migrate() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully to MongoDB Atlas database: reverse_dating');

  if (!fs.existsSync(DATA_FILE)) {
    console.log('No data/applicants.json file found to migrate.');
    process.exit(0);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const items = JSON.parse(raw);
  console.log(`Found ${items.length} records in local data/applicants.json`);

  let imported = 0;
  for (const item of items) {
    if (!item.contact) continue;
    const cleanContact = item.contact.trim().toLowerCase();
    
    // Copy item without the string _id so Mongo creates native ObjectId
    const docData = { ...item };
    delete docData._id;
    delete docData.id;

    await Applicant.findOneAndUpdate(
      { contact: cleanContact },
      { $set: docData },
      { upsert: true, new: true }
    );
    imported++;
  }

  const totalInDb = await Applicant.countDocuments();
  console.log(`Successfully migrated ${imported} records! Total documents in MongoDB Atlas: ${totalInDb}`);

  // Print sample document from MongoDB Atlas
  const sample = await Applicant.findOne().lean();
  console.log('Sample Document in MongoDB Atlas:\n', JSON.stringify(sample, null, 2));

  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration error:', err.message);
  process.exit(1);
});
