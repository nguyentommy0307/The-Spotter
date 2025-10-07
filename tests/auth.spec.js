import { test, expect } from '@playwright/test';

test.describe.serial('User Registration and Login Flow', () => {
    let user;

    test.beforeEach(() => {
        user = {
            username: `testuser_${Date.now()}`,
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        };
    });

    test('should allow a new user to register', async ({ page }) => {
        await page.goto('/register');

        await page.locator('input[name="username"]').fill(user.username);
        await page.locator('input[name="email"]').fill(user.email);
        await page.locator('input[name="password"]').fill(user.password);

        await page.locator('#register-button').click();

        await expect(page).toHaveURL('/spotters');
    });

    test('should allow a registered user to log in and then log out', async ({ page }) => {
        await page.request.post('/register', {
            form: {
                username: user.username,
                email: user.email,
                password: user.password
            }
        });

        await page.goto('/login');
        await page.locator('input[name="username"]').fill(user.username);
        await page.locator('input[name="password"]').fill(user.password);
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL('/spotters');
        await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

        await page.getByRole('link', { name: 'Logout' }).click();
        
        await expect(page).toHaveURL('/spotters');
        await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    });
});