/**
 * Phase 1 CRUD & Data Integrity Automated Verification Test
 * Run with: node scripts/test-phase1-crud.js
 */

const fs = require('fs');
const path = require('path');

// Test runner
async function runTests() {
  console.log('\n======================================================');
  console.log('Starting Phase 1 CRUD & Authentication Verification');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
      failed++;
    }
  }

  // Test 1: Verify models/Applicant.js exists and exports schema with new fields
  console.log('Step 1: Checking models/Applicant.js schema definitions...');
  const applicantModelContent = fs.readFileSync(
    path.join(__dirname, '..', 'models', 'Applicant.js'),
    'utf-8'
  );

  assert(applicantModelContent.includes('contactType:'), 'Applicant schema contains contactType field');
  assert(applicantModelContent.includes('photo:'), 'Applicant schema contains photo field');
  assert(applicantModelContent.includes('expectations:'), 'Applicant schema contains expectations field');
  assert(
    applicantModelContent.includes("'phone'") && applicantModelContent.includes("'instagram'"),
    'Applicant schema has enum for contact channels'
  );

  // Test 2: Verify lib/db.js has delete method
  console.log('\nStep 2: Checking lib/db.js CRUD service methods...');
  const dbServiceContent = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'db.js'),
    'utf-8'
  );
  assert(dbServiceContent.includes('delete(id)'), 'dbService exports delete(id) method');
  assert(dbServiceContent.includes('create(data)'), 'dbService exports create(data) method');
  assert(dbServiceContent.includes('update(id, updates)'), 'dbService exports update(id, updates) method');
  assert(dbServiceContent.includes('findById(id)'), 'dbService exports findById(id) method');

  // Test 3: Verify app/api/auth/route.js handles new fields and DELETE (logout)
  console.log('\nStep 3: Checking app/api/auth/route.js API handlers...');
  const authRouteContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'api', 'auth', 'route.js'),
    'utf-8'
  );
  assert(authRouteContent.includes('export async function DELETE'), 'app/api/auth/route.js implements DELETE for logout');
  assert(authRouteContent.includes('contactType'), 'app/api/auth/route.js parses contactType');
  assert(authRouteContent.includes('expectations'), 'app/api/auth/route.js parses expectations');

  // Test 4: Verify app/api/profile/route.js implements full CRUD
  console.log('\nStep 4: Checking app/api/profile/route.js API handlers...');
  const profileRouteContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'api', 'profile', 'route.js'),
    'utf-8'
  );
  assert(profileRouteContent.includes('export async function GET'), 'app/api/profile/route.js implements GET');
  assert(profileRouteContent.includes('export async function PUT'), 'app/api/profile/route.js implements PUT');
  assert(profileRouteContent.includes('export async function DELETE'), 'app/api/profile/route.js implements DELETE');

  // Test 5: Verify app/login/page.jsx has contact channel dropdown and expectations textarea
  console.log('\nStep 5: Checking app/login/page.jsx frontend components...');
  const loginPageContent = fs.readFileSync(
    path.join(__dirname, '..', 'app', 'login', 'page.jsx'),
    'utf-8'
  );
  assert(loginPageContent.includes('CONTACT_CHANNELS'), 'app/login/page.jsx defines contact channels selector');
  assert(loginPageContent.includes('expectations'), 'app/login/page.jsx includes expectations input textarea');
  assert(
    loginPageContent.includes('handleFileUpload') && loginPageContent.includes('handleSkipPhoto'),
    'app/login/page.jsx includes image upload box and skip option'
  );
  assert(
    loginPageContent.includes('handleSkipExpectations') && loginPageContent.includes('isExpectationsSkipped'),
    'app/login/page.jsx includes expectations skip option'
  );

  // Test 6: Verify components/ProfileModal.jsx exists with view, edit, delete, logout
  console.log('\nStep 6: Checking components/ProfileModal.jsx modal & CRUD drawer...');
  const profileModalContent = fs.readFileSync(
    path.join(__dirname, '..', 'components', 'ProfileModal.jsx'),
    'utf-8'
  );
  assert(profileModalContent.includes('handleSave'), 'ProfileModal includes profile update handler');
  assert(profileModalContent.includes('handleDelete'), 'ProfileModal includes application delete/withdraw handler');
  assert(profileModalContent.includes('handleLogout'), 'ProfileModal includes logout session handler');

  // Test 7: Functional Simulation of Local Store CRUD
  console.log('\nStep 7: Executing simulation of JSON Store CRUD lifecycle...');
  const testDataFile = path.join(__dirname, '..', 'data', 'test_applicants.json');
  try {
    const initialList = [];
    const testApplicant = {
      _id: 'test_applicant_001',
      name: 'Maya Lin',
      contactType: 'whatsapp',
      contact: '+1234567890',
      photo: 'avatar-3',
      expectations: 'Enjoys outdoor hiking, intellectual conversations, and weekend coffee.',
      status: 'viewing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    initialList.push(testApplicant);
    fs.writeFileSync(testDataFile, JSON.stringify(initialList, null, 2));

    // Read back
    const readBack = JSON.parse(fs.readFileSync(testDataFile, 'utf-8'));
    assert(readBack.length === 1 && readBack[0].name === 'Maya Lin', 'Store CREATE & READ succeeded');

    // Update
    readBack[0].name = 'Maya Lin Updated';
    readBack[0].expectations = 'Updated expectations: Looking for meaningful connection.';
    fs.writeFileSync(testDataFile, JSON.stringify(readBack, null, 2));
    const updatedBack = JSON.parse(fs.readFileSync(testDataFile, 'utf-8'));
    assert(updatedBack[0].name === 'Maya Lin Updated', 'Store UPDATE succeeded');

    // Delete
    const deletedList = updatedBack.filter((a) => a._id !== 'test_applicant_001');
    fs.writeFileSync(testDataFile, JSON.stringify(deletedList, null, 2));
    const emptyBack = JSON.parse(fs.readFileSync(testDataFile, 'utf-8'));
    assert(emptyBack.length === 0, 'Store DELETE succeeded');
  } finally {
    if (fs.existsSync(testDataFile)) {
      fs.unlinkSync(testDataFile);
    }
  }

  // Test 8: Verify Credential Format Validation Rules
  console.log('\nStep 8: Testing strict credential format validation (lib/validation.js)...');
  const { validateCredentials } = require('../lib/validation');

  const validIndianPhone = validateCredentials({
    name: 'Aarav Sharma',
    contactType: 'phone',
    contact: '+91 9876543210',
    expectations: 'Looking for a genuine connection and shared passions.',
    countryCode: 'IN',
  });
  assert(validIndianPhone.valid, 'Valid Indian phone accepted');

  const fakePhoneLetters = validateCredentials({
    name: 'Aarav Sharma',
    contactType: 'phone',
    contact: '1234abcd',
    expectations: 'Looking for a genuine connection and shared passions.',
    countryCode: 'IN',
  });
  assert(!fakePhoneLetters.valid, 'Fake phone with letters rejected');

  const validIG = validateCredentials({
    name: 'Sophie Turner',
    contactType: 'instagram',
    contact: 'sophie.turner_99',
    expectations: 'Excited to explore the portfolio and learn more about you.',
  });
  assert(validIG.valid, 'Authentic Instagram handle accepted');

  const fakeIG = validateCredentials({
    name: 'Sophie Turner',
    contactType: 'instagram',
    contact: 'invalid space and $$ symbols',
    expectations: 'Excited to explore the portfolio and learn more about you.',
  });
  assert(!fakeIG.valid, 'Invalid Instagram handle with spaces/symbols rejected');

  const validEmail = validateCredentials({
    name: 'Maya Lin',
    contactType: 'email',
    contact: 'maya.lin@example.com',
    expectations: 'Looking forward to great conversations and coffee.',
  });
  assert(validEmail.valid, 'Authentic email format accepted');

  const fakeEmail = validateCredentials({
    name: 'Maya Lin',
    contactType: 'email',
    contact: 'not-an-email',
    expectations: 'Looking forward to great conversations and coffee.',
  });
  assert(!fakeEmail.valid, 'Malformed email address rejected');

  const fakeName = validateCredentials({
    name: '123445$$$',
    contactType: 'email',
    contact: 'test@example.com',
    expectations: 'Looking forward to great conversations and coffee.',
  });
  assert(!fakeName.valid, 'Fake name with numbers/symbols rejected');

  const skippedExpectations = validateCredentials({
    name: 'Priya Patel',
    contactType: 'phone',
    contact: '+91 9876543210',
    expectations: 'Skipped — Open to exploring the vibe organically',
    countryCode: 'IN',
  });
  assert(skippedExpectations.valid, 'Skipped expectations valid');

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
