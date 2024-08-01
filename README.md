# Checkly Frontend Challenge

## 1. Proof of concept for an analytics page

## 1.1 Description
The following sums up the coding challenge of part one.
If we talk about a poc, speed is often key to getting user feedback as fast as possible.
I therefore tried to keep it very simple, and I chose to use some composables from 
the @vueuse-package, so I don't have to reinvent the wheel.

I hope this is fine for you. If it isn't, I am open to redo it without them.


!!! Important usage note: To see the app in action, run 
```sh
npm run dev
```
and 
```sh
npm run backend-v2
``` 
to spin up the customized backend.
## 1.2 Backend
When I started to work on this project, I didn't immediately see the script "backend" in the package.json, so I was wondering how to run the backend.
My conclusion was that I needed to implement this on my own. I therefore did the following things:

- Migrated the backend.js to typescript
- Split check and checkStats into two different maps.
- By having the check and checkStats split, I provided one api-endpoint to fetch the checks (/checks), and one additional endpoint to fetch all stats for a given check (/checks/{checkId})
- This way, I could load all the stats for a check in the UI whenever a check was clicked / hovered (eager), and I did't have to load them all at once.

## 1.3 UI - State management
I didn't add a store like would in a larger project (pinia). The reason is that the data used in this app (check or stats) is scoped to the check table, so
it is possible to manage the state locally, a store is optional.

## 1.4 UI - API management
I did create an api.ts file, in which I grouped the api-calls for the backend, as well as the associated types. If there was a swagger doc available, I could have used
the openapi-generator to directly an automatically generate the api-calls etc..
Managing this manually is actually a no-go! ;)

## 1.5 UI - Performance
To make sure the best performance overall (including the backend) is reached, I updated the api as described in #1.2.
This allows the client to only fetch the stats for a check if a user clicks or hovers a check (prefetching for a better ux).

## 1.6 UI - Routing
No routing was needed for this poc. If we would like the user to jump to the stats of a check via the url, we could do this in the following manner:
- use the vue-router package
- migrate the right side of the page to a separate page, e.g. /checks
- whenever the user click on a check (the check is opened), update the url to /check/{id}
- whenever the user enters a url that contains a check, e.g. /check/234324, we could open the check as soon as the check are fetched from the backend

## 1.7 UI - UI Testing
Playwright tests were added in the checks.spec.ts file. You will find the following there:
- A page object (https://martinfowler.com/bliki/PageObject.html) for the checks page called "CheckPage"
- Mocked backend routes in the page object
- Created a custom fixture that injects the page object into each test, sets up the http mocks and opens the page. No need to repeat ourself multiple times.
- Two tests written in the gherkin syntax for consistency. Makes is easier to import them into other tools later, e.g. Jira + xray, or for discussing and defining test cases with the testing team

## 1.8 UI - Unit Testing
A unit test was written in the domain folder to test the domain specific logic.

## 1.9 UI - UI accessibility testing
Beginning in 2025, there will be a law in germany that requires companies to provide a certain level of accessibility.
For a poc this is maybe overkill, but I still added accessibility tests via the @axe-core package for the checks-page.

## 1.10 UI - Additional notes
- CSS: I know that the ui team at Checkly uses tailwind, and so do I in my projects at liebherr. I decided to stick to scss to show that I can also write css in the traditional way ;)
- VueUse: I used three composables from the @vueuse/core package to speed up the development and also simplify the code.
- Domain: I always maintain all domain related logic outside of the components to make it easy to test them and to keep them separated. I therefore moved some domain related stuff to the domain-folder.

# 2. Create a component

I included the searchbar in the checks page. If you open the app you can see and use it.
You can also filter the checks via the searchbar. This sums up what I did:

- Created the component and used it in the app
- Documented it in storybook
- Added the functionality to focus the searchbar via "/"
- Added component tests (visual regression, accessibility (not all fixed though), interaction)

## 2.1 Testing
We can test the component by creating an environment for playwright were a component is created / loaded in isolation (I used the playwright-experimental-ct-vue package for it). 
Then all the accessibility, visual and interaction tests can be done against that. This is something I did at liebherr by overwriting the page.setContent-Method to load all the library related css, js and then use it like this:
```ts
test('example', async ({ page } => {
    page.setContent(`<lh-button>Button</lh-button>`)

    // Interaction
    await page.locator('lh-button').click()
    await expect(...).toBe(...)

    // Visual regression
    await expect(page).toHaveScreenshot('button-default')

    // Accessibility
    const results = await new AxeBuilder({ page: CheckPage.page }).analyze()
    expect(results.violations).toEqual([])
}))
```

You can find my test cases for the searchbar in the components folder next to the searchbar.

- Component / interaction tests: The playwright-component-testing package is used to test the component in isolation.
- Accessibility tests: As described in 1.9, it is important to ensure a certain level of accessibility. We could also use @axe-core here to test that. 
- Visual tests: Helpful to add visual regression tests to ensure changes to global css, etc. don't break the layout. 

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### 📦 Components

Reusable components are located on `src/components/library`

Existing components can be imported on the vue application via

```js
import Icon from './src/components/library/icon'
```

#### Storybook

```bash
$ npm run storybook
```
