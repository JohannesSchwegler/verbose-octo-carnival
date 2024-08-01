import { test as base, expect, Page } from '@playwright/test'
import type { Check, CheckStat } from '../src/api'
import AxeBuilder from '@axe-core/playwright'

class CheckPage {
  constructor(public page: Page) {}

  get checkTable() {
    return this.page.getByTestId('check-table')
  }

  get checkTableItem() {
    return this.page.getByTestId('check-table-item')
  }

  get checkTableItemIcon() {
    return this.page.getByTestId('check-table-item-icon')
  }

  get checkTableItemChart() {
    return this.page.getByTestId('check-table-item-chart')
  }

  async goToPage() {
    await this.page.route('**/checks', async (route) => {
      await route.fulfill({
        json: [
          {
            id: '1',
            name: 'Check-1',
            avg: 92,
            success: 99,
            p95: 92,
            p99: 21,
            type: 'BROWSER'
          }
        ] satisfies Check[]
      })
    })

    await this.page.route('**/checks/*', async (route) => {
      await route.fulfill({
        json: [
          {
            avg: 92,
            success: 99,
            p95: 92,
            p99: 21,
            timestamp: new Date().valueOf()
          }
        ] satisfies CheckStat[]
      })
    })

    await this.page.goto('/')
  }
}

const test = base.extend<{ CheckPage: CheckPage }>({
  CheckPage: async ({ page }, use) => {
    const todoPage = new CheckPage(page)
    await todoPage.goToPage()
    await use(todoPage)
  }
})

test(`Given the user enters the app
Then there should be one check`, async ({ CheckPage }) => {
  expect(await CheckPage.checkTableItem.count()).toBe(1)
})

test(`Given the user enters the app
And opens the first check
Then a chart should be displayed`, async ({ CheckPage }) => {
  await CheckPage.checkTableItemIcon.click()
  await expect(CheckPage.checkTableItemChart).toBeVisible()
})

test(`Given the user enters the app
Then there should be no accessibility violations`, async ({ CheckPage }) => {
  const results = await new AxeBuilder({ page: CheckPage.page }).analyze()
  expect(results.violations).toEqual([])
})
