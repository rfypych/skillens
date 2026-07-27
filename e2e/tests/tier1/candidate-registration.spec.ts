import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Candidate Registration & Files (Tier 1)', () => {
  
  test.beforeEach(async ({ page, request }) => {
    // Generate a unique IP to bypass rate limit of 5/min per IP
    const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': ip });
  });

  test('Test 1: Happy Path - Complete Candidate Registration', async ({ page }) => {
    const timestamp = Date.now();
    const email = `john.candidate+${timestamp}@example.com`;

    await page.goto('/signup');

    // Make sure we wait for load
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();

    await page.locator('input[name="full_name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('ValidPass123!');

    await page.getByRole('button', { name: /create candidate account/i }).click();

    await page.waitForURL('**/candidate/dashboard');
    expect(page.url()).toContain('/candidate/dashboard');
  });

  test('Test 2: Validation - Missing Required Fields', async ({ page }) => {
    await page.goto('/signup');

    // Expect Create Candidate Account to exist
    await expect(page.getByRole('button', { name: /create candidate account/i })).toBeVisible();

    await page.getByRole('button', { name: /create candidate account/i }).click();

    expect(page.url()).toContain('/signup');
    
    // Check validation state
    const isInvalid = await page.$eval('input[name="full_name"]', (el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('Test 3: Validation - Invalid Password Complexity', async ({ page }) => {
    const timestamp = Date.now();
    const email = `shortpass+${timestamp}@example.com`;

    await page.goto('/signup');
    await page.locator('input[name="full_name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('short'); 

    await page.getByRole('button', { name: /create candidate account/i }).click();

    // The API error will have "Password must be at least 8 characters"
    await expect(page.locator('text=/Password must be at least 8 characters/i')).toBeVisible({ timeout: 10000 });
  });

  test('Test 4: Validation - Duplicate Email Registration', async ({ page, request }) => {
    const timestamp = Date.now();
    const email = `duplicate+${timestamp}@example.com`;

    const res = await request.post('http://localhost:8000/auth/signup', {
      data: {
        full_name: 'Existing User',
        email: email,
        password: 'ValidPass123!',
        role: 'candidate'
      }
    });
    expect(res.ok()).toBeTruthy();

    await page.goto('/signup');
    await page.locator('input[name="full_name"]').fill('John Doe 2');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('ValidPass123!');
    await page.getByRole('button', { name: /create candidate account/i }).click();

    await expect(page.getByText(/Email already registered/i)).toBeVisible();
  });

  test('Test 5: Happy Path - Resume Upload via Candidate Profile', async ({ page }) => {
    const timestamp = Date.now();
    const email = `upload+${timestamp}@example.com`;

    await page.goto('/signup');
    await page.locator('input[name="full_name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('ValidPass123!');
    await page.getByRole('button', { name: /create candidate account/i }).click();
    await page.waitForURL('**/candidate/dashboard');

    await page.goto('/candidate/profile');

    const dummyPdfContent = Buffer.from('dummy pdf file content');
    
    await page.locator('input[type="file"]').setInputFiles({
      name: 'dummy_resume.pdf',
      mimeType: 'application/pdf',
      buffer: dummyPdfContent
    });

    await expect(page.getByText(/Resume uploaded successfully/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /view uploaded resume/i })).toBeVisible();
  });
});
