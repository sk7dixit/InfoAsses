import app from '../app';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Server } from 'http';

interface TestResult {
  test: string;
  expected: string;
  actualStatus: number;
  passed: boolean;
  notes: string;
}

const results: TestResult[] = [];

async function runTests() {
  const PORT = 5099;
  const server: Server = app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🧪 Starting JWT Authentication Outside Test Suite`);
    console.log(`   Running on http://localhost:${PORT}`);
    console.log(`=================================================\n`);
  });

  const baseUrl = `http://localhost:${PORT}/api/v1`;

  let adminToken = '';
  let salesToken = '';

  try {
    // -------------------------------------------------------------
    // Test 1a: Login with valid credentials (Admin)
    // -------------------------------------------------------------
    const res1a = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@erp.com', password: 'admin123' }),
    });
    const body1a: any = await res1a.json();

    let test1aPassed = false;
    let test1aNotes = '';

    if (res1a.status === 200 && body1a.data?.token) {
      adminToken = body1a.data.token;
      const userObj = body1a.data.user;
      const decoded: any = jwt.decode(adminToken);

      const hasNoPassword = userObj.password === undefined && userObj.passwordHash === undefined;
      const hasExpectedFields = decoded?.id && decoded?.role === 'ADMIN' && decoded?.exp !== undefined;

      if (hasNoPassword && hasExpectedFields) {
        test1aPassed = true;
        test1aNotes = `Token issued successfully. Password hidden. Role: ${decoded.role}, Exp: ${new Date(decoded.exp * 1000).toISOString()}`;
      } else {
        test1aNotes = `Token returned but validation failed. Password hidden: ${hasNoPassword}, Fields valid: ${hasExpectedFields}`;
      }
    } else {
      test1aNotes = `Failed login. Message: ${body1a.message || 'Unknown error'}`;
    }

    results.push({
      test: '1a. Login (Valid credentials)',
      expected: '200 OK + JWT returned + Password omitted',
      actualStatus: res1a.status,
      passed: test1aPassed,
      notes: test1aNotes,
    });

    // -------------------------------------------------------------
    // Test 1b: Login with wrong password
    // -------------------------------------------------------------
    const res1b = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@erp.com', password: 'wrongpassword' }),
    });
    const body1b: any = await res1b.json();

    results.push({
      test: '1b. Login (Wrong password)',
      expected: '401 Unauthorized',
      actualStatus: res1b.status,
      passed: res1b.status === 401,
      notes: `Response message: "${body1b.message}"`,
    });

    // -------------------------------------------------------------
    // Test 2: Protected route without token
    // -------------------------------------------------------------
    const res2 = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
    });
    const body2: any = await res2.json();

    results.push({
      test: '2. Protected route without token',
      expected: '401 Unauthorized',
      actualStatus: res2.status,
      passed: res2.status === 401,
      notes: `Response message: "${body2.message}"`,
    });

    // -------------------------------------------------------------
    // Test 3: Protected route with valid token
    // -------------------------------------------------------------
    const res3 = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const body3: any = await res3.json();

    results.push({
      test: '3. Protected route with valid token',
      expected: '200 OK + User data returned',
      actualStatus: res3.status,
      passed: res3.status === 200 && body3.data?.email === 'admin@erp.com',
      notes: `Fetched user profile for: ${body3.data?.email} (${body3.data?.role})`,
    });

    // -------------------------------------------------------------
    // Test 4: Protected route with modified/fake token
    // -------------------------------------------------------------
    const fakeToken = adminToken.slice(0, -5) + 'XXXXX';
    const res4 = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${fakeToken}` },
    });
    const body4: any = await res4.json();

    results.push({
      test: '4. Protected route with modified/fake token',
      expected: '401 Unauthorized',
      actualStatus: res4.status,
      passed: res4.status === 401,
      notes: `Response message: "${body4.message}"`,
    });

    // -------------------------------------------------------------
    // Test 5: Protected route with expired token
    // -------------------------------------------------------------
    const expiredToken = jwt.sign(
      { id: 'fake-user-id', email: 'test@example.com', role: 'ADMIN', name: 'Test' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }
    );

    const res5 = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    const body5: any = await res5.json();

    results.push({
      test: '5. Protected route with expired token',
      expected: '401 Unauthorized',
      actualStatus: res5.status,
      passed: res5.status === 401,
      notes: `Response message: "${body5.message}"`,
    });

    // -------------------------------------------------------------
    // Test 6a: Role-based authorization - Admin accessing Admin route (/api/v1/users)
    // -------------------------------------------------------------
    const res6a = await fetch(`${baseUrl}/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const body6a: any = await res6a.json();

    results.push({
      test: '6a. Role-based Auth (Admin token -> /api/v1/users)',
      expected: '200 OK',
      actualStatus: res6a.status,
      passed: res6a.status === 200,
      notes: `Admin granted access. User count: ${Array.isArray(body6a.data) ? body6a.data.length : 'N/A'}`,
    });

    // -------------------------------------------------------------
    // Test 6b: Role-based authorization - Sales (Non-Admin) accessing Admin route
    // -------------------------------------------------------------
    const resSalesLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sales@erp.com', password: 'sales123' }),
    });
    const bodySalesLogin: any = await resSalesLogin.json();
    salesToken = bodySalesLogin.data?.token || '';

    const res6b = await fetch(`${baseUrl}/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${salesToken}` },
    });
    const body6b: any = await res6b.json();

    results.push({
      test: '6b. Role-based Auth (Employee/Sales token -> /api/v1/users)',
      expected: '403 Forbidden',
      actualStatus: res6b.status,
      passed: res6b.status === 403,
      notes: `Response message: "${body6b.message}"`,
    });

    // -------------------------------------------------------------
    // Test 7: Logout
    // -------------------------------------------------------------
    const res7 = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const body7: any = await res7.json();

    results.push({
      test: '7. Logout route (/api/v1/auth/logout)',
      expected: '200 OK',
      actualStatus: res7.status,
      passed: res7.status === 200,
      notes: `Response message: "${body7.message}"`,
    });

  } catch (err: any) {
    console.error('❌ Test execution error:', err);
  } finally {
    server.close();
  }

  // Output formatting
  console.log('--------------------------------------------------------------------------------------------------');
  console.log('| Test Case                                     | Expected Result                       | Status | Pass? | Notes');
  console.log('--------------------------------------------------------------------------------------------------');

  let allPassed = true;
  for (const r of results) {
    const pStr = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(
      `| ${r.test.padEnd(45)} | ${r.expected.padEnd(37)} | ${String(r.actualStatus).padEnd(6)} | ${pStr.padEnd(5)} | ${r.notes}`
    );
  }
  console.log('--------------------------------------------------------------------------------------------------');

  if (allPassed) {
    console.log('\n🎉 ALL 8 JWT AUTHENTICATION TEST CASES PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️ SOME TEST CASES FAILED. Please inspect output above.\n');
    process.exit(1);
  }
}

runTests();
