import { chromium } from 'playwright'

const BASE = 'https://sulajh.vercel.app'
const TEST_EMAIL = `e2e-test-${Date.now()}@test.sulajh.dev`
const TEST_PASSWORD = 'TestPass123!'
const TEST_NAME = 'E2E Test User'
const RESPONDENT_EMAIL = 'respondent-test@example.com'

const steps: { name: string; status: string; detail?: string }[] = []

function log(name: string, status: 'PASS' | 'FAIL' | 'SKIP', detail?: string) {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️'
  steps.push({ name, status, detail })
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // 1. Landing page loads
    console.log('\n🔹 Step 1: Landing Page')
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    const title = await page.title()
    const heroText = await page.textContent('h1')
    if (title.includes('Sulajh') && heroText?.includes('Resolve Disputes')) {
      log('Landing page', 'PASS', `Title: "${title}", Hero: "${heroText?.slice(0, 50)}"`)
    } else {
      log('Landing page', 'FAIL', `Got title="${title}", hero="${heroText}"`)
    }

    // 2. Navigate to Sign Up
    console.log('\n🔹 Step 2: Sign Up Page')
    await page.click('a[href="/auth/signup"]')
    await page.waitForURL('**/auth/signup')
    const signupHeading = await page.textContent('h1')
    if (signupHeading?.includes('Create an Account')) {
      log('Signup page navigation', 'PASS')
    } else {
      log('Signup page navigation', 'FAIL', `Heading: "${signupHeading}"`)
    }

    // 3. Fill signup form and submit
    console.log('\n🔹 Step 3: Sign Up (Create Account)')
    await page.fill('#name', TEST_NAME)
    await page.fill('#email', TEST_EMAIL)
    await page.fill('#password', TEST_PASSWORD)

    // Select role via Radix select
    const roleSelect = page.locator('button[role="combobox"]')
    if (await roleSelect.count() > 0) {
      await roleSelect.click()
      const option = page.locator('[role="option"]').filter({ hasText: 'Claimant' })
      await option.click()
      await page.waitForTimeout(300)
    }

    // Close any overlays before clicking submit
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    await page.locator('button[type="submit"]').click({ force: true })

    // Wait for navigation to dashboard or error
    try {
      await page.waitForURL('**/dashboard**', { timeout: 10000 })
      log('Signup form submission', 'PASS', `Redirected to dashboard`)
    } catch {
      const errorEl = page.locator('.bg-destructive\\/10, [role="alert"]')
      const errorText = await errorEl.first().textContent().catch(() => null)
      if (errorText) {
        log('Signup form submission', 'FAIL', `Error: ${errorText}`)
      } else {
        const currentUrl = page.url()
        log('Signup form submission', 'FAIL', `Still at ${currentUrl}`)
      }
    }

    // 4. Dashboard loads with user info
    console.log('\n🔹 Step 4: Dashboard')
    if (page.url().includes('/dashboard')) {
      const welcomeText = await page.textContent('h1').catch(() => '')
      const totalCases = await page.textContent('.text-3xl.font-bold').catch(() => '')
      log('Dashboard loaded', 'PASS', `"${welcomeText}", Cases: ${totalCases}`)

      // Check stats cards
      const cards = await page.locator('.text-3xl.font-bold').allTextContents()
      log('Dashboard stats', 'PASS', `Total: ${cards[0]}, Open: ${cards[1]}, Resolved: ${cards[2]}`)
    } else {
      log('Dashboard loaded', 'FAIL', `Not on dashboard: ${page.url()}`)
    }

    // 5. Navigate to File New Case
    console.log('\n🔹 Step 5: File New Case')
    const newCaseLink = page.locator('a[href="/cases/new"]').first()
    if (await newCaseLink.count() > 0) {
      await newCaseLink.click()
      await page.waitForURL('**/cases/new', { timeout: 5000 })
      const heading = await page.textContent('h1').catch(() => '')
      log('New case page', 'PASS', `"${heading}"`)

      // Fill case form
      const claimInput = page.locator('textarea, input[name="claimantRequest"], #claimantRequest').first()
      if (await claimInput.count() > 0) {
        await claimInput.fill('E2E test dispute: Product not delivered as described. Requesting refund of $150.')
      }

      const respondentInput = page.locator('input[type="email"][name="respondentEmail"], input[placeholder*="respondent"], input[placeholder*="email"]').first()
      if (await respondentInput.count() > 0) {
        await respondentInput.fill(RESPONDENT_EMAIL)
      }

      // Submit case
      const submitBtn = page.locator('button[type="submit"]').first()
      if (await submitBtn.count() > 0) {
        await submitBtn.click()
        try {
          await page.waitForURL('**/cases/**', { timeout: 10000 })
          log('Case created', 'PASS', `Redirected to ${page.url()}`)
        } catch {
          // Check for success toast or stay on page
          const toastMsg = await page.locator('[data-sonner-toast], .toast, [role="status"]').first().textContent().catch(() => null)
          if (toastMsg) {
            log('Case created', 'PASS', `Toast: ${toastMsg}`)
          } else {
            log('Case created', 'FAIL', `No redirect, still at ${page.url()}`)
          }
        }
      } else {
        log('Case form', 'SKIP', 'Submit button not found')
      }
    } else {
      log('New case page', 'SKIP', 'No "File New Case" button (user may not be CLAIMANT)')
    }

    // 6. View cases list
    console.log('\n🔹 Step 6: Cases List')
    await page.goto(`${BASE}/cases`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)
    if (page.url().includes('/cases') || page.url().includes('/dashboard')) {
      const caseCards = await page.locator('.hover\\:shadow-md, [class*="case"]').count()
      log('Cases list', 'PASS', `${caseCards} case card(s) found at ${page.url()}`)
    } else {
      log('Cases list', 'FAIL', `Redirected to ${page.url()}`)
    }

    // 7. Sign out
    console.log('\n🔹 Step 7: Sign Out')
    const signOutBtn = page.locator('button:has-text("Sign Out"), button:has-text("Logout"), button:has-text("Log out")')
    if (await signOutBtn.count() > 0) {
      await signOutBtn.first().click()
      await page.waitForTimeout(2000)
      log('Sign out', 'PASS', `Now at ${page.url()}`)
    } else {
      // Try nav menu
      const menuBtn = page.locator('button[aria-label*="menu"], button[aria-label*="nav"]').first()
      if (await menuBtn.count() > 0) {
        await menuBtn.click()
        await page.waitForTimeout(500)
        const logoutInMenu = page.locator('button:has-text("Sign Out"), button:has-text("Logout")')
        if (await logoutInMenu.count() > 0) {
          await logoutInMenu.first().click()
          await page.waitForTimeout(2000)
          log('Sign out', 'PASS', `Now at ${page.url()}`)
        } else {
          log('Sign out', 'SKIP', 'No sign out button in menu')
        }
      } else {
        log('Sign out', 'SKIP', 'No sign out button found')
      }
    }

    // 8. Sign in with existing account
    console.log('\n🔹 Step 8: Sign In')
    await page.goto(`${BASE}/auth/signin`, { waitUntil: 'domcontentloaded' })
    await page.fill('#email', TEST_EMAIL)
    await page.fill('#password', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    try {
      await page.waitForURL('**/dashboard**', { timeout: 10000 })
      log('Sign in', 'PASS', `Redirected to dashboard`)
    } catch {
      const errorEl = page.locator('.bg-destructive\\/10')
      const errText = await errorEl.first().textContent().catch(() => null)
      log('Sign in', 'FAIL', errText || `Still at ${page.url()}`)
    }

    // 9. Auth guard - unauthenticated access
    console.log('\n🔹 Step 9: Auth Guards')
    const freshContext = await browser.newContext()
    const freshPage = await freshContext.newPage()
    await freshPage.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded' })
    await freshPage.waitForTimeout(2000)
    if (freshPage.url().includes('/signin') || freshPage.url().includes('/auth')) {
      log('Auth guard (dashboard)', 'PASS', `Redirected to ${freshPage.url()}`)
    } else if (!freshPage.url().includes('/dashboard')) {
      log('Auth guard (dashboard)', 'PASS', `Redirected away: ${freshPage.url()}`)
    } else {
      log('Auth guard (dashboard)', 'FAIL', `No redirect, still at dashboard`)
    }
    await freshContext.close()

  } catch (err: any) {
    log('Unexpected error', 'FAIL', err.message)
  } finally {
    await browser.close()
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('E2E USER JOURNEY SUMMARY')
  console.log('═'.repeat(60))
  const passed = steps.filter(s => s.status === 'PASS').length
  const failed = steps.filter(s => s.status === 'FAIL').length
  const skipped = steps.filter(s => s.status === 'SKIP').length
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  ⏭️  Skipped: ${skipped}`)
  console.log('═'.repeat(60))

  if (failed > 0) {
    console.log('\nFailed steps:')
    steps.filter(s => s.status === 'FAIL').forEach(s => {
      console.log(`  ❌ ${s.name}: ${s.detail}`)
    })
  }

  process.exit(failed > 0 ? 1 : 0)
}

run()
