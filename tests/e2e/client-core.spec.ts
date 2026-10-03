import { test, expect } from '@playwright/test'

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required E2E environment variable: ${name}`)
  return value
}

test.describe('Client Core authenticated flow', () => {
  test('login → workspace → client create → edit → note → search', async ({ page }) => {
    const email = requiredEnv('NUS_E2E_EMAIL')
    const password = requiredEnv('NUS_E2E_PASSWORD')
    const workspaceName = requiredEnv('NUS_E2E_WORKSPACE_NAME')
    if (!workspaceName.startsWith('E2E ')) {
      throw new Error('NUS_E2E_WORKSPACE_NAME must start with "E2E " to prevent accidental real-workspace mutation')
    }
    const unique = Date.now().toString(36)
    const clientName = `E2E Client ${unique}`
    const noteBody = `E2E note ${unique}`
    const updatedName = `${clientName} Updated`

    await page.goto('/login')
    await page.getByLabel('البريد الإلكتروني').fill(email)
    await page.getByLabel('كلمة المرور').fill(password)
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click()

    await expect(page).toHaveURL(/\/today$/)

    const createWorkspaceButton = page.getByRole('button', { name: 'إنشاء مساحة العمل' })
    if (await createWorkspaceButton.isVisible().catch(() => false)) {
      await page.getByLabel('اسم النشاط').fill(workspaceName)
      await page.getByLabel('المنطقة الزمنية').fill('Africa/Cairo')
      await createWorkspaceButton.click()
      await expect(page.getByText(workspaceName)).toBeVisible()
    }

    // Fail closed: a pre-existing non-E2E workspace must never be mutated.
    await expect(page.getByText(workspaceName, { exact: true })).toBeVisible()

    await page.getByRole('link', { name: 'العملاء' }).click()
    await expect(page).toHaveURL(/\/clients$/)

    await page.getByRole('link', { name: /عميل جديد/ }).click()
    await expect(page).toHaveURL(/\/clients\/new$/)

    await page.getByLabel('اسم العميل *').fill(clientName)
    await page.getByLabel('رقم الهاتف').fill('01000000000')
    await page.getByLabel('البريد الإلكتروني').fill(`e2e-${unique}@example.invalid`)
    await page.getByRole('button', { name: 'إنشاء العميل' }).click()

    await expect(page).toHaveURL(/\/clients\/[0-9a-f-]+$/)
    await expect(page.getByRole('heading', { name: clientName })).toBeVisible()

    await page.getByRole('link', { name: 'تعديل' }).click()
    await expect(page).toHaveURL(/\/clients\/[0-9a-f-]+\/edit$/)
    await page.getByLabel('اسم العميل *').fill(updatedName)
    await page.getByRole('button', { name: 'حفظ التعديلات' }).click()

    await expect(page).toHaveURL(/\/clients\/[0-9a-f-]+$/)
    await expect(page.getByRole('heading', { name: updatedName })).toBeVisible()

    await page.getByLabel('أضف ملاحظة').fill(noteBody)
    await page.getByRole('button', { name: 'حفظ الملاحظة' }).click()
    await expect(page.getByText(noteBody)).toBeVisible()

    await page.getByRole('link', { name: /العملاء/ }).first().click()
    await expect(page).toHaveURL(/\/clients$/)

    await page.getByLabel('بحث في العملاء').fill(updatedName)
    await page.getByRole('button', { name: 'بحث' }).click()

    await expect(page.getByRole('link', { name: new RegExp(updatedName) })).toBeVisible()
    await expect(page.getByText(noteBody)).not.toBeVisible()
  })
})
