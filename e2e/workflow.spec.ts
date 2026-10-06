import { test, expect } from '@playwright/test';

test.describe('TRACE-X End-to-End Investigation Workflow', () => {
  test('Complete flow: Landing Page -> Auth -> Dashboard -> New Case -> Network -> Missing Link -> Audit Log', async ({ page }) => {
    // Log browser console messages and errors
    page.on('console', msg => console.log('[BROWSER]', msg.text()));
    page.on('pageerror', err => console.log('[BROWSER ERROR]', err.message));

    // Auto-accept alerts and confirmations
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Intercept Keycloak auth endpoint to simulate successful Keycloak OIDC authorization
    await page.route(/.*(:8080|\/realms\/).*/, async (route) => {
      const url = new URL(route.request().url());
      const redirectUri = url.searchParams.get('redirect_uri') || 'http://localhost:5173/auth/callback';
      const state = url.searchParams.get('state') || '';
      await route.fulfill({
        status: 302,
        headers: {
          Location: `${redirectUri}?code=kc_auth_code_e2e&state=${state}`,
        },
      });
    });

    // Handle /api/v1 requests with schema-compliant responses conforming to Phases B-L
    await page.route(/.*\/api\/v1\/.*/, async (route) => {
      const url = route.request().url();
      const method = route.request().method();

        if (url.includes('/auth/token') || url.includes('/auth/refresh')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              access_token: 'mock_jwt_token_e2e',
              token_type: 'bearer',
              expires_in: 3600,
              requires_webauthn: true,
              user: {
                sub: 'officer_vikram',
                name: 'Insp. Vikram Deshmukh',
                email: 'v.deshmukh@police.local',
                badgeNumber: 'MH-POL-4412',
                station: 'Central Division Police Station, Zone 3',
                authorityId: 'auth-local-zone3',
                authorityTier: 'LOCAL',
                roles: ['local-authority', 'investigator', 'supervisor'],
              },
            }),
          });
        } else if (url.includes('/dashboard/summary')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              totalCases: 24,
              activeAnomalies: 5,
              pendingDataRequests: 3,
              sharedIntelligencePayloads: 12,
              recentCases: [],
              attentionCases: [],
            }),
          });
        } else if (url.includes('/cases') && method === 'POST' && !url.includes('/documents') && !url.includes('/entities')) {
          const body = route.request().postDataJSON() || {};
          const caseNumber = body.caseNumber || 'CASE-2026-8891';
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              id: caseNumber,
              caseNumber,
              title: body.title || 'Hawala Logistics & Shadow Syndicate',
              crimeType: body.crimeType || 'Financial Crime',
              priority: body.priority || 'HIGH',
              status: 'ACTIVE',
              leadOfficer: 'Insp. Vikram Deshmukh',
              entitiesCount: 4,
              createdDate: '2026-03-30',
              description: body.summary || 'Initial investigation documentation verified.',
            }),
          });
        } else if (url.includes('/documents') || url.includes('/entities')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, document_id: 'DOC-2026-01', filename: 'evidence.txt' }),
          });
        } else if (url.includes('/missing-links')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 'ML-001',
                caseId: 'CASE-2026-8891',
                sourceEntity: { id: 'ENT-01', name: 'Al-Mansoor Trading LLC', type: 'ORGANIZATION' },
                targetEntity: { id: 'ENT-04', name: 'Tahir Merchant (Alias: Bablu)', type: 'PERSON' },
                evidenceStrength: 'STRONG',
                connectionBasis: [
                  'Hawala Remittance Transit Pattern',
                  'Co-located Telecom Tower Registration',
                  'Automated Topology Anomaly Flag'
                ],
                evidenceBasis: [
                  'Cryptographic transfer ledger corroboration matches known syndicate banking node.',
                  'Cellular tower handover logs place both subjects at Nhava Sheva transit yard within 14-minute window.',
                  'Financial Intelligence Unit cross-border suspicious transaction report CTR-2026-8812.'
                ],
                status: 'PENDING',
                score: 0.94
              }
            ]),
          });
        } else if (url.includes('/network')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              { data: { id: 'node1', label: 'Al-Mansoor Trading LLC', nodeType: 'ORGANIZATION', category: 'VERIFIED', connectionsCount: 2 } },
              { data: { id: 'node2', label: 'Tahir Merchant', nodeType: 'PERSON', category: 'VERIFIED', connectionsCount: 1 } },
              { data: { id: 'edge1', source: 'node1', target: 'node2', label: 'TRANSACTION', category: 'VERIFIED' } }
            ]),
          });
        } else if (url.includes('/cases/')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'CASE-2026-8891',
              caseNumber: 'CASE-2026-8891',
              title: 'Operation Apex 8891',
              crimeType: 'Financial Crime / Syndicate Hawala',
              priority: 'HIGH',
              status: 'ACTIVE',
              leadOfficer: 'Insp. Vikram Deshmukh',
              entitiesCount: 4,
              createdDate: '2026-03-30',
              description: 'Initial investigation documentation verified.',
            }),
          });
        } else if (url.includes('/audit')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 'AUDIT-2026-9901',
                timestamp: '2026-03-30 20:30:11 UTC',
                officer: 'Insp. Vikram Deshmukh',
                badgeNumber: 'MH-POL-4412',
                action: 'CASE_INVESTIGATION_CREATED',
                caseRef: 'CASE-2026-8891',
                details: 'New criminal investigation dossier registered with 4 confirmed entities.',
                ipAddress: '10.0.4.12'
              },
              {
                id: 'AUDIT-2026-9902',
                timestamp: '2026-03-30 20:31:05 UTC',
                officer: 'Insp. Vikram Deshmukh',
                badgeNumber: 'MH-POL-4412',
                action: 'MISSING_LINK_FLAGGED',
                caseRef: 'CASE-2026-8891',
                details: 'AI anomaly detection candidate connection generated with STRONG evidence strength.',
                ipAddress: '10.0.4.12'
              }
            ]),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        }
    });

    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/TRACE-X/);

    // Verify "X" wordmark button is present
    const xButton = page.locator('#landing-x-button');
    await expect(xButton).toBeVisible();

    // 2. Click "X" wordmark to navigate to Authority Selection (/login)
    await xButton.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Select Your Authority Level')).toBeVisible();

    // 3. Click "Login as Local"
    const loginLocalBtn = page.locator('#btn-login-local');
    await expect(loginLocalBtn).toBeVisible();
    await loginLocalBtn.click();

    // Wait for redirect to /webauthn-enroll or /dashboard
    await page.waitForURL(/.*(webauthn-enroll|dashboard).*/, { timeout: 20000 });

    // If routed to /webauthn-enroll, complete key registration
    if (page.url().includes('/webauthn-enroll')) {
      const registerBtn = page.locator('#btn-register-webauthn');
      await registerBtn.waitFor({ state: 'visible', timeout: 10000 });
      await registerBtn.click();

      const proceedBtn = page.locator('#btn-proceed-dashboard');
      await proceedBtn.waitFor({ state: 'visible', timeout: 10000 });
      await proceedBtn.click();
    }

    // 4. Verify Dashboard landing
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.locator('text=Local Authority Investigation Dashboard')).toBeVisible();

    // 5. Navigate to New Case Wizard
    const newCaseBtn = page.locator('button:has-text("Create New Case")');
    if (await newCaseBtn.isVisible()) {
      await newCaseBtn.click();
    } else {
      await page.goto('/cases/new');
    }
    await expect(page).toHaveURL(/\/cases\/new/);
    await expect(page.locator('text=Step 1: Enter Investigation Case Details')).toBeVisible();

    // Step 1: Case Details
    const uniqueTitle = `Operation Apex ${Date.now().toString().slice(-4)}`;
    await page.fill('#case-title', uniqueTitle);
    await page.selectOption('#crime-type', 'Financial Crime / Syndicate Hawala');
    await page.selectOption('#priority-level', 'HIGH');
    await page.fill('#case-narrative', 'Interstate financial conduit tracking and Hawala transit point operations.');
    await page.click('button:has-text("Proceed to Upload Data")');

    // Step 2: Evidence Upload
    await expect(page.locator('text=Step 2: Upload Investigation Data Files')).toBeVisible();
    
    // Attach simulated evidence document via file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'cdr_log_intercept.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('CDR Handover Logs: Source +91-98201-11223, Destination Hawala Hub Zone 4'),
    });

    await page.click('button:has-text("Start Entity Extraction")');

    // Step 3 & 4: Review Extracted Entities
    await expect(page.locator('text=Step 4: Review Extracted Entity Candidates')).toBeVisible({ timeout: 15000 });
    
    // Confirm extracted entities to satisfy allResolved requirement
    const entityConfirmBtns = page.locator('button:has-text("Confirm"):not(#btn-confirm-review)');
    while ((await entityConfirmBtns.count()) > 0) {
      await entityConfirmBtns.first().click();
      await page.waitForTimeout(100);
    }

    // Step 5: Advance to Final Review and Register Case
    await page.click('#btn-confirm-review');
    await expect(page.locator('text=Step 5: Final Review & Register Case')).toBeVisible();
    await page.click('button:has-text("Register & Open Case File")');

    // Navigates to Case Workspace
    await expect(page).toHaveURL(/\/cases\/CASE-2026-/, { timeout: 15000 });

    // Upload another document in case workspace to fulfill requirement
    const uploadDocBtn = page.locator('button:has-text("Upload Document")');
    if (await uploadDocBtn.isVisible()) {
      const caseFileInput = page.locator('input[type="file"]');
      await caseFileInput.setInputFiles({
        name: 'surveillance_report_supplement.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('%PDF-1.4 Mock Surveillance Report'),
      });
    }

    // 6. Navigate to Network Analysis
    const networkNavBtn = page.locator('button:has-text("Network Analysis")');
    if (await networkNavBtn.isVisible()) {
      await networkNavBtn.click();
    } else {
      const currentUrl = page.url();
      await page.goto(`${currentUrl}/network`);
    }
    await expect(page).toHaveURL(/\/network/);
    await expect(page.locator('text=Legend & Node Shapes')).toBeVisible({ timeout: 15000 });

    // 7. Navigate to Missing Link Analysis
    const missingLinkBtn = page.locator('button:has-text("Missing Link Analysis")');
    if (await missingLinkBtn.isVisible()) {
      await missingLinkBtn.click();
    } else {
      const currentUrl = page.url().replace('/network', '/missing-links');
      await page.goto(currentUrl);
    }

    await expect(page).toHaveURL(/\/missing-links/);
    await expect(page.locator('text=Candidate Connection')).toBeVisible({ timeout: 15000 });

    // Verify candidate card has evidence_strength badge (STRONG / MODERATE / LIMITED)
    const strengthBadge = page.locator('text=/Strength: (STRONG|MODERATE|LIMITED)/');
    await expect(strengthBadge).toBeVisible();

    // Verify readable evidence basis text and AI_ANALYSIS source badge
    await expect(page.locator('text=Underlying Forensic Evidence Basis')).toBeVisible();
    await expect(page.locator('text=AI ANALYSIS').first()).toBeVisible();

    // Critical assertion: NO raw numeric / continuous float scores (e.g. 0.87, 0.42) visible anywhere in the card DOM
    const cardContent = await page.locator('main, .app-shell-content, div[style*="flex-direction: column"]').first().innerText();
    const rawScoreMatch = cardContent.match(/\b0\.\d{2,}\b/);
    expect(rawScoreMatch, `Found forbidden raw numeric score in DOM: ${rawScoreMatch?.[0]}`).toBeNull();

    // 8. Navigate to Statutory Audit Log
    await page.goto('/audit');
    await expect(page).toHaveURL(/\/audit/);
    await expect(page.locator('text=Station Statutory Audit Log')).toBeVisible();
    await expect(page.locator('text=Cryptographically Chained')).toBeVisible();
    
    // Check that audit rows are rendered
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 15000 });
  });
});
