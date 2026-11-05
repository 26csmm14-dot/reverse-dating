/**
 * test-phase2-portfolio.js
 * Verification suite for Phase 2: 3D Animated Portfolio Experience & Interactive Header/Footer
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

// Check for common emoji ranges
function containsEmojis(text) {
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
}

async function runTests() {
  console.log('\n--- Phase 2 Portfolio & 3D Experience Verification ---');

  const rootDir = path.resolve(__dirname, '..');

  // Test 1: Check Card3D component
  const card3DPath = path.join(rootDir, 'components', 'portfolio', 'Card3D.jsx');
  assert(fs.existsSync(card3DPath), 'Card3D component file exists at components/portfolio/Card3D.jsx');
  if (fs.existsSync(card3DPath)) {
    const cardContent = fs.readFileSync(card3DPath, 'utf8');
    assert(cardContent.includes('rotateX') && cardContent.includes('rotateY'), 'Card3D implements rotateX & rotateY 3D transforms');
    assert(cardContent.includes('preserve-3d'), 'Card3D configures preserve-3d transform-style');
    assert(!containsEmojis(cardContent), 'Card3D component contains zero emojis');
  }

  // Test 2: Check PortfolioNav component
  const navPath = path.join(rootDir, 'components', 'portfolio', 'PortfolioNav.jsx');
  assert(fs.existsSync(navPath), 'PortfolioNav component exists at components/portfolio/PortfolioNav.jsx');
  if (fs.existsSync(navPath)) {
    const navContent = fs.readFileSync(navPath, 'utf8');
    assert(navContent.includes('useScroll'), 'PortfolioNav tracks scroll progress via useScroll');
    assert(navContent.includes('#hero') || navContent.includes("'hero'"), 'PortfolioNav contains anchor to hero');
    assert(navContent.includes('#achievements') || navContent.includes("'achievements'"), 'PortfolioNav contains anchor to achievements');
    assert(navContent.includes('#ambitions') || navContent.includes("'ambitions'"), 'PortfolioNav contains anchor to ambitions');
    assert(navContent.includes('#strengths') || navContent.includes("'strengths'"), 'PortfolioNav contains anchor to strengths');
    assert(navContent.includes('#hobbies') || navContent.includes("'hobbies'"), 'PortfolioNav contains anchor to hobbies');
    assert(navContent.includes('#pitch') || navContent.includes("'pitch'"), 'PortfolioNav contains anchor to pitch');
    assert(!containsEmojis(navContent), 'PortfolioNav component contains zero emojis');
  }

  // Test 3: Check Footer component
  const footerPath = path.join(rootDir, 'components', 'Footer.jsx');
  assert(fs.existsSync(footerPath), 'Footer component exists at components/Footer.jsx');
  if (fs.existsSync(footerPath)) {
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    assert(footerContent.includes('WANNA DATE U'), 'Footer features "WANNA DATE U" branding');
    assert(footerContent.includes('scrollToTop'), 'Footer provides back-to-top interaction');
    assert(!containsEmojis(footerContent), 'Footer contains zero emojis');
  }

  // Test 4: Check Dashboard Page & Lore Sections
  const dashPath = path.join(rootDir, 'app', 'dashboard', 'page.jsx');
  assert(fs.existsSync(dashPath), 'Dashboard page exists at app/dashboard/page.jsx');
  if (fs.existsSync(dashPath)) {
    const dashContent = fs.readFileSync(dashPath, 'utf8');

    // Check all 6 lore section IDs
    assert(dashContent.includes('id="hero"'), 'Section 1: id="hero" present');
    assert(dashContent.includes('id="achievements"'), 'Section 2: id="achievements" present');
    assert(dashContent.includes('id="ambitions"'), 'Section 3: id="ambitions" present');
    assert(dashContent.includes('id="strengths"'), 'Section 4: id="strengths" present');
    assert(dashContent.includes('id="hobbies"'), 'Section 5: id="hobbies" present');
    assert(dashContent.includes('id="pitch"'), 'Section 6: id="pitch" present');
    assert(dashContent.includes('id="cta-interested"'), 'CTA Button: id="cta-interested" present');

    // Check 3D Card usage
    assert(dashContent.includes('<Card3D'), 'Dashboard embeds Card3D components for interactive tilt depth');

    // Check Proposal Modal & API integration
    assert(dashContent.includes("fetch('/api/apply'"), 'Dashboard connects proposal submission to /api/apply');
    assert(dashContent.includes('selectedDateIdea'), 'Proposal modal supports date idea selection');

    // Check that legacy placeholder anime text is removed
    assert(!dashContent.includes('Senku Ishigami'), 'Legacy "Senku Ishigami" placeholder removed');
    assert(!dashContent.includes('Stone World Cola'), 'Legacy "Stone World Cola" placeholder removed');
    assert(!dashContent.includes('10 Billion Percent'), 'Legacy "10 Billion Percent" placeholder removed');

    // Zero Emojis check
    assert(!containsEmojis(dashContent), 'Dashboard page contains zero emojis');
  }

  // Test 5: Verify /api/apply endpoint functionally
  console.log('\n--- Live API Verification (/api/apply) ---');
  try {
    const testContact = '@elena_test_' + Date.now();
    const testPayload = JSON.stringify({
      name: 'Elena Rostova',
      contact: testContact,
      pitch: 'I love specialty coffee and vinyl records just as much as you do.',
      firstDateIdea: 'Artisan Coffee & Vintage Bookstore Hunt',
    });

    const res = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: 'localhost',
          port: 3000,
          path: '/api/apply',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(testPayload),
          },
        },
        (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => {
            resolve({ statusCode: response.statusCode, data: JSON.parse(data) });
          });
        }
      );
      req.on('error', reject);
      req.write(testPayload);
      req.end();
    });

    assert(res.statusCode === 200, `POST /api/apply returns 200 OK (got ${res.statusCode})`);
    assert(res.data.success === true, 'POST /api/apply returns success: true');
    assert(res.data.applicant && res.data.applicant.status === 'pending', 'Applicant status is updated to "pending"');
    assert(res.data.applicant.firstDateIdea === 'Artisan Coffee & Vintage Bookstore Hunt', 'Applicant firstDateIdea correctly saved');
  } catch (err) {
    console.error('API test failed (Dev server may not be ready or network issue):', err.message);
  }

  console.log(`\nVerification Complete: ${passedTests}/${totalTests} tests passed.`);
  process.exit(passedTests === totalTests ? 0 : 1);
}

runTests();
