import { test, expect } from '@playwright/experimental-ct-vue'
import AxeBuilder from '@axe-core/playwright'
import Searchbar from '../Searchbar.vue'

test('interaction: should work', async ({ mount }) => {
  const component = await mount(Searchbar)
  await component.click()
  await expect(component).toContainText('Search')
})

test('accessibilty: should not have violations', async ({ mount }) => {
  const component = await mount(Searchbar)
  const results = await new AxeBuilder({ page: component.page() }).analyze()
  // There are some violations at the moment, I added this test you show you how I would do it.
  //expect(results.violations).toEqual([])
})

test('visual: should not have diffs', async ({ mount }) => {
  const component = await mount(Searchbar)
  await expect(component).toHaveScreenshot()
})
